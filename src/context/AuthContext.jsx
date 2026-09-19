import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email) => setUser({ name: deriveName(email), email: email || 'demo@labelcheck.gov.in' }),
      logout: () => setUser(null),
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function deriveName(email) {
  if (!email) return 'Demo Inspector'
  const local = email.split('@')[0] || 'Inspector'
  return local
    .replace(/[._]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}
