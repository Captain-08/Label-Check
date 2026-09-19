/**
 * Compliance analysis pipeline.
 *
 * MILESTONE 1 STATUS:
 *   image -> OCR -> text extraction -> declaration identification   REAL
 *   product / category identification                              STUBBED
 *   Legal Metrology rules engine                                    STUBBED
 *   compliance result -> report generation                          BASIC (derived from field checks only)
 *
 * The OCR + basic field-extraction steps are now real (see ocrService.js
 * and fieldExtraction.js). Category identification and the full Legal
 * Metrology rules engine are intentionally NOT implemented yet — that is
 * a separate milestone. The "score" and "status" below are a simple,
 * transparent function of which fields were detected, not a legal
 * compliance determination.
 */

import { runOcr } from './ocrService.js'
import { extractFields } from './fieldExtraction.js'
import { BOX_LAYOUT, REQUIRED_DECLARATIONS } from '../data/mockAnalysisTemplates.js'

/** Stage labels, in order. Shared with AnalysisProgress.jsx so the two
 *  never drift out of sync. */
export const ANALYSIS_STAGES = [
  'Loading OCR engine',
  'Recognizing text (OCR)',
  'Extracting label fields',
  'Scoring preliminary result',
  'Preparing report',
]

/** Stage (stub): identify product category — would determine which
 *  Legal Metrology rules apply (food vs. cosmetics vs. electronics, etc).
 *  Not implemented in this milestone. */
async function stageProductIdentification(_ocrText) {
  return { status: 'stubbed', note: 'Category identification not yet implemented.' }
}

/** Stage (stub): evaluate declarations against the actual Legal Metrology
 *  (Packaged Commodities) Rules for the identified category. Not
 *  implemented in this milestone — see scoreFromChecks() below for the
 *  simple placeholder scoring used instead. */
async function stageRulesEngine(_checks, _category) {
  return { status: 'stubbed', note: 'Legal Metrology rules engine not yet implemented.' }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Runs the real OCR + field-extraction pipeline for an uploaded image.
 * Reports progress through `onStageChange` so the UI can show a realistic
 * multi-step loading sequence.
 *
 * @param {File} imageFile
 * @param {(stageLabel: string) => void} onStageChange
 * @returns {Promise<object>} an analysis result — see the return value below
 */
export async function runComplianceAnalysis(imageFile, onStageChange = () => {}) {
  onStageChange(ANALYSIS_STAGES[0]) // Loading OCR engine

  const ocrResult = await runOcr(imageFile, ({ stage }) => {
    onStageChange(stage)
  })

  onStageChange(ANALYSIS_STAGES[2]) // Extracting label fields
  const { checks, productName } = extractFields(ocrResult.text, imageFile?.name)

  onStageChange(ANALYSIS_STAGES[3]) // Scoring preliminary result
  await stageProductIdentification(ocrResult.text)
  await stageRulesEngine(checks, null)
  const { score, status } = scoreFromChecks(checks)
  const { issues, recommendations, manualVerification } = summarizeChecks(checks)

  onStageChange(ANALYSIS_STAGES[4]) // Preparing report
  await wait(250)

  const boxes = REQUIRED_DECLARATIONS.map((decl) => {
    const check = checks.find((c) => c.id === decl.id)
    return { id: decl.id, label: decl.boxLabel, status: check.status, ...BOX_LAYOUT[decl.id] }
  })

  return {
    productName,
    category: 'Not yet determined (category identification not implemented)',
    score,
    status,
    checks,
    boxes,
    issues,
    recommendations,
    manualVerification,
    ocrText: ocrResult.text,
    ocrConfidence: ocrResult.confidence,
    analyzedAt: new Date().toISOString(),
  }
}

/**
 * Simple, transparent scoring: each field is worth an equal share of the
 * total. Detected = full credit, needs-review = half credit, not detected
 * = no credit. This is a placeholder for the real Legal Metrology rules
 * engine, not a compliance determination.
 */
function scoreFromChecks(checks) {
  const total = checks.length
  const points = checks.reduce((sum, c) => {
    if (c.status === 'detected') return sum + 1
    if (c.status === 'review') return sum + 0.5
    return sum
  }, 0)
  const score = Math.round((points / total) * 100)

  const missingCount = checks.filter((c) => c.status === 'missing').length
  const reviewCount = checks.filter((c) => c.status === 'review').length

  let status = 'compliant'
  if (missingCount > 0) status = 'violation'
  else if (reviewCount > 0) status = 'review'

  return { score, status }
}

/** Turns per-field statuses into the three summary lists the results/report
 *  pages already display, so no UI changes were needed for this milestone. */
function summarizeChecks(checks) {
  const issues = []
  const recommendations = []
  const manualVerification = []

  for (const c of checks) {
    if (c.status === 'missing') {
      issues.push(`${c.label} was not found anywhere in the OCR text.`)
      manualVerification.push(c.label)
    } else if (c.status === 'review') {
      issues.push(`A possible match for "${c.label}" was found, but not with enough confidence to mark it detected.`)
      manualVerification.push(c.label)
    }
  }

  if (issues.length === 0) {
    recommendations.push('All checked fields were found in the OCR text. Retain this report with the batch inspection record.')
  } else {
    recommendations.push('Re-photograph the pack in better lighting/focus and re-run the check for any field marked above.')
    recommendations.push('Confirm every flagged field manually — OCR text matching alone does not establish legal compliance.')
  }

  return { issues, recommendations, manualVerification }
}

export { REQUIRED_DECLARATIONS }
