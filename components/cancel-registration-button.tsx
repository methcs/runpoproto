"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'

export default function CancelRegistrationButton({ registrationId, onSuccess }: { registrationId: number; onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancel = async () => {
    if (!confirm('Kayıt iptal edilsin mi?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/registrations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })
      const b = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(b?.error || 'Cancel failed')
      if (onSuccess) onSuccess()
      alert('Kayıt iptal edildi.')
    } catch (e: any) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button variant="destructive" size="sm" onClick={cancel} disabled={loading}>{loading ? 'İşleniyor...' : 'Kayıt İptal'}</Button>
      {error && <div className="text-sm text-destructive mt-2">{error}</div>}
    </div>
  )
}
