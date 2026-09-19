import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpRight } from 'lucide-react'
import { useInspections } from '../context/InspectionContext.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import DataTable from '../components/ui/DataTable.jsx'
import { cn, formatDate } from '../lib/utils.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'compliant', label: 'Compliant' },
  { key: 'review', label: 'Needs Review' },
  { key: 'violation', label: 'Potential Violation' },
]

export default function InspectionHistory() {
  const { inspections } = useInspections()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    return inspections.filter((i) => {
      const matchesFilter = filter === 'all' || i.status === filter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q || i.product.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.inspector.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [inspections, query, filter])

  const columns = [
    { key: 'id', header: 'Inspection ID', render: (r) => <span className="font-mono text-xs text-steel">{r.id}</span> },
    { key: 'product', header: 'Product', render: (r) => <span className="font-medium">{r.product}</span> },
    { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
    { key: 'inspector', header: 'Inspector' },
    { key: 'score', header: 'Score', render: (r) => <span className="font-mono">{r.score}%</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} size="sm" /> },
    {
      key: 'view',
      header: '',
      render: (r) => (
        <Link to={`/report/${r.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-ink-700 hover:underline">
          View report <ArrowUpRight size={13} />
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fadeUp">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product, ID or inspector"
            className="w-full rounded-md border border-line bg-panel py-2.5 pl-9 pr-3 text-sm text-ink-700 outline-none focus:border-ink-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.key ? 'border-ink-700 bg-ink-700 text-white' : 'border-line bg-panel text-steel hover:border-ink-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={rows} />
    </div>
  )
}
