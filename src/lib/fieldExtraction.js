/**
 * Basic field extraction from raw OCR text.
 *
 * This is deliberately simple, transparent regex/keyword matching — NOT a
 * Legal Metrology rules engine, and not a claim that any of this proves
 * legal compliance. It only answers "does something that looks like a
 * <field> appear in the OCR text, and how confidently?" Each field is
 * classified as one of: 'detected', 'review', 'missing'.
 *
 *   'detected' - a clear keyword + value pair was found (e.g. "MRP Rs. 99")
 *   'review'   - a plausible value was found but without a labelling
 *                keyword nearby, so it needs a human to confirm it's the
 *                right one (e.g. a bare "500 g" with no "Net Qty" label)
 *   'missing'  - nothing matching the pattern was found at all
 *
 * Swap this module out for a real NLP/rules pipeline later without
 * touching the UI, as long as `extractFields` keeps returning the same
 * shape (see REQUIRED_DECLARATIONS in mockAnalysisTemplates.js).
 */

import { REQUIRED_DECLARATIONS, describeCheckStatus, guessProductName } from '../data/mockAnalysisTemplates.js'

const QUANTITY_PATTERN = /\b\d+(?:\.\d+)?\s?(?:g|gm|gms|gram|grams|kg|kilogram|kilograms|ml|millilitre|milliliter|l|litre|liter|ltr)\b/i
const NET_KEYWORD_PATTERN = /\bnet\s*(?:wt|weight|qty|quantity|contents)?\b/i

const MRP_KEYWORD_VALUE_PATTERN = /\bm\.?\s?r\.?\s?p\.?\s*[:\-]?\s*(?:rs\.?|inr|₹)?\s*\d+(?:\.\d{1,2})?/i
const BARE_CURRENCY_PATTERN = /(?:₹|rs\.?)\s?\d+(?:\.\d{1,2})?/i

const MANUFACTURER_KEYWORD_PATTERN = /\b(marketed by|manufactured by|mfg\.?\s*by|packed by|packer\s*:|manufacturer\s*:)/i

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const PHONE_PATTERN = /(?:\+?91[-\s]?)?\b[6-9]\d{9}\b|\b1800[-\s]?\d{3}[-\s]?\d{3,4}\b/
const CARE_KEYWORD_PATTERN = /\b(consumer care|customer care|for complaints|toll[-\s]?free|customer service)\b/i

const DATE_KEYWORD_PATTERN = /\b(mfg|manufactured|packed on|pkd|mfd|best before|use by|exp(?:iry)?)\b/i
const MONTH_NAME = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
const DATE_VALUE_PATTERN = new RegExp(
  `\\b(?:\\d{1,2}[\\/\\-.]\\d{1,2}[\\/\\-.]\\d{2,4}|(?:${MONTH_NAME})[a-z]*\\.?\\s*'?\\d{2,4})\\b`,
  'i'
)

/**
 * @param {string} rawText - raw text returned by the OCR engine
 * @param {string} fallbackSeed - filename or similar, used only if no
 *   product-name candidate can be found in the OCR text
 * @returns {{ checks: Array, productName: string }}
 */
export function extractFields(rawText, fallbackSeed = 'uploaded-product') {
  const text = rawText || ''
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const results = {
    name: extractProductName(lines),
    quantity: extractQuantity(text),
    mrp: extractMrp(text),
    manufacturer: extractManufacturer(text),
    consumerCare: extractConsumerCare(text),
    declaration: extractDate(text),
  }

  const checks = REQUIRED_DECLARATIONS.map((decl) => {
    const result = results[decl.id]
    return {
      ...decl,
      status: result.status,
      matchedText: result.matchedText,
      ...describeCheckStatus(result.status),
    }
  })

  return {
    checks,
    productName: results.name.matchedText || guessProductName(fallbackSeed),
  }
}

function extractQuantity(text) {
  const match = text.match(QUANTITY_PATTERN)
  if (!match) return { status: 'missing', matchedText: null }

  const index = match.index ?? 0
  const nearby = text.slice(Math.max(0, index - 25), index)
  const hasNetKeyword = NET_KEYWORD_PATTERN.test(nearby) || NET_KEYWORD_PATTERN.test(match[0])
  return { status: hasNetKeyword ? 'detected' : 'review', matchedText: match[0].trim() }
}

function extractMrp(text) {
  const labelled = text.match(MRP_KEYWORD_VALUE_PATTERN)
  if (labelled) return { status: 'detected', matchedText: labelled[0].trim() }

  const bare = text.match(BARE_CURRENCY_PATTERN)
  if (bare) return { status: 'review', matchedText: bare[0].trim() }

  return { status: 'missing', matchedText: null }
}

function extractManufacturer(text) {
  const match = text.match(MANUFACTURER_KEYWORD_PATTERN)
  if (!match) return { status: 'missing', matchedText: null }

  const start = match.index ?? 0
  const snippet = text.slice(start, start + 90).replace(/\s+/g, ' ').trim()
  // A keyword with almost nothing meaningful after it still needs a human look.
  const afterKeyword = snippet.slice(match[0].length).trim()
  if (afterKeyword.length < 4) return { status: 'review', matchedText: snippet }
  return { status: 'detected', matchedText: snippet }
}

function extractConsumerCare(text) {
  const email = text.match(EMAIL_PATTERN)
  const phone = text.match(PHONE_PATTERN)
  const hasKeyword = CARE_KEYWORD_PATTERN.test(text)

  if ((email || phone) && hasKeyword) {
    return { status: 'detected', matchedText: (email?.[0] || phone?.[0]).trim() }
  }
  if (email || phone) {
    return { status: 'review', matchedText: (email?.[0] || phone?.[0]).trim() }
  }
  if (hasKeyword) {
    return { status: 'review', matchedText: text.match(CARE_KEYWORD_PATTERN)[0] }
  }
  return { status: 'missing', matchedText: null }
}

function extractDate(text) {
  const keywordMatch = text.match(DATE_KEYWORD_PATTERN)
  const valueMatch = text.match(DATE_VALUE_PATTERN)

  if (keywordMatch && valueMatch) {
    return { status: 'detected', matchedText: valueMatch[0].trim() }
  }
  if (valueMatch) {
    return { status: 'review', matchedText: valueMatch[0].trim() }
  }
  return { status: 'missing', matchedText: null }
}

function extractProductName(lines) {
  // Heuristic only: skip lines that look like they belong to one of the
  // other fields (numbers, currency, dates, emails, phone numbers), then
  // take the first remaining line of plausible length as the product
  // name candidate. Lines near the top of the OCR text are treated with
  // more confidence, since packaging usually leads with the brand/product.
  const skipPatterns = [QUANTITY_PATTERN, BARE_CURRENCY_PATTERN, MRP_KEYWORD_VALUE_PATTERN, EMAIL_PATTERN, PHONE_PATTERN, DATE_VALUE_PATTERN, /^\d+$/]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.length < 3 || line.length > 60) continue
    if (skipPatterns.some((p) => p.test(line))) continue
    if (!/[a-zA-Z]/.test(line)) continue

    return { status: i < 3 ? 'detected' : 'review', matchedText: line }
  }

  return { status: 'missing', matchedText: null }
}
