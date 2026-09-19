/**
 * Product-authentication registry — a small, isolated data-service layer.
 *
 * PROTOTYPE STORAGE NOTICE: everything here is persisted to the browser's
 * localStorage, per-device and per-browser. There is no real backend, no
 * server-side database, and no cross-device sync. This is intentional for
 * the hackathon prototype (see project README) — every function below is
 * written so the *storage* can be swapped for real API calls later without
 * changing any calling UI code, as long as the returned shapes stay the
 * same.
 *
 * No secrets live here. Fingerprints/serials are public identifiers, not
 * credentials, and are generated with Web Crypto (see idGenerators.js).
 */

import { generateFingerprint, generateProductId, generateSerial } from './idGenerators.js'

const PRODUCTS_KEY = 'labelcheck.registry.products.v1'
const SCANS_KEY = 'labelcheck.registry.scans.v1'

/**
 * Simple, transparent prototype anomaly rule — NOT a real fraud-detection
 * system. If the same product identity is scanned this many times within
 * this short a window, later scans in that window are flagged "suspicious".
 */
export const SUSPICIOUS_SCAN_THRESHOLD = 3
export const SUSPICIOUS_WINDOW_MS = 2 * 60 * 1000 // 2 minutes

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    // localStorage can throw in private-browsing modes or when disabled —
    // fail soft rather than crashing the page.
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// ---- Products -------------------------------------------------------

export function getProducts() {
  return readJson(PRODUCTS_KEY, [])
}

function saveProducts(list) {
  return writeJson(PRODUCTS_KEY, list)
}

/**
 * Registers a new genuine product and generates its digital fingerprint,
 * serial number and QR payload. Returns the full stored record.
 */
export function registerProduct({ companyName, companyEmail, productName, category, serialPrefix }) {
  const record = {
    productId: generateProductId(),
    fingerprint: generateFingerprint(),
    serial: generateSerial(serialPrefix || companyName),
    companyName: companyName.trim(),
    companyEmail: companyEmail.trim(),
    productName: productName.trim(),
    category: category.trim(),
    status: 'REGISTERED',
    registeredAt: new Date().toISOString(),
  }

  const products = getProducts()
  products.unshift(record)
  saveProducts(products)
  return record
}

/** Looks up a product by fingerprint OR serial (case-insensitive). */
export function findProduct(identifier) {
  if (!identifier) return null
  const clean = identifier.trim().toUpperCase()
  if (!clean) return null
  return (
    getProducts().find((p) => p.fingerprint.toUpperCase() === clean || p.serial.toUpperCase() === clean) ?? null
  )
}

export function getProductsByCompanyEmail(companyEmail) {
  if (!companyEmail) return getProducts()
  const clean = companyEmail.trim().toLowerCase()
  return getProducts().filter((p) => p.companyEmail.toLowerCase() === clean)
}

// ---- Scans -----------------------------------------------------------

export function getScans() {
  return readJson(SCANS_KEY, [])
}

function saveScans(list) {
  return writeJson(SCANS_KEY, list)
}

export function getScansForFingerprint(fingerprint) {
  if (!fingerprint) return []
  return getScans().filter((s) => s.fingerprint === fingerprint)
}

/**
 * Looks up a product by the scanned/typed identifier, applies the
 * prototype anomaly rule, records a scan, and returns everything the
 * Verify Product page needs to render a result.
 *
 * result is one of: 'genuine' | 'suspicious' | 'not_found'
 * riskLevel is one of: 'low' | 'medium' | 'high'
 */
export function recordScanAndEvaluate(identifierRaw) {
  const identifier = (identifierRaw || '').trim()
  const product = findProduct(identifier)
  const now = new Date()

  let result = 'not_found'
  let riskLevel = 'high'
  let previousScansInWindow = 0

  if (product) {
    const recentScans = getScansForFingerprint(product.fingerprint).filter(
      (s) => now.getTime() - new Date(s.scannedAt).getTime() < SUSPICIOUS_WINDOW_MS
    )
    previousScansInWindow = recentScans.length
    const isSuspicious = recentScans.length >= SUSPICIOUS_SCAN_THRESHOLD
    result = isSuspicious ? 'suspicious' : 'genuine'
    riskLevel = isSuspicious ? 'medium' : 'low'
  }

  const scanRecord = {
    id: generateProductId(),
    identifier,
    fingerprint: product?.fingerprint ?? null,
    serial: product?.serial ?? null,
    productId: product?.productId ?? null,
    productName: product?.productName ?? null,
    companyName: product?.companyName ?? null,
    result,
    riskLevel,
    scannedAt: now.toISOString(),
  }

  const scans = getScans()
  scans.unshift(scanRecord)
  saveScans(scans)

  const totalPriorScans = product ? getScansForFingerprint(product.fingerprint).length - 1 : 0

  return { product, scanRecord, previousScansInWindow, totalPriorScans }
}

// ---- Aggregate stats ---------------------------------------------------

/**
 * Aggregate counters for the manufacturer dashboard. Pass a companyEmail to
 * scope to one manufacturer's products; omit it for the site-wide totals.
 */
export function getRegistryStats(companyEmail) {
  const products = getProductsByCompanyEmail(companyEmail)
  const fingerprints = new Set(products.map((p) => p.fingerprint))
  const allScans = getScans()
  const relevantScans = companyEmail ? allScans.filter((s) => s.fingerprint && fingerprints.has(s.fingerprint)) : allScans

  return {
    totalProducts: products.length,
    totalScans: relevantScans.length,
    genuineScans: relevantScans.filter((s) => s.result === 'genuine').length,
    suspiciousScans: relevantScans.filter((s) => s.result === 'suspicious').length,
    counterfeitRiskScans: relevantScans.filter((s) => s.result === 'not_found').length,
  }
}
