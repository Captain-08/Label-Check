import { cn } from '../../lib/utils.js'

const TONE_CLASSES = {
  neutral: 'text-ink-700',
  verified: 'text-verified',
  caution: 'text-caution',
  violation: 'text-violation',
}

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', hint }) {
  return (
    <div className="scan-frame rounded-md border border-line bg-panel p-5 shadow-panel" style={{ '--sf-color': '#DBDFE1' }}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-steel">{label}</p>
        {Icon && <Icon size={16} className="text-steel" strokeWidth={2} />}
      </div>
      <p className={cn('mt-3 font-mono text-3xl font-semibold tabular', TONE_CLASSES[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-steel">{hint}</p>}
    </div>
  )
}
