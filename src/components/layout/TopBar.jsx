import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function TopBar({ title, description, onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-ink-700 md:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-ink-700 md:text-lg">{title}</h1>
          {description && <p className="hidden truncate text-sm text-steel md:block">{description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-ink-700">{user?.name ?? 'Inspector'}</p>
          <p className="text-xs text-steel">{user?.email}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-white">
          {(user?.name ?? 'IN').slice(0, 2).toUpperCase()}
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-2 text-xs font-medium text-steel transition-colors hover:border-ink-300 hover:text-ink-700 md:px-3"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
