import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine } from 'lucide-react'
import ImageDropzone from '../components/inspection/ImageDropzone.jsx'
import AnalysisProgress from '../components/inspection/AnalysisProgress.jsx'
import { useInspections } from '../context/InspectionContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { runComplianceAnalysis } from '../lib/analysisEngine.js'

export default function NewInspection() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stage, setStage] = useState('')
  const [error, setError] = useState('')
  const { addInspection } = useInspections()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileSelected(selected) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
  }

  async function handleAnalyze() {
    if (!file) return
    setError('')
    setIsAnalyzing(true)
    try {
      const analysis = await runComplianceAnalysis(file, setStage)
      const record = addInspection({
        product: analysis.productName,
        category: analysis.category,
        imageUrl: previewUrl,
        inspector: user?.name ?? 'Demo Inspector',
        analysis,
      })
      navigate(`/inspection/analysis/${record.id}`)
    } catch (err) {
      console.error('OCR analysis failed:', err)
      setError(
        'OCR could not run on this image. This usually means the browser could not download the OCR engine ' +
          '(check your internet connection) or the file is not a readable image. Please try again.'
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fadeUp">
      <div className="rounded-md border border-line bg-panel p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700">
            <ScanLine size={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-700">Before you upload</p>
            <p className="mt-1 text-sm text-steel">
              Photograph the front and back of the pack so the product name, net quantity, MRP,
              manufacturer details and consumer-care information are all legible in a single frame.
              This prototype runs real OCR (Tesseract.js) in your browser, then checks the extracted
              text with simple pattern matching — it does not yet apply the full Legal Metrology
              rules engine, and OCR text alone does not establish legal compliance.
            </p>
          </div>
        </div>
      </div>

      {isAnalyzing ? (
        <AnalysisProgress currentStage={stage} />
      ) : (
        <>
          <ImageDropzone file={file} previewUrl={previewUrl} onFileSelected={handleFileSelected} onClear={handleClear} />
          {error && (
            <p className="rounded-md border border-violation-border bg-violation-bg px-4 py-3 text-sm text-violation">
              {error}
            </p>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!file}
            className="w-full rounded-md bg-ink-700 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-steel"
          >
            Analyze Product
          </button>
        </>
      )}
    </div>
  )
}
