import { useMemo, useState } from 'react'
import { Package, ScanLine, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react'
import { getProductsByCompanyEmail, getRegistryStats, getScansForFingerprint } from '../../lib/productRegistryService.js'
import StatCard from '../../components/ui/StatCard.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import { formatDate } from '../../lib/utils.js'

export default function ManufacturerDashboard() {
  const [companyEmail, setCompanyEmail] = useState('')

  const filterEmail = companyEmail.trim() || undefined
  const stats = useMemo(() => getRegistryStats(filterEmail), [filterEmail])
  const products = useMemo(() => getProductsByCompanyEmail(filterEmail), [filterEmail])

  const columns = [
    { key: 'productName', header: 'Product' },
    { key: 'companyName', header: 'Manufacturer' },
    { key: 'fingerprint', header: 'Fingerprint', render: (r) => <span className="font-mono text-xs">{r.fingerprint}</span> },
    { key: 'serial', header: 'Serial', render: (r) => <span className="font-mono text-xs">{r.serial}</span> },
    { key: 'registeredAt', header: 'Registered', render: (r) => formatDate(r.registeredAt) },
    { key: 'scans', header: 'Scans', render: (r) => getScansForFingerprint(r.fingerprint).length },
  ]

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-xl font-semibold text-ink-700">Manufacturer Dashboard</h1>
        <p className="mt-1 text-sm text-steel">
          Registration and verification activity for products registered through LabelCheck.
        </p>
      </div>

      <div className="max-w-xs">
        <label className="mb-1.5 block text-xs font-medium text-steel">Filter by company email (optional)</label>
        <input
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-md border border-line bg-panel px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-ink-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Registered Products" value={stats.totalProducts} icon={Package} hint={filterEmail ? 'This company' : 'All manufacturers'} />
        <StatCard label="Total Scans" value={stats.totalScans} icon={ScanLine} />
        <StatCard label="Successful Verifications" value={stats.genuineScans} icon={ShieldCheck} tone="verified" />
        <StatCard label="Suspicious Scans" value={stats.suspiciousScans} icon={AlertTriangle} tone="caution" />
        <StatCard
          label="Counterfeit Risk Scans"
          value={filterEmail ? '—' : stats.counterfeitRiskScans}
          icon={XCircle}
          tone="violation"
          hint={filterEmail ? 'Only tracked site-wide (no product to attribute)' : undefined}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink-700">Registered products</p>
        <DataTable columns={columns} rows={products} rowKey="productId" />
      </div>
    </div>
  )
}
