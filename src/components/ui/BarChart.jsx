/**
 * Minimal bar chart. data: [{ label, value }]
 */
export default function BarChart({ data, height = 160, barColor = '#14213D' }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const width = 100
  const gap = 3
  const barWidth = (width - gap * (data.length - 1)) / data.length

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 24)
          const x = i * (barWidth + gap)
          const y = height - 24 - barHeight
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={barColor} rx={1.2} opacity={0.9} />
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="4.5"
                fill="#5B6472"
                fontFamily="IBM Plex Mono, monospace"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
