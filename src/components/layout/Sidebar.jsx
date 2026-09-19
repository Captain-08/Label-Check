import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ScanLine, History, FileText, Settings, ShieldCheck, X, QrCode, Factory } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const NAV_GROUPS = [
  {
    label: 'Label Compliance',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/inspection/new', label: 'New Inspection', icon: ScanLine },
      { to: '/history', label: 'Inspection History', icon: History },
      { to: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'Product Authentication',
    items: [
      { to: '/verify', label: 'Verify Product', icon: QrCode },
      { to: '/manufacturers', label: 'For Manufacturers', icon: Factory },
    ],
  },
  {
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
]

/**
 * Sidebar content, shared by the permanent desktop sidebar and the mobile
 * drawer. `onNavigate` (closes the drawer after a link tap) and `onClose`
 * (renders a close button) are only passed by the mobile drawer in
 * AppShell — the permanent desktop sidebar renders with no props and is
 * visually unchanged.
 */
export default function Sidebar({ onNavigate, onClose }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-ink-700 text-ink-100">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-brass/90 text-ink-700">
          <ShieldCheck size={17} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-white">LabelCheck</p>
          <p className="truncate text-[11px] leading-tight text-ink-200">Legal Metrology Assist</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-200 hover:bg-white/10 hover:text-white"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.label ?? i} className="space-y-1">
            {group.label && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-300">{group.label}</p>
            )}
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-ink-200 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] leading-snug text-ink-300">
          Preliminary automated assessments only. Not a substitute for verification by an authorized Legal Metrology officer.
        </p>
      </div>
    </aside>
  )
}

