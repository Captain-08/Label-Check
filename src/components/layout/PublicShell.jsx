import { NavLink, Outlet } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { to: '/verify', label: 'Verify Product' },
  { to: '/manufacturers', label: 'For Manufacturers' },
  { to: '/scan-history', label: 'Scan History' },
]

/**
 * Layout for pages that don't require inspector login (Verify Product, For
 * Manufacturers, Scan History). Mirrors the color palette and type used by
 * the authenticated app shell (ink-700 header, brass accent) so these pages
 * feel like part of the same product rather than a bolted-on section.
 */
export default function PublicShell() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <header className="border-b border-line bg-ink-700">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <NavLink to="/verify" className="flex items-center gap-2.5 text-white">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-brass/90 text-ink-700">
              <ShieldCheck size={17} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold">LabelCheck</span>
          </NavLink>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-ink-200 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="ml-1 rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              {isAuthenticated ? 'Inspector Dashboard' : 'Inspector Sign in'}
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-line px-4 py-4 text-center text-xs text-steel md:px-8">
        Digital identity verification is one authentication layer and does not by itself physically inspect a product.
      </footer>
    </div>
  )
}
