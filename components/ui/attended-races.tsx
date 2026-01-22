"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

type AttendedRace = {
  registrationId: number
  preferredDistance?: string | null
  race: {
    title: string
    date: string
    location: string
    distance?: string | null
    websiteUrl?: string | null
  }
}

export default function AttendedRaces({
  attended,
  showCancel = false,
  onCancel,
}: {
  attended: AttendedRace[]
  showCancel?: boolean
  onCancel?: (registrationId: number) => void
}) {
  if (!attended || attended.length === 0) {
    return <p className="text-muted">Henüz katıldığınız bir yarış yok.</p>
  }

  return (
    <ul className="space-y-4">
      {attended.map((a) => (
        <li key={a.registrationId} className="border rounded p-4 flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{a.race.title}</h3>
            <p className="text-sm text-muted">{a.race.date} — {a.race.location}</p>
            <p className="text-sm">Yarış mesafesi: {a.race.distance || '-'}</p>
            <p className="text-sm">Tercih edilen mesafe: {a.preferredDistance || '-'}</p>
            {a.race.websiteUrl && (
              <p className="mt-2">
                <a href={a.race.websiteUrl} target="_blank" rel="noreferrer" className="text-yellow-400 underline">
                  Yarış sayfasına git
                </a>
              </p>
            )}
          </div>

          {showCancel && onCancel && (
            <div className="flex items-start">
              <Button size="sm" variant="destructive" onClick={() => onCancel(a.registrationId)}>
                Kayıdı İptal Et
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
