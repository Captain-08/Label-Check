/**
 * Secure random identifier generation for the product-authentication
 * prototype.
 *
 * Everything here uses the browser's Web Crypto API (`crypto.getRandomValues`
 * / `crypto.randomUUID`), NOT `Math.random()`, so identifiers are not
 * predictable or guessable. There are no secrets here — fingerprints and
 * serials are meant to be public identifiers (like a serial number printed
 * on a box), not authentication credentials.
 */

const ALNUM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function randomBytes(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

function randomHex(byteLength) {
  return Array.from(randomBytes(byteLength), (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

function randomDigits(count) {
  return Array.from(randomBytes(count), (b) => String(b % 10)).join('')
}

function randomAlnum(count) {
  return Array.from(randomBytes(count), (b) => ALNUM_CHARS[b % ALNUM_CHARS.length]).join('')
}

/** A UUID for internal record-keeping (not shown to end users as "the" ID). */
export function generateProductId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for browsers without crypto.randomUUID, still CSPRNG-backed.
  const bytes = randomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

/**
 * Digital Product Fingerprint, e.g. "LC-A1B2C3-D4E5F6-123456-ABCDEF".
 * Built from cryptographically random bytes — not sequential, not guessable.
 */
export function generateFingerprint() {
  return `LC-${randomHex(3)}-${randomHex(3)}-${randomDigits(6)}-${randomHex(3)}`
}

/**
 * Serial number, e.g. "XYZ-CR-9K2M4P7Q1R5T". Uses the manufacturer-supplied
 * prefix (sanitized) followed by 12 cryptographically random characters.
 */
export function generateSerial(prefix) {
  const cleanPrefix = (prefix || 'LC')
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 20)
  return `${cleanPrefix || 'LC'}-${randomAlnum(12)}`
}

/** Compact string encoded into the QR code — see productRegistryService.js. */
export function encodeQrPayload({ fingerprint, serial }) {
  return `LABELCHECK|${fingerprint}|${serial}`
}

/**
 * Pulls a fingerprint/serial out of whatever a QR scan returned. Falls back
 * to treating the whole scanned string as the identifier, so a QR code
 * containing just a bare fingerprint still works.
 */
export function parseScannedPayload(text) {
  if (typeof text !== 'string') return ''
  const trimmed = text.trim()
  if (trimmed.startsWith('LABELCHECK|')) {
    const [, fingerprint] = trimmed.split('|')
    return fingerprint || trimmed
  }
  return trimmed
}
