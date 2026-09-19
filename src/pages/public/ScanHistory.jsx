import { useMemo } from 'react'
import { getScans } from '../../lib/productRegistryService.js'
import DataTable from '../../components/ui/DataTable.jsx'
import VerificationStatusBadge from '../../components/registry/VerificationStatusBadge.jsx'
import { formatDateTime } from '../../lib/utils.js'

const RISK_LABEL = { low: 'Low', medium: 'Medium', high: 'High' }

export default function ScanHistory() {
  const scans = useMemo(() => getScans(), [])

  const columns = [
    { key: 'productName', header: 'Product', render: (r) => r.productName ?? '— not registered —' },
    { key: 'serial', header: 'Serial', render: (r) => <span className="font-mono text-xs">{r.serial ?? '—'}</span> },
    { key: 'result', header: 'Result', render: (r) => <VerificationStatusBadge result={r.result} size="sm" /> },
    { key: 'riskLevel', header: 'Risk Level', render: (r) => RISK_LABEL[r.riskLevel] ?? r.riskLevel },
    { key: 'scannedAt', header: 'Date / Time', render: (r) => formatDateTime(r.scannedAt) },
  ]

  return (
    <div className="space-y-4 animate-fadeUp">
      <div>
        <h1 className="text-xl font-semibold text-ink-700">Scan History</h1>
        <p className="mt-1 text-sm text-steel">
          Every product verification performed in this browser, most recent first. Stored locally for this
          prototype — a production version would use a real backend.
        </p>
      </div>

      <DataTable columns={columns} rows={scans} rowKey="id" />
    </div>
  )
}
