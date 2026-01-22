"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import EditProfileModal from './edit-profile-modal'
import CancelRegistrationButton from './cancel-registration-button'
import { useAuth } from './auth-provider'

const DynamicCancel = CancelRegistrationButton

export default function ProfileOwnerActions({ initialAttended, username, onAttendedChange }: { initialAttended: any[]; username: string; onAttendedChange?: (a: any[]) => void }) {
  const { user } = useAuth()
  const [attended, setAttended] = useState(initialAttended || [])
  const [editing, setEditing] = useState(false)

  // Notify parent when attended changes
  useEffect(() => {
    if (onAttendedChange) onAttendedChange(attended)
  }, [attended, onAttendedChange])

  // Sync prop changes into local state when initialAttended updates
  useEffect(() => {
    setAttended(initialAttended || [])
  }, [initialAttended])

  // Only show owner controls if current user matches profile username
  const isOwner = !!user && user.username === username

  const handleCancelSuccess = (registrationId: number) => {
    setAttended((prev) => prev.filter((r) => r.registrationId !== registrationId))
  }

  if (!isOwner) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Bu profil size ait. Profili düzenleyebilir veya kayıtlarınızı yönetebilirsiniz.</p>
        <div className="flex items-center gap-2">
          <button className="text-sm text-yellow-400" onClick={() => setEditing(true)}>Profili Düzenle</button>
        </div>
      </div>

      <EditProfileModal open={editing} onOpenChange={setEditing} />

      {/* Render cancel buttons for each registration owner */}
      <div className="mt-4 space-y-3">
        {attended.map((r) => (
          <div key={r.registrationId} className="flex items-center justify-end">
            <DynamicCancel registrationId={r.registrationId} onSuccess={() => handleCancelSuccess(r.registrationId)} />
          </div>
        ))}
      </div>
    </div>
  )
}
