import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useInspections } from '../context/InspectionContext.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { formatDate } from '../lib/utils.js'

export default function Reports() {
  const { inspections } = useInspections()

  return (
    <div className="space-y-4 animate-fadeUp">
      <p className="text-sm text-steel">
        Every inspection generates a preliminary compliance report. Open one to review the full
        checklist and export it.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {inspections.map((r) => (
          <Link
            key={r.id}
            to={`/report/${r.id}`}
            className="group rounded-md border border-line bg-panel p-4 transition-colors hover:border-ink-300"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700">
                <FileText size={15} />
              </span>
              <StatusBadge status={r.status} size="sm" />
            </div>
            <p className="mt-3 truncate text-sm font-medium text-ink-700">{r.product}</p>
            <p className="font-mono text-xs text-steel">{r.id}</p>
            <p className="mt-2 text-xs text-steel">{formatDate(r.date)} · Score {r.score}%</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
