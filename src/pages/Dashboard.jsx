import { Link } from 'react-router-dom'
import { ClipboardCheck, ShieldCheck, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react'
import { useInspections } from '../context/InspectionContext.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import BarChart from '../components/ui/BarChart.jsx'
import DonutChart from '../components/ui/DonutChart.jsx'
import DataTable from '../components/ui/DataTable.jsx'
import { formatDate } from '../lib/utils.js'

export default function Dashboard() {
  const { inspections } = useInspections()

  const total = inspections.length
  const compliant = inspections.filter((i) => i.status === 'compliant').length
  const review = inspections.filter((i) => i.status === 'review').length
  const violation = inspections.filter((i) => i.status === 'violation').length

  const byDay = groupByDay(inspections)
  const recent = inspections.slice(0, 6)

  const columns = [
    { key: 'id', header: 'Inspection ID', render: (r) => <span className="font-mono text-xs text-steel">{r.id}</span> },
    { key: 'product', header: 'Product', render: (r) => <span className="font-medium">{r.product}</span> },
    { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
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
    <div className="space-y-6 animate-fadeUp">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Inspections" value={total} icon={ClipboardCheck} hint="All time, this workspace" />
        <StatCard label="Compliant" value={compliant} icon={ShieldCheck} tone="verified" hint={`${pct(compliant, total)}% of total`} />
        <StatCard label="Needs Review" value={review} icon={AlertTriangle} tone="caution" hint={`${pct(review, total)}% of total`} />
        <StatCard label="Potential Violations" value={violation} icon={XCircle} tone="violation" hint={`${pct(violation, total)}% of total`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-md border border-line bg-panel p-5 shadow-panel lg:col-span-3">
          <p className="text-sm font-semibold text-ink-700">Inspections by day</p>
          <p className="mb-2 text-xs text-steel">Last {byDay.length} recorded days</p>
          <BarChart data={byDay} />
        </div>
        <div className="rounded-md border border-line bg-panel p-5 shadow-panel lg:col-span-2">
          <p className="text-sm font-semibold text-ink-700">Status breakdown</p>
          <p className="mb-4 text-xs text-steel">Across all recorded inspections</p>
          <DonutChart
            segments={[
              { label: 'Compliant', value: compliant, color: '#1F7A5C' },
              { label: 'Needs Review', value: review, color: '#A97319' },
              { label: 'Potential Violation', value: violation, color: '#A8342A' },
            ]}
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-700">Recent inspections</p>
          <Link to="/history" className="text-xs font-medium text-ink-700 hover:underline">
            View all
          </Link>
        </div>
        <DataTable columns={columns} rows={recent} />
      </div>
    </div>
  )
}

function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

function groupByDay(inspections) {
  const map = new Map()
  for (const i of inspections) {
    const day = new Date(i.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    map.set(day, (map.get(day) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .reverse()
    .slice(-7)
}
