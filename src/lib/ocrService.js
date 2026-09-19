/**
 * OCR service.
 *
 * Wraps Tesseract.js so the rest of the app only depends on a small,
 * stable function signature (`runOcr`). This keeps the OCR *library*
 * swappable later (e.g. a server-side OCR API) without touching any
 * React components — only this file and analysisEngine.js would change.
 *
 * Tesseract.js runs entirely in the browser (WebAssembly + a web worker).
 * No API key and no server round-trip is required. By default it fetches
 * its worker/core/language-data files from a public CDN the first time it
 * runs, so the browser needs internet access on first use (see the
 * "Limitations" note in the project README). Nothing here uses a paid
 * API.
 */

import { createWorker } from 'tesseract.js'

/**
 * Runs OCR on an image and returns the extracted text plus an overall
 * confidence score.
 *
 * @param {File|Blob|string} imageSource - an uploaded File, or any source
 *   Tesseract.js accepts (data URL, object URL, etc.)
 * @param {(progress: { stage: string, percent: number }) => void} onProgress
 *   optional callback fired as Tesseract reports progress through its own
 *   internal stages (loading the model, recognizing text, etc.)
 * @returns {Promise<{ text: string, confidence: number|null, words: Array }>}
 */
export async function runOcr(imageSource, onProgress = () => {}) {
  if (!imageSource) {
    throw new Error('runOcr: an image file is required')
  }

  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message && typeof message.progress === 'number') {
        onProgress({
          stage: humanizeTesseractStatus(message.status),
          percent: Math.round(message.progress * 100),
        })
      }
    },
  })

  try {
    const { data } = await worker.recognize(imageSource)
    return {
      text: (data?.text ?? '').trim(),
      // Tesseract reports confidence 0-100 at the page level.
      confidence: typeof data?.confidence === 'number' ? Math.round(data.confidence) : null,
      // Word-level boxes, kept for future use (e.g. real bounding-box
      // overlays instead of the current simulated ones). Not used yet.
      words: data?.words ?? [],
    }
  } finally {
    // Always release the worker/WASM resources, even if recognition threw.
    await worker.terminate()
  }
}

function humanizeTesseractStatus(status) {
  switch (status) {
    case 'loading tesseract core':
    case 'initializing tesseract':
      return 'Loading OCR engine'
    case 'loading language traineddata':
    case 'initialized api':
      return 'Loading OCR engine'
    case 'recognizing text':
      return 'Recognizing text (OCR)'
    default:
      return 'Recognizing text (OCR)'
  }
}
