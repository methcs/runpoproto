"use client"

import React, { useEffect, useState } from 'react'
import AttendedRaces from './ui/attended-races'
import ProfileIsMe from './profile-is-me'
import ProfileOwnerActions from './profile-owner-actions'
import { useAuth } from './auth-provider'

type AttendedRace = {
  registrationId: number
  registrationDate?: string
  preferredDistance?: string | null
  race: {
    title: string
    date: string
    location: string
    distance?: string | null
    websiteUrl?: string | null
  }
}

export default function ProfilePageClient({ username }: { username: string }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [joined, setJoined] = useState<string | null>(null)
  const [attended, setAttended] = useState<AttendedRace[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(username)}`)
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json?.error || 'Failed to fetch user')
        }
        const json = await res.json()
        if (!mounted) return
        const u = json.user
        setName(u.name || null)
        setJoined(u.createdAt || null)
        setAttended(u.attended || [])
      } catch (err: any) {
        setError(String(err.message || err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [username])

  const handleAttendedChange = (newAttended: AttendedRace[]) => {
    setAttended(newAttended)
  }

  if (loading) return <div className="p-6">Yükleniyor...</div>
  if (error) return <div className="p-6 text-red-400">Hata: {error}</div>

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero-style header like homepage */}
      <section className="relative min-h-[28vh] flex items-center overflow-hidden bg-black/10">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6 py-8">
            <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-black text-white border-2 border-yellow-400">{username?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 mb-2">
                <span className="text-yellow-400 font-bold text-xs tracking-widest">PROFİL</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-1 leading-tight">
                <span className="text-white">{username}</span>
                {name && <span className="text-yellow-400 ml-2 text-2xl font-semibold">{name}</span>}
              </h1>
              {joined && <p className="text-sm text-gray-300">Üye: {new Date(joined).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="relative z-10 px-4 max-w-5xl mx-auto w-full -mt-8 pb-12">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <ProfileIsMe username={username} />

              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-3">Katıldığım Yarışlar</h2>
                <AttendedRaces attended={attended} showCancel={!!(user && user.username === username)} onCancel={(id) => setAttended((prev) => prev.filter((r) => r.registrationId !== id))} />
              </div>
            </div>

            <aside className="w-full md:w-64">
              <div className="bg-black/30 border border-white/6 rounded-lg p-4">
                <h3 className="text-sm text-gray-300 mb-2">Hesap Bilgileri</h3>
                <p className="text-sm">Kullanıcı: <strong className="text-white">{username}</strong></p>
                {name && <p className="text-sm">İsim: {name}</p>}
                {joined && <p className="text-sm">Üye: {new Date(joined).toLocaleDateString()}</p>}

                <div className="mt-4">
                  <ProfileOwnerActions initialAttended={attended} username={username} onAttendedChange={(next) => handleAttendedChange(next)} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
