import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, ScanLine, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import ScanFrame from '../components/ui/ScanFrame.jsx'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? '/dashboard'} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    login(email)
    navigate('/dashboard', { replace: true })
  }

  function handleDemoLogin() {
    login('demo.inspector@labelcheck.gov.in')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-700 px-12 py-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-brass text-ink-700">
            <ShieldCheck size={19} strokeWidth={2.2} />
          </span>
          <span className="text-lg font-semibold">LabelCheck</span>
        </div>

        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">Preliminary Compliance Assistant</p>
          <h1 className="mt-3 text-3xl font-semibold leading-snug">
            AI-assisted screening for packaged commodity labels.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-100">
            Upload a photograph of a package to flag missing or unclear Legal Metrology
            declarations before a manual review — built for Smart India Hackathon 2026,
            problem statement SIH26034.
          </p>

          <ScanFrame color="#8A6D3B" className="mt-8 block w-full max-w-xs rounded-sm border border-white/10 bg-ink-800/60 p-5">
            <div className="flex items-center gap-2 text-xs text-ink-200">
              <ScanLine size={14} className="text-brass" />
              Sample check in progress
            </div>
            <div className="mt-3 space-y-2 font-mono text-[11px] text-ink-200">
              <div className="flex justify-between"><span>Product name</span><span className="text-verified">Detected</span></div>
              <div className="flex justify-between"><span>Net quantity</span><span className="text-verified">Detected</span></div>
              <div className="flex justify-between"><span>Consumer care</span><span className="text-caution">Review</span></div>
            </div>
          </ScanFrame>
        </div>

        <p className="text-xs text-ink-300">
          Preliminary automated assessment only — not a legal certification of compliance.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 items-center justify-center bg-paper px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink-700 text-brass">
              <ShieldCheck size={17} />
            </span>
            <span className="text-base font-semibold text-ink-700">LabelCheck</span>
          </div>

          <h2 className="text-xl font-semibold text-ink-700">Sign in to your workspace</h2>
          <p className="mt-1 text-sm text-steel">AI-assisted packaged commodity compliance checker</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-steel">
                Official email
              </label>
              <div className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 focus-within:border-ink-400">
                <Mail size={15} className="text-steel" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="inspector@nic.in"
                  className="w-full bg-transparent text-sm text-ink-700 outline-none placeholder:text-steel/60"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-steel">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5 focus-within:border-ink-400">
                <Lock size={15} className="text-steel" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-ink-700 outline-none placeholder:text-steel/60"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-ink-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-600"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-steel">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full rounded-md border border-line bg-panel py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-300"
          >
            Continue with demo account
          </button>

          <p className="mt-8 text-center text-xs text-steel">
            Prototype for SIH26034 — not connected to a production identity system.
          </p>
        </div>
      </div>
    </div>
  )
}
