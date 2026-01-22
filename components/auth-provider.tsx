"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = { id: number; username: string; name?: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  loginComplete: (user: User) => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = typeof window !== 'undefined' ? localStorage.getItem('rp_user') : null
      return s ? JSON.parse(s) : null
    } catch (e) {
      return null
    }
  })
  const [loading, setLoading] = useState<boolean>(!user)

  useEffect(() => {
    // Always attempt to refresh from server on mount to validate cookie
    if (!user) {
      refresh().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        setUser(null)
        localStorage.removeItem('rp_user')
        return
      }
      const body = await res.json()
      setUser(body.user)
      localStorage.setItem('rp_user', JSON.stringify(body.user))
    } catch (e) {
      setUser(null)
      localStorage.removeItem('rp_user')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    setUser(null)
    localStorage.removeItem('rp_user')
  }

  function loginComplete(u: User) {
    setUser(u)
    try {
      localStorage.setItem('rp_user', JSON.stringify(u))
    } catch (e) {}
  }

  const value = useMemo(() => ({ user, loading, loginComplete, logout, refresh }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
