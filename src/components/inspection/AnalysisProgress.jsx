import { Loader2, Check } from 'lucide-react'
import { ANALYSIS_STAGES as STAGES } from '../../lib/analysisEngine.js'

export default function AnalysisProgress({ currentStage }) {
  const currentIndex = STAGES.indexOf(currentStage)

  return (
    <div className="mx-auto max-w-md rounded-md border border-line bg-panel p-6">
      <p className="mb-4 text-sm font-medium text-ink-700">Running preliminary compliance check…</p>
      <ul className="space-y-3">
        {STAGES.map((stage, i) => {
          const isDone = currentIndex > i
          const isActive = currentIndex === i
          return (
            <li key={stage} className="flex items-center gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verified text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
                {isActive && <Loader2 size={16} className="animate-spin text-ink-700" />}
                {!isDone && !isActive && <span className="h-1.5 w-1.5 rounded-full bg-line" />}
              </span>
              <span className={isDone || isActive ? 'text-ink-700' : 'text-steel'}>{stage}</span>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 text-xs text-steel">
        OCR runs locally in your browser. Field detection uses simple text pattern-matching —
        results are preliminary and not a legal compliance determination.
      </p>
    </div>
  )
}
