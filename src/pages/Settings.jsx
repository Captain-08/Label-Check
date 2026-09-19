import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyReview, setNotifyReview] = useState(true)
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-fadeUp">
      <form onSubmit={handleSave} className="space-y-6 rounded-md border border-line bg-panel p-4 sm:p-6">
        <div>
          <p className="text-sm font-semibold text-ink-700">Profile</p>
          <p className="text-xs text-steel">Shown on inspection records you create.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-steel">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink-700 outline-none focus:border-ink-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-steel">Email</label>
              <input
                value={user?.email ?? ''}
                disabled
                className="w-full cursor-not-allowed rounded-md border border-line bg-ink-50/60 px-3 py-2.5 text-sm text-steel"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-sm font-semibold text-ink-700">Notifications</p>
          <div className="mt-3 space-y-3">
            <ToggleRow
              label="Email me a copy of every report"
              checked={notifyEmail}
              onChange={setNotifyEmail}
            />
            <ToggleRow
              label="Notify me when an inspection needs review"
              checked={notifyReview}
              onChange={setNotifyReview}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <button type="submit" className="rounded-md bg-ink-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-ink-600">
            Save changes
          </button>
          {saved && <span className="text-xs font-medium text-verified">Saved.</span>}
        </div>
      </form>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm text-ink-700">
      {label}
      <span
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-ink-700' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
    </label>
  )
}
