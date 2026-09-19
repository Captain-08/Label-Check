import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QrCode, Keyboard, History, ScanLine } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { recordScanAndEvaluate } from '../../lib/productRegistryService.js'
import { parseScannedPayload } from '../../lib/idGenerators.js'
import { formatDateTime, cn } from '../../lib/utils.js'
import QRScanner from '../../components/registry/QRScanner.jsx'
import VerificationStatusBadge from '../../components/registry/VerificationStatusBadge.jsx'

const MODES = [
  { key: 'scan', label: 'Scan QR Code', icon: QrCode },
  { key: 'manual', label: 'Enter Manually', icon: Keyboard },
]

export default function VerifyProduct() {
  const { isAuthenticated } = useAuth()
  const [mode, setMode] = useState('manual')
  const [scannerActive, setScannerActive] = useState(false)
  const [scanError, setScanError] = useState('')
  const [identifierInput, setIdentifierInput] = useState('')
  const [outcome, setOutcome] = useState(null)

  function verify(identifier) {
    if (!identifier || !identifier.trim()) return
    setScanError('')
    setScannerActive(false)
    const evaluation = recordScanAndEvaluate(identifier)
    setOutcome(evaluation)
  }

  function handleManualSubmit(e) {
    e.preventDefault()
    verify(identifierInput)
  }

  function handleDetected(rawText) {
    const identifier = parseScannedPayload(rawText)
    setIdentifierInput(identifier)
    verify(identifier)
  }

  function handleReset() {
    setOutcome(null)
    setIdentifierInput('')
    setScanError('')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-xl font-semibold text-ink-700">Verify Product</h1>
        <p className="mt-1 text-sm text-steel">
          Check a product's registered digital identity before you trust it. Scan its QR code, or enter the
          fingerprint or serial number printed on the pack.
        </p>
      </div>

      {!outcome && (
        <>
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === m.key ? 'border-ink-700 bg-ink-700 text-white' : 'border-line bg-panel text-steel hover:border-ink-300'
                )}
              >
                <m.icon size={13} />
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'scan' && (
            <div className="rounded-md border border-line bg-panel p-5">
              <QRScanner active={scannerActive} onDetected={handleDetected} onError={setScanError} />
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    setScanError('')
                    setScannerActive((v) => !v)
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-ink-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-600"
                >
                  <ScanLine size={15} />
                  {scannerActive ? 'Stop camera' : 'Start camera'}
                </button>
                {scanError && <p className="text-center text-xs font-medium text-violation">{scanError}</p>}
                <p className="text-center text-xs text-steel">
                  Camera access requires your permission and a secure connection. You can always switch to manual entry.
                </p>
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="rounded-md border border-line bg-panel p-5">
              <label htmlFor="identifier" className="mb-1.5 block text-xs font-medium text-steel">
                Product fingerprint or serial number
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="identifier"
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value)}
                  placeholder="LC-A1B2C3-D4E5F6-123456-ABCDEF"
                  className="w-full rounded-md border border-line bg-white px-3 py-2.5 font-mono text-sm text-ink-700 outline-none focus:border-ink-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md bg-ink-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-600"
                >
                  Verify
                </button>
              </div>
              <p className="mt-2 text-xs text-steel">Printed on the product packaging next to the QR code.</p>
            </form>
          )}
        </>
      )}

      {outcome && <VerificationResult outcome={outcome} isAuthenticated={isAuthenticated} onReset={handleReset} />}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs text-steel">
        <Link to="/scan-history" className="inline-flex items-center gap-1.5 font-medium text-ink-700 hover:underline">
          <History size={13} />
          View scan history
        </Link>
        <span>
          Digital identity verification checks the registry only — it does not physically inspect the product.
        </span>
      </div>
    </div>
  )
}

const RESULT_COPY = {
  genuine: {
    heading: 'Verification passed — this identity is registered.',
    panelClasses: 'border-verified-border bg-verified-bg',
  },
  suspicious: {
    heading: 'Verification passed, but unusual repeated scan behavior was detected for this identity.',
    panelClasses: 'border-caution-border bg-caution-bg',
  },
  not_found: {
    heading: 'Verification failed — this fingerprint or serial number is not in the registry.',
    panelClasses: 'border-violation-border bg-violation-bg',
  },
}

function VerificationResult({ outcome, isAuthenticated, onReset }) {
  const { product, scanRecord, totalPriorScans } = outcome
  const copy = RESULT_COPY[scanRecord.result]

  return (
    <div className={cn('space-y-4 rounded-md border p-5', copy.panelClasses)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <VerificationStatusBadge result={scanRecord.result} />
        <span className="font-mono text-xs text-steel">{formatDateTime(scanRecord.scannedAt)}</span>
      </div>
      <p className="text-sm text-ink-700">{copy.heading}</p>

      {product ? (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-md border border-line bg-white p-4 text-sm sm:grid-cols-2">
          <Field label="Product" value={product.productName} />
          <Field label="Manufacturer" value={product.companyName} />
          <Field label="Product Fingerprint" value={product.fingerprint} mono />
          <Field label="Serial Number" value={product.serial} mono />
          <Field label="Registration Status" value={`${product.status} / GENUINE`} />
          <Field label="Previous Scans" value={String(totalPriorScans)} />
          <Field
            label="Suspicious Activity"
            value={scanRecord.result === 'suspicious' ? 'Detected — repeated scans in a short window' : 'None detected'}
          />
        </dl>
      ) : (
        <div className="rounded-md border border-line bg-white p-4 text-sm text-ink-700">
          <p>Fingerprint/serial not found.</p>
          <p className="mt-1">This product is not registered in the LabelCheck digital identity registry.</p>
          <p className="mt-1 font-medium">Recommendation: avoid using this product and consider reporting it.</p>
          <p className="mt-3 break-all font-mono text-xs text-steel">You entered: {scanRecord.identifier}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onReset}
          className="rounded-md bg-ink-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-600"
        >
          Verify another product
        </button>
        {product && (
          <Link
            to={isAuthenticated ? '/inspection/new' : '/login'}
            className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-300"
          >
            Optional: run a label compliance check
          </Link>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-steel">{label}</dt>
      <dd className={cn('mt-0.5 break-all text-ink-700', mono && 'font-mono text-sm')}>{value}</dd>
    </div>
  )
}
