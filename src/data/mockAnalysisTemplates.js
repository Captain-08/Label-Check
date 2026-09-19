// Declarations checked, modelled loosely on Rule 6 of the Legal Metrology
// (Packaged Commodities) Rules, 2011. This list drives both the checklist
// UI and the simulated bounding-box overlay. It is intentionally simple —
// a real implementation would vary this per product category.
export const REQUIRED_DECLARATIONS = [
  { id: 'name', label: 'Product name', boxLabel: 'Product Name' },
  { id: 'quantity', label: 'Net quantity', boxLabel: 'Net Quantity' },
  { id: 'mrp', label: 'Maximum Retail Price (MRP)', boxLabel: 'MRP' },
  { id: 'manufacturer', label: 'Manufacturer / packer details', boxLabel: 'Manufacturer Details' },
  { id: 'consumerCare', label: 'Consumer-care information', boxLabel: 'Consumer Care' },
  { id: 'declaration', label: 'Month & year of manufacture / import', boxLabel: 'Mfg. Date Declaration' },
]

export const BOX_LAYOUT = {
  name: { x: 8, y: 6, w: 58, h: 12 },
  consumerCare: { x: 8, y: 42, w: 50, h: 13 },
  declaration: { x: 64, y: 42, w: 28, h: 13 },
  manufacturer: { x: 8, y: 59, w: 62, h: 15 },
  quantity: { x: 8, y: 78, w: 30, h: 12 },
  mrp: { x: 64, y: 78, w: 28, h: 12 },
}

// Three illustrative outcome profiles. A real system would derive these
// from actual OCR + rules-engine output rather than picking a template.
const PROFILES = [
  {
    status: 'compliant',
    scoreRange: [88, 97],
    checkStatuses: { name: 'detected', quantity: 'detected', mrp: 'detected', manufacturer: 'detected', consumerCare: 'detected', declaration: 'detected' },
    issues: [],
    recommendations: [
      'No issues detected. Retain this report with the batch inspection record.',
    ],
    manualVerification: [
      'Spot-check the printed MRP against the invoice for this batch.',
    ],
  },
  {
    status: 'review',
    scoreRange: [65, 82],
    checkStatuses: { name: 'detected', quantity: 'detected', mrp: 'detected', manufacturer: 'detected', consumerCare: 'review', declaration: 'review' },
    issues: [
      'Consumer-care contact details are partially obscured or in a font size that could not be confidently read.',
      'Month and year of manufacture could not be clearly located on the pack.',
    ],
    recommendations: [
      'Re-photograph the reverse panel in better lighting and re-run the check.',
      'Confirm consumer-care details manually against the approved artwork file.',
    ],
    manualVerification: [
      'Consumer-care information',
      'Month & year of manufacture / import',
    ],
  },
  {
    status: 'violation',
    scoreRange: [38, 61],
    checkStatuses: { name: 'detected', quantity: 'detected', mrp: 'detected', manufacturer: 'detected', consumerCare: 'review', declaration: 'missing' },
    issues: [
      'No month/year of manufacture or import declaration was detected anywhere on the visible faces of the pack.',
      'Consumer-care information is present but missing a functioning contact (no phone number or email pattern recognised).',
    ],
    recommendations: [
      'Escalate to the manufacturer for corrected packaging artwork before further sale.',
      'Withhold clearance pending a manual review by a Legal Metrology officer.',
    ],
    manualVerification: [
      'Month & year of manufacture / import',
      'Consumer-care information',
      'Overall pack compliance — recommend physical inspection',
    ],
  },
]

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export function describeCheckStatus(status) {
  if (status === 'detected') return { icon: 'check', tone: 'verified', text: 'Detected' }
  if (status === 'review') return { icon: 'alert', tone: 'caution', text: 'Needs review' }
  return { icon: 'cross', tone: 'violation', text: 'Not detected' }
}

/**
 * Builds a SIMULATED analysis result. Deterministic per `seedText` so the
 * same demo image produces the same result when re-run, while still
 * varying across different uploads.
 */
export function buildMockResult(seedText = 'sample') {
  const hash = hashString(seedText + Date.now().toString().slice(-3))
  const profile = PROFILES[hash % PROFILES.length]
  const [lo, hi] = profile.scoreRange
  const score = lo + (hash % (hi - lo + 1))

  const checks = REQUIRED_DECLARATIONS.map((decl) => {
    const status = profile.checkStatuses[decl.id]
    return { ...decl, status, ...describeCheckStatus(status) }
  })

  const boxes = REQUIRED_DECLARATIONS.map((decl) => {
    const status = profile.checkStatuses[decl.id]
    return {
      id: decl.id,
      label: decl.boxLabel,
      status,
      ...BOX_LAYOUT[decl.id],
    }
  })

  return {
    productName: guessProductName(seedText),
    category: 'Packaged Food',
    score,
    status: profile.status,
    checks,
    boxes,
    issues: profile.issues,
    recommendations: profile.recommendations,
    manualVerification: profile.manualVerification,
    analyzedAt: new Date().toISOString(),
  }
}

/**
 * Deterministic variant of buildMockResult used for seeding history data,
 * so reloading the app always shows the same demo records. Optionally
 * pins the outcome profile (0 = compliant, 1 = needs review, 2 = violation).
 */
export function buildSeededResult(seedText, productName, category, forcedScore, forcedProfileIndex) {
  const hash = hashString(seedText)
  const profileIndex = forcedProfileIndex ?? hash % PROFILES.length
  const profile = PROFILES[profileIndex]
  const [lo, hi] = profile.scoreRange
  const score = forcedScore ?? lo + (hash % (hi - lo + 1))

  const checks = REQUIRED_DECLARATIONS.map((decl) => {
    const status = profile.checkStatuses[decl.id]
    return { ...decl, status, ...describeCheckStatus(status) }
  })

  const boxes = REQUIRED_DECLARATIONS.map((decl) => {
    const status = profile.checkStatuses[decl.id]
    return { id: decl.id, label: decl.boxLabel, status, ...BOX_LAYOUT[decl.id] }
  })

  return {
    productName,
    category,
    score,
    status: profile.status,
    checks,
    boxes,
    issues: profile.issues,
    recommendations: profile.recommendations,
    manualVerification: profile.manualVerification,
  }
}

export function guessProductName(seedText) {
  const cleaned = (seedText || '')
    .replace(/\.[a-zA-Z0-9]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  if (cleaned.length > 2 && cleaned.length < 48) {
    return toTitleCase(cleaned)
  }
  return 'Uploaded Packaged Product'
}

function toTitleCase(str) {
  return str
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}
