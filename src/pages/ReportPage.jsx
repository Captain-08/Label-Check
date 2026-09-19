import { Navigate, useParams } from 'react-router-dom'
import { Download, FileJson, ShieldCheck } from 'lucide-react'
import { useInspections } from '../context/InspectionContext.jsx'
import BoundingBoxOverlay from '../components/inspection/BoundingBoxOverlay.jsx'
import ComplianceChecklist from '../components/ui/ComplianceChecklist.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { formatDateTime } from '../lib/utils.js'

const DISCLAIMER =
  'This report represents an automated preliminary assessment and does not constitute a legal certification of compliance. Final verification should be performed by an authorized authority.'

export default function ReportPage() {
  const { id } = useParams()
  const { getById } = useInspections()
  const record = getById(id)

  if (!record) return <Navigate to="/history" replace />

  const { analysis } = record

  function handleExportJson() {
    const payload = {
      inspectionId: record.id,
      product: record.product,
      category: record.category,
      date: record.date,
      inspector: record.inspector,
      score: record.score,
      status: record.status,
      checks: analysis.checks.map((c) => ({ label: c.label, status: c.status })),
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      manualVerification: analysis.manualVerification,
      disclaimer: DISCLAIMER,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${record.id}-report.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 animate-fadeUp">
      <div className="no-print flex flex-wrap justify-end gap-3">
        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-300"
        >
          <FileJson size={15} />
          Export Report
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-ink-700 px-4 py-2 text-sm font-medium text-white hover:bg-ink-600"
        >
          <Download size={15} />
          Download PDF
        </button>
      </div>

      <div id="printable-report" className="rounded-md border border-line bg-white p-4 shadow-panel sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-ink-700 text-brass">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-700">LabelCheck</p>
              <p className="text-xs text-steel">Preliminary Compliance Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-steel">{record.id}</p>
            <p className="text-xs text-steel">{formatDateTime(record.date)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-steel">Product</p>
            <h2 className="text-lg font-semibold text-ink-700">{record.product}</h2>
            <p className="text-xs text-steel">{record.category} · Inspected by {record.inspector}</p>
          </div>
          <StatusBadge status={record.status} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BoundingBoxOverlay imageUrl={record.image} productName={record.product} boxes={analysis.boxes} />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-ink-700">Compliance checks</p>
              <p className="font-mono text-sm text-ink-700">{record.score}%</p>
            </div>
            <ComplianceChecklist checks={analysis.checks} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ReportSection title="Issues found" items={analysis.issues} empty="None." />
          <ReportSection title="Recommendations" items={analysis.recommendations} empty="None." />
          <ReportSection title="Needs manual verification" items={analysis.manualVerification} empty="None." />
        </div>

        <div className="mt-8 rounded-md border border-line bg-ink-50/50 p-4">
          <p className="text-xs leading-relaxed text-steel">{DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}

function ReportSection({ title, items, empty }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-steel">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-ink-700">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm leading-snug text-ink-700">
              — {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
