import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { CameraOff } from 'lucide-react'

/**
 * Renders a live camera preview and calls `onDetected(text)` the moment a
 * QR code is found. Stops the camera stream whenever `active` becomes
 * false or the component unmounts — cameras should never keep running
 * silently in the background.
 *
 * This uses the browser's native camera APIs (getUserMedia) plus jsQR for
 * decoding. It requires a secure context (HTTPS or localhost) and the user
 * granting camera permission — both handled gracefully below.
 */
export default function QRScanner({ active, onDetected, onError }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | starting | scanning | error

  useEffect(() => {
    if (active) {
      start()
    } else {
      stop()
    }
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      onError?.('This browser does not support camera access. Please enter the fingerprint or serial number manually.')
      return
    }
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('scanning')
      rafRef.current = requestAnimationFrame(tick)
    } catch (err) {
      console.error('Camera start failed:', err)
      setStatus('error')
      onError?.('Camera access was denied or unavailable. Please enter the fingerprint or serial number manually below.')
    }
  }

  function stop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setStatus((s) => (s === 'error' ? s : 'idle'))
  }

  function tick() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
      if (code?.data) {
        onDetected(code.data)
        return // let the parent flip `active` off; effect cleanup stops the camera
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-md border border-line bg-ink-900">
      <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      {status !== 'scanning' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/85 px-4 text-center text-ink-100">
          <CameraOff size={20} className="text-ink-300" />
          <p className="text-xs">
            {status === 'starting' && 'Starting camera…'}
            {status === 'error' && 'Camera unavailable — use manual entry below.'}
            {status === 'idle' && 'Camera stopped.'}
          </p>
        </div>
      )}
    </div>
  )
}
