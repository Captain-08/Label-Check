/**
 * Minimal donut chart. segments: [{ label, value, color }]
 */
export default function DonutChart({ segments, size = 140, thickness = 20 }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  const radius = size / 2 - thickness / 2
  const circumference = 2 * Math.PI * radius
  let offsetAcc = 0

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E7E9E5" strokeWidth={thickness} />
          {segments.map((s) => {
            const fraction = s.value / total
            const dash = fraction * circumference
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetAcc}
                strokeLinecap="butt"
              />
            )
            offsetAcc += dash
            return el
          })}
        </g>
        <text x="50%" y="47%" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="20" fontWeight="600" fill="#14213D">
          {total}
        </text>
        <text x="50%" y="61%" textAnchor="middle" fontFamily="IBM Plex Sans, sans-serif" fontSize="8" fill="#5B6472">
          TOTAL
        </text>
      </svg>
      <ul className="min-w-[160px] flex-1 space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span className="text-steel">{s.label}</span>
            <span className="ml-auto shrink-0 font-mono font-medium text-ink-700">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
