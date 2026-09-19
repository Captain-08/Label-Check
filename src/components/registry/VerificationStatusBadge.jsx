import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const META = {
  genuine: { label: 'Likely Genuine', icon: CheckCircle2, classes: 'bg-verified-bg text-verified border-verified-border' },
  suspicious: { label: 'Suspicious', icon: AlertTriangle, classes: 'bg-caution-bg text-caution border-caution-border' },
  not_found: { label: 'High Counterfeit Risk', icon: XCircle, classes: 'bg-violation-bg text-violation border-violation-border' },
}

export default function VerificationStatusBadge({ result, size = 'md' }) {
  const meta = META[result] ?? META.not_found
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        meta.classes,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <Icon size={size === 'sm' ? 12 : 13} strokeWidth={2.5} />
      {meta.label}
    </span>
  )
}
