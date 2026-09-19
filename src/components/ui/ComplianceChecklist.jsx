import { Check, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const ICONS = { check: Check, alert: AlertTriangle, cross: X }
const TONE_CLASSES = {
  verified: 'bg-verified text-white',
  caution: 'bg-caution text-white',
  violation: 'bg-violation text-white',
}

export default function ComplianceChecklist({ checks }) {
  return (
    <ul className="divide-y divide-line rounded-md border border-line bg-panel">
      {checks.map((c) => {
        const Icon = ICONS[c.icon]
        return (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[c.tone])}>
              <Icon size={12} strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1 text-sm text-ink-700">{c.label}</span>
            <span className="shrink-0 text-xs font-medium text-steel">{c.text}</span>
          </li>
        )
      })}
    </ul>
  )
}
