"use client"

import React, { useState } from 'react'
/* Modal import removed: using inline dialog markup here */
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuth } from './auth-provider'

export default function EditProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user, refresh } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState((user as any)?.email || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    setName(user?.name || '')
    setEmail((user as any)?.email || '')
  }, [user])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        throw new Error(b?.error || 'Failed to update profile')
      }
      await refresh()
      onOpenChange(false)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Use your existing Dialog UI instead of Modal if you prefer — keep it simple */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 border border-gray-700 rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Profili Düzenle</h3>
            <label className="block text-sm">İsim</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-3" />
            <label className="block text-sm">E-posta</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" />
            {error && <div className="text-sm text-destructive mb-3">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button onClick={save} disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
