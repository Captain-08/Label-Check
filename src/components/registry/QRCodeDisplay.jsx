import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

/**
 * Renders a QR code for the given text payload. Uses a <canvas> via the
 * `qrcode` package (small, dependency-free, well-supported) — no network
 * calls, nothing sent anywhere.
 */
export default function QRCodeDisplay({ value, size = 176 }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    if (!canvasRef.current || !value) return

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      color: { dark: '#14213D', light: '#FFFFFF' },
    }).catch((err) => {
      if (!cancelled) setError('Could not render QR code.')
      console.error('QR render failed:', err)
    })

    return () => {
      cancelled = true
    }
  }, [value, size])

  if (error) {
    return <p className="text-xs font-medium text-violation">{error}</p>
  }

  return (
    <div className="inline-flex items-center justify-center rounded-md border border-line bg-white p-3">
      <canvas ref={canvasRef} width={size} height={size} className="h-auto max-w-full" />
    </div>
  )
}
