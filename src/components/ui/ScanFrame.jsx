import { cn } from '../../lib/utils.js'

/**
 * Wraps children with four corner brackets, evoking a scan target.
 * Used around anything the product image the app is "reading".
 */
export default function ScanFrame({ children, color = '#8A6D3B', className, active = false }) {
  return (
    <div className={cn('scan-frame', className)} style={{ '--sf-color': color }}>
      {children}
      <span className="sf-bl" />
      <span className="sf-br" />
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px animate-scanline"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          />
        </div>
      )}
    </div>
  )
}
