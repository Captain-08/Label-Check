import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, LayoutDashboard, RefreshCcw } from 'lucide-react'
import { registerProduct } from '../../lib/productRegistryService.js'
import { encodeQrPayload } from '../../lib/idGenerators.js'
import QRCodeDisplay from '../../components/registry/QRCodeDisplay.jsx'

const CATEGORIES = ['Packaged Food', 'Edible Oil', 'Cosmetics', 'Nutraceutical', 'Household', 'Electronics', 'Other']

const EMPTY_FORM = { companyName: '', companyEmail: '', productName: '', category: CATEGORIES[0], serialPrefix: '' }

export default function ManufacturerPortal() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [registered, setRegistered] = useState(null)

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const record = registerProduct(form)
    setRegistered(record)
  }

  function handleRegisterAnother() {
    setRegistered(null)
    setForm((f) => ({ ...EMPTY_FORM, companyName: f.companyName, companyEmail: f.companyEmail }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-xl font-semibold text-ink-700">For Manufacturers</h1>
        <p className="mt-1 text-sm text-steel">
          Register a genuine product to generate its Digital Product Fingerprint, serial number and QR code.
          Consumers and inspectors can then verify this identity on the Verify Product page.
        </p>
      </div>

      {!registered ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-line bg-panel p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Company Name" value={form.companyName} onChange={handleChange('companyName')} required />
            <TextField
              label="Company Email"
              type="email"
              value={form.companyEmail}
              onChange={handleChange('companyEmail')}
              required
            />
            <TextField label="Product Name" value={form.productName} onChange={handleChange('productName')} required />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-steel">Product Category</label>
              <select
                value={form.category}
                onChange={handleChange('category')}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-ink-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="Serial Prefix"
              value={form.serialPrefix}
              onChange={handleChange('serialPrefix')}
              placeholder="e.g. XYZ-CR"
              hint="Used as the start of every serial number for this product."
            />
          </div>

          <button type="submit" className="w-full rounded-md bg-ink-700 py-3 text-sm font-medium text-white hover:bg-ink-600">
            Register Genuine Product
          </button>

          <p className="text-xs text-steel">
            The fingerprint and serial are generated with the browser's cryptographically secure random number
            generator — they are not sequential or guessable. This prototype stores registrations in your browser
            only; a production version would use a real backend/database.
          </p>
        </form>
      ) : (
        <RegistrationResult record={registered} onRegisterAnother={handleRegisterAnother} />
      )}
    </div>
  )
}

function RegistrationResult({ record, onRegisterAnother }) {
  const qrValue = encodeQrPayload(record)

  return (
    <div className="space-y-5 rounded-md border border-verified-border bg-verified-bg p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-verified">
        <CheckCircle2 size={16} />
        Genuine Product Registered
      </p>

      <div className="grid grid-cols-1 gap-6 rounded-md border border-line bg-white p-5 sm:grid-cols-2">
        <dl className="space-y-3 text-sm">
          <Field label="Product" value={record.productName} />
          <Field label="Manufacturer" value={record.companyName} />
          <Field label="Category" value={record.category} />
          <Field label="Product Fingerprint" value={record.fingerprint} mono />
          <Field label="Serial" value={record.serial} mono />
          <Field label="Status" value={`${record.status} / GENUINE`} />
        </dl>
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-steel">Digital Product Identity</p>
          <QRCodeDisplay value={qrValue} />
          <p className="max-w-[220px] text-center text-xs text-steel">
            This QR represents the registered product identity. Print it on the packaging so it can be verified later.
          </p>
        </div>
      </div>

      <p className="text-xs text-steel">
        This registration confirms the product's digital identity was recorded — it is one authentication layer, not
        a physical inspection or a legal certification.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRegisterAnother}
          className="inline-flex items-center gap-2 rounded-md bg-ink-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-600"
        >
          <RefreshCcw size={15} />
          Register another product
        </button>
        <Link
          to="/manufacturers/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-700 hover:border-ink-300"
        >
          <LayoutDashboard size={15} />
          View manufacturer dashboard
        </Link>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, type = 'text', required, placeholder, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-steel">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-ink-400"
      />
      {hint && <p className="mt-1 text-xs text-steel">{hint}</p>}
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-steel">{label}</dt>
      <dd className={mono ? 'mt-0.5 break-all font-mono text-sm text-ink-700' : 'mt-0.5 text-ink-700'}>{value}</dd>
    </div>
  )
}
