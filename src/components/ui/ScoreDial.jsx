const TONE_COLOR = { compliant: '#1F7A5C', review: '#A97319', violation: '#A8342A' }

export default function ScoreDial({ score, status, size = 88 }) {
  const thickness = 9
  const radius = size / 2 - thickness / 2
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference
  const color = TONE_COLOR[status] ?? '#5B6472'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E7E9E5" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </g>
      <text x="50%" y="53%" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="20" fontWeight="600" fill="#14213D">
        {score}%
      </text>
    </svg>
  )
}
