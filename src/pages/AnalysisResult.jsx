import { Link, useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { FileText, LayoutDashboard, ScanText, ChevronDown, ChevronUp } from 'lucide-react'
import { useInspections } from '../context/InspectionContext.jsx'
import BoundingBoxOverlay from '../components/inspection/BoundingBoxOverlay.jsx'
import ComplianceChecklist from '../components/ui/ComplianceChecklist.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import ScoreDial from '../components/ui/ScoreDial.jsx'

export default function AnalysisResult() {
  const { id } = useParams()
  const { getById } = useInspections()
  const record = getById(id)
  const [showOcrText, setShowOcrText] = useState(false)

  if (!record) return <Navigate to="/history" replace />

  const { analysis } = record

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fadeUp">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-steel">{record.id}</p>
          <h2 className="text-xl font-semibold text-ink-700">{record.product}</h2>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BoundingBoxOverlay imageUrl={record.image} productName={record.product} boxes={analysis.boxes} />
          <p className="mt-3 text-center text-xs text-steel">
            Box positions are illustrative placeholders — status colors reflect real OCR-based field detection.
          </p>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-6 rounded-md border border-line bg-panel p-5">
            <ScoreDial score={analysis.score} status={record.status} />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-700">Compliance score</p>
              <p className="text-xs text-steel">
                Based on {analysis.checks.length} declarations matched from OCR text using basic pattern
                matching — this is a preliminary indicator, not a Legal Metrology rules-engine result.
              </p>
              {typeof analysis.ocrConfidence === 'number' && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink-700">
                  <ScanText size={12} />
                  OCR confidence: {analysis.ocrConfidence}%
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink-700">Detected declarations</p>
            <ComplianceChecklist checks={analysis.checks} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoList title="Potential issues" items={analysis.issues} empty="No issues detected." tone="violation" />
        <InfoList title="Recommendations" items={analysis.recommendations} empty="No further action recommended." tone="verified" />
        <InfoList title="Needs manual verification" items={analysis.manualVerification} empty="Nothing flagged for manual review." tone="caution" />
      </div>

      {typeof analysis.ocrText === 'string' && (
        <div className="rounded-md border border-line bg-panel p-4">
          <button
            onClick={() => setShowOcrText((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-ink-700">
              <ScanText size={15} />
              Extracted OCR text
            </span>
            {showOcrText ? <ChevronUp size={16} className="text-steel" /> : <ChevronDown size={16} className="text-steel" />}
          </button>
          {showOcrText && (
            <>
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md border border-line bg-white p-3 font-mono text-xs text-ink-700">
                {analysis.ocrText || '(No text could be recognized in this image.)'}
              </pre>
              <p className="mt-2 text-xs text-steel">
                Raw output from Tesseract.js, running locally in your browser. Provided for transparency —
                the field checks above are derived from this text via simple pattern matching, not a
                legal compliance review.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/report/${record.id}`}
          className="inline-flex items-center gap-2 rounded-md bg-ink-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-600"
        >
          <FileText size={15} />
          Open full report
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-300"
        >
          <LayoutDashboard size={15} />
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

function InfoList({ title, items, empty, tone }) {
  const dot = { violation: 'bg-violation', verified: 'bg-verified', caution: 'bg-caution' }[tone]
  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <p className="mb-3 text-sm font-semibold text-ink-700">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-steel">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
