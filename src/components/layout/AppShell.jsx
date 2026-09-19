import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const PAGE_META = [
  { match: /^\/dashboard/, title: 'Dashboard', description: 'Overview of recent compliance inspections' },
  { match: /^\/inspection\/new/, title: 'New Inspection', description: 'Upload a package image to run a preliminary check' },
  { match: /^\/inspection\/analysis/, title: 'Analysis Result', description: 'Simulated compliance assessment for this upload' },
  { match: /^\/history/, title: 'Inspection History', description: 'Search and filter past inspections' },
  { match: /^\/reports/, title: 'Reports', description: 'Generate and export compliance reports' },
  { match: /^\/report\//, title: 'Compliance Report', description: 'Preliminary automated assessment' },
  { match: /^\/settings/, title: 'Settings', description: 'Account and workspace preferences' },
]

export default function AppShell() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const meta = PAGE_META.find((m) => m.match.test(location.pathname)) ?? { title: 'LabelCheck' }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper">
      {/* Permanent sidebar at md (768px) and above — unchanged from before. */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer: hidden entirely at md and above, shown as an
          overlay + slide-in panel below 768px when toggled from the
          hamburger button in TopBar. */}
      {isNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-ink-900/50"
            onClick={() => setIsNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full w-64 max-w-[85vw] shadow-xl">
            <Sidebar onNavigate={() => setIsNavOpen(false)} onClose={() => setIsNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={meta.title} description={meta.description} onMenuClick={() => setIsNavOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-8 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
