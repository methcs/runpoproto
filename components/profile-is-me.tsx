"use client"

import React from 'react'
import { useAuth } from './auth-provider'

export default function ProfileIsMe({ username }: { username: string }) {
  const { user } = useAuth()
  if (!user) return null
  if (user.username !== username) return null

  return (
    <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded">
      <p className="text-sm text-gray-300">Bu profil size ait. Aşağıda katıldığınız yarışları görebilirsiniz.</p>
    </div>
  )
}
