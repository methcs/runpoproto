import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Race {
  id: number
  title: string
  date: string
  location: string
  distance: string
  category: string
  description: string
  websiteUrl?: string
  registrationUrl?: string
}

export default function AdminRacePanel() {
  const [races, setRaces] = useState<Race[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    distance: '',
    category: '',
    description: '',
    websiteUrl: '',
    registrationUrl: '',
  })

  // Fetch races
  useEffect(() => {
    fetchRaces()
  }, [])

  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races')
      const data = await response.json()
      setRaces(data)
    } catch (error) {
      console.error('Error fetching races:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddRace = async () => {
    if (!formData.title || !formData.date || !formData.location || !formData.distance || !formData.category) {
      alert('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/races', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('✓ Yarış başarıyla eklendi!')
        setFormData({
          title: '',
          date: '',
          location: '',
          distance: '',
          category: '',
          description: '',
          websiteUrl: '',
          registrationUrl: '',
        })
        setOpenDialog(false)
        fetchRaces()
      } else {
        alert('Hata: Yarış eklenirken sorun oluştu')
      }
    } catch (error) {
      console.error('Error adding race:', error)
      alert('Hata: Yarış eklenirken sorun oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRace = async (id: number) => {
    if (!confirm('Bu yarışı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch('/api/races', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        alert('✓ Yarış başarıyla silindi!')
        fetchRaces()
      } else {
        alert('Hata: Yarış silinirken sorun oluştu')
      }
    } catch (error) {
      console.error('Error deleting race:', error)
      alert('Hata: Yarış silinirken sorun oluştu')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Yarış Yönetimi</h2>
        <Button onClick={() => setOpenDialog(true)} className="bg-green-600 hover:bg-green-700">
          + Yeni Yarış Ekle
        </Button>
      </div>

      {/* Add Race Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Yarış Ekle</DialogTitle>
            <DialogDescription>Yarış bilgilerini aşağıya girin</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Yarış Adı *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Örn: Istanbul Marathon 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tarih *</label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konum *</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Örn: Istanbul, Türkiye"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mesafe *</label>
                <Input
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  placeholder="Örn: 42.195 km"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori *</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Örn: Marathon, Half Marathon, Trail"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <Input
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kayıt URL</label>
              <Input
                name="registrationUrl"
                value={formData.registrationUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/register"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Yarış hakkında bilgi..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                İptal
              </Button>
              <Button onClick={handleAddRace} disabled={loading}>
                {loading ? 'Ekleniyor...' : 'Yarış Ekle'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Races List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Mevcut Yarışlar ({races.length})</h3>

        {races.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            Henüz hiç yarış eklenmemiş. "Yeni Yarış Ekle" butonunu kullanarak başlayın.
          </Card>
        ) : (
          <div className="space-y-3">
            {races.map((race) => (
              <Card key={race.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{race.title}</h4>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>📅 {new Date(race.date).toLocaleDateString('tr-TR')}</p>
                      <p>📍 {race.location}</p>
                      <p>📏 {race.distance}</p>
                      <p>🏷️ {race.category}</p>
                      {race.description && <p>📝 {race.description}</p>}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRace(race.id)}
                  >
                    Sil
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
