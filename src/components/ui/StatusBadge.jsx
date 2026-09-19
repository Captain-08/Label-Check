import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn, STATUS_META } from '../../lib/utils.js'

const TONE_CLASSES = {
  verified: 'bg-verified-bg text-verified border-verified-border',
  caution: 'bg-caution-bg text-caution border-caution-border',
  violation: 'bg-violation-bg text-violation border-violation-border',
}

const TONE_ICON = {
  verified: CheckCircle2,
  caution: AlertTriangle,
  violation: XCircle,
}

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] ?? { label: status, tone: 'caution' }
  const Icon = TONE_ICON[meta.tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        TONE_CLASSES[meta.tone],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <Icon size={size === 'sm' ? 12 : 13} strokeWidth={2.5} />
      {meta.label}
    </span>
  )
}
