"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuth } from './auth-provider'

export default function AuthButton() {
  const { user, loading, loginComplete, logout, refresh } = useAuth()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)

  // form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Ensure we have fresh user on mount
    refresh().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignup = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, name }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error || 'Signup failed')

      // server sets cookie; refresh to get user
      await refresh()
      setOpen(false)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogin = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username || email, password }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error || 'Login failed')

      // server sets cookie; refresh to get user
      await refresh()
      setOpen(false)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setSubmitting(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <a href={`/profile/${user.username}`} className="text-sm hover:underline">{user.name || user.username}</a>
        <Button variant="outline" size="sm" onClick={logout}>Çıkış</Button>
      </div>
    )
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">Sign up</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</DialogTitle>
            <DialogDescription>
              {tab === 'login'
                ? 'Lütfen kullanıcı adı/e-posta ve şifrenizi girin.'
                : 'Yeni bir hesap oluşturun.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {tab === 'signup' && (
              <>
                <label className="block text-sm">Kullanıcı Adı</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />

                <label className="block text-sm">E-posta (opsiyonel)</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="block text-sm">İsim (opsiyonel)</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}

            {tab === 'login' && (
              <>
                <label className="block text-sm">Kullanıcı Adı veya E-posta</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </>
            )}

            <label className="block text-sm">Şifre</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <div className="text-sm text-destructive">{error}</div>}

            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2 items-center">
                  <button
                    className={`text-sm ${tab === 'login' ? 'font-semibold' : 'text-muted-foreground'}`}
                    onClick={() => setTab('login')}
                  >
                    Giriş
                  </button>
                  <button
                    className={`text-sm ${tab === 'signup' ? 'font-semibold' : 'text-muted-foreground'}`}
                    onClick={() => setTab('signup')}
                  >
                    Kayıt
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={tab === 'login' ? handleLogin : handleSignup} disabled={submitting}>
                    {submitting ? 'Bekleyin...' : tab === 'login' ? 'Giriş' : 'Kayıt Ol'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
