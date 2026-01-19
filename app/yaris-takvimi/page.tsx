"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import AdminRacePanel from "@/components/admin-race-panel"
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Plus,
  Edit3,
  Save,
  X,
  Search,
  Users,
  UserPlus,
  Eye,
  Download,
} from "lucide-react"

interface Participant {
  id: number
  name: string
  surname: string
  email: string
  preferredDistance?: string
  registrationDate: string
}

interface Race {
  id: number
  externalId: number
  title: string
  date: string
  location: string
  distance: string
  category: string
  registrationUrl?: string
  websiteUrl?: string
  description: string
  participants?: Participant[]
}

export default function YarisTakvimiPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminLoginError, setAdminLoginError] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRace, setEditingRace] = useState<Race | null>(null)
  const [showAddRace, setShowAddRace] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "past" | "upcoming">("all")
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    surname: "",
    email: "",
    preferredDistance: "",
  })
  const [races, setRaces] = useState<Race[]>([])

  // Load races from database on mount
  useEffect(() => {
    const loadRaces = async () => {
      try {
        const response = await fetch('/api/races')
        if (response.ok) {
          const data = await response.json()
          setRaces(data)
        }
      } catch (error) {
        console.error('Error loading races:', error)
        // If database fails, races will remain empty
      }
    }
    loadRaces()
  }, [])

  // Filter races based on search term
  const filteredRaces = races.filter((race) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      race.title.toLowerCase().includes(searchLower) ||
      race.location.toLowerCase().includes(searchLower) ||
      race.category.toLowerCase().includes(searchLower)
    )
  })

  const filteredAndSortedRaces = filteredRaces
    .filter((race) => {
      const raceDate = new Date(race.date)
      const today = new Date()

      if (filter === "past") {
        return raceDate < today
      } else if (filter === "upcoming") {
        return raceDate >= today
      } else {
        return true
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Maraton":
        return "bg-purple-500"
      case "Yarı Maraton":
        return "bg-blue-500"
      case "Ultra Trail":
        return "bg-red-500"
      case "10K":
        return "bg-green-500"
      case "15K":
        return "bg-teal-500"
      case "30K":
        return "bg-orange-500"
      case "Trail":
        return "bg-indigo-500"
      case "Yüzme":
        return "bg-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Default admin password - change this to your own
    const ADMIN_PASSWORD = "runpo2025"
    
    if (adminPassword.trim() === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowAdminLogin(false)
      setAdminPassword("")
      setAdminLoginError("")
      alert("🔐 Yönetici girişi başarılı!")
    } else {
      setAdminLoginError("❌ Şifre yanlış. Lütfen tekrar deneyiniz.")
      setAdminPassword("")
    }
  }

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false)
      alert("👋 Yönetici oturumu kapatıldı.")
    } else {
      setShowAdminLogin(true)
    }
  }

  const handleSaveRace = (raceData: Partial<Race>) => {
    if (editingRace) {
      setRaces(races.map((race) => (race.id === editingRace.id ? { ...race, ...raceData } : race)))
      setEditingRace(null)
    } else {
      const newRace: Race = {
        id: Date.now(),
        externalId: Math.floor(Math.random() * 1000000),
        title: raceData.title || "",
        date: raceData.date || "",
        location: raceData.location || "",
        distance: raceData.distance || "",
        category: raceData.category || "",
        registrationUrl: raceData.registrationUrl || "",
        websiteUrl: raceData.websiteUrl || "",
        description: raceData.description || "",
        participants: [],
      }
      setRaces([...races, newRace])
      setShowAddRace(false)
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRace) return

    try {
      // Send registration to API
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raceId: selectedRace.externalId,
          name: registrationForm.name,
          surname: registrationForm.surname,
          email: registrationForm.email,
          preferredDistance: registrationForm.preferredDistance,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Registration failed")
      }

      const data = await response.json()

      // Update local state to show the participant
      const newParticipant: Participant = {
        id: data.registration.id,
        name: registrationForm.name,
        surname: registrationForm.surname,
        email: registrationForm.email,
        registrationDate: data.registration.registrationDate,
      }

      setRaces(
        races.map((race) =>
          race.id === selectedRace.id
            ? { ...race, participants: [...(race.participants || []), newParticipant] }
            : race,
        ),
      )

      // Reset form
      setRegistrationForm({
        name: "",
        surname: "",
        email: "",
        preferredDistance: "",
      })
      setShowRegistrationModal(false)
      setSelectedRace(null)

      // Show success message
      alert(`🎉 Başarıyla kayıt oldunuz! ${selectedRace.title} yarışında görüşmek üzere!`)
    } catch (error) {
      console.error("Registration error:", error)
      alert(`❌ Kayıt işlemi başarısız: ${error instanceof Error ? error.message : "Lütfen tekrar deneyiniz"}`)
    }
  }

  const openRegistrationModal = (race: Race) => {
    setSelectedRace(race)
    setShowRegistrationModal(true)
  }

  const openParticipantsModal = async (race: Race) => {
    setSelectedRace(race)
    setShowParticipantsModal(true)
    
    // Fetch participants from database
    try {
      const response = await fetch(`/api/registrations?raceId=${race.externalId}`)
      if (response.ok) {
        const raceData = await response.json()
        // Update race with fetched participants from database
        setRaces(
          races.map((r) =>
            r.id === race.id ? { ...r, participants: raceData.registrations } : r,
          ),
        )
      }
    } catch (error) {
      console.error("Error fetching participants:", error)
    }
  }

  const exportToExcel = async (race: Race) => {
    try {
      if (!race.participants || race.participants.length === 0) {
        alert("Bu yarışta henüz katılımcı yok.")
        return
      }

      // Use the API endpoint to download CSV
      const response = await fetch(`/api/registrations/export?raceId=${race.externalId}&format=csv`)
      
      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get the CSV content and create download
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      
      const fileName = `${race.title.replace(/\s+/g, "_")}_Katilimcilar_${new Date().toISOString().split("T")[0]}.csv`
      
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export error:", error)
      alert("Excel indirme işlemi başarısız oldu. Lütfen tekrar deneyiniz.")
    }
  }

  const getTotalParticipants = () => {
    return races.reduce((total, race) => total + (race.participants?.length || 0), 0)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header isAdmin={isAdmin} onAdminToggle={handleAdminToggle} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              YARIŞ
              <span className="text-yellow-400"> TAKVİMİ</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              2026 yılının en heyecan verici koşu etkinlikleri
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{races.length}</div>
                <div className="text-sm text-gray-300">Toplam Yarış</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
                <div className="text-3xl font-bold text-green-400 mb-1">{getTotalParticipants()}</div>
                <div className="text-sm text-gray-300">Toplam Katılımcı</div>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {races.filter((r) => new Date(r.date) >= new Date()).length}
                </div>
                <div className="text-sm text-gray-300">Yaklaşan Yarış</div>
              </div>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Yarış adı, lokasyon veya kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-400 rounded-2xl text-lg focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/25"
                />
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="text-center">
                <p className="text-yellow-400 font-semibold text-sm">✓ Yönetici Paneli Aktif</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">🔐 Yönetici Girişi</h3>
                <Button
                  onClick={() => {
                    setShowAdminLogin(false)
                    setAdminPassword("")
                    setAdminLoginError("")
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Yönetici Şifresi</label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value)
                      setAdminLoginError("")
                    }}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Şifrenizi girin"
                    autoFocus
                  />
                </div>

                {adminLoginError && <p className="text-red-400 text-sm">{adminLoginError}</p>}

                <div className="bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                  <p className="text-yellow-400 text-xs">💡 Yönetici şifresi ile katılımcı listesine erişebilirsiniz.</p>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold">
                  Giriş Yap
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Admin Race Management Panel */}
      {isAdmin && (
        <section className="bg-gray-950 text-white py-20 px-4 border-y border-yellow-400/30">
          <div className="container mx-auto max-w-6xl">
            <AdminRacePanel />
          </div>
        </section>
      )}

      {/* Race Calendar */}
      <section className="bg-black text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6">
            {filteredAndSortedRaces.map((race) => (
              <Card
                key={race.id}
                className={`${
                  new Date(race.date) < new Date()
                    ? "bg-gray-900/10 backdrop-blur-sm border-gray-700/20 opacity-75"
                    : "bg-gray-900/20 backdrop-blur-sm border-gray-700/30"
                } hover:border-yellow-400/50 transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6 items-center">
                    <div>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge className={`${getCategoryColor(race.category)} text-white border-0`}>
                          {race.category}
                        </Badge>
                        {race.participants && race.participants.length > 0 && (
                          <Badge className="bg-green-500 text-white border-0">
                            <Users className="w-3 h-3 mr-1" />
                            {race.participants.length} Katılımcı
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{race.title}</h3>
                      <p className="text-gray-300 text-sm">{race.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(race.date).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{race.location}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Trophy className="w-4 h-4 mr-2" />
                        <span>{race.distance}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {(() => {
                            const today = new Date()
                            const raceDate = new Date(race.date)
                            const diffTime = raceDate.getTime() - today.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                            if (diffDays < 0) {
                              return (
                                <span className="text-red-400 font-semibold">{Math.abs(diffDays)} gün önce geçti</span>
                              )
                            } else if (diffDays === 0) {
                              return <span className="text-yellow-400 font-semibold animate-pulse">BUGÜN!</span>
                            } else {
                              return `${diffDays} gün kaldı`
                            }
                          })()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Katılacağım Butonu - Sadece gelecek yarışlar için */}
                      {new Date(race.date) >= new Date() && (
                        <Button
                          onClick={() => openRegistrationModal(race)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Katılacağım
                        </Button>
                      )}

                      {/* Katılımcıları Gör - Sadece Admin */}
                      {isAdmin && (
                        <Button
                          onClick={() => openParticipantsModal(race)}
                          variant="outline"
                          className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Katılımcıları Gör ({race.participants?.length || 0})
                        </Button>
                      )}

                      <div className="flex gap-2">
                        {race.websiteUrl && (
                          <a href={race.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                            >
                              Web Sitesi
                            </Button>
                          </a>
                        )}
                        {isEditMode && (
                          <Button
                            onClick={() => setEditingRace(race)}
                            variant="outline"
                            size="icon"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredAndSortedRaces.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="bg-gray-900/20 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/30 max-w-2xl mx-auto">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Yarış Bulunamadı</h3>
            <p className="text-gray-400 mb-6">
              "<span className="text-yellow-400">{searchTerm}</span>" için herhangi bir yarış bulunamadı.
            </p>
            <Button onClick={() => setSearchTerm("")} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Tüm Yarışları Göster
            </Button>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedRace && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{selectedRace.title} - Katılım Formu</h3>
                <Button
                  onClick={() => {
                    setShowRegistrationModal(false)
                    setSelectedRace(null)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={registrationForm.name}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Adınız"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Soyad <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={registrationForm.surname}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, surname: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Soyadınız"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-Mail <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tercih Edilen Mesafe
                  </label>
                  <Input
                    value={registrationForm.preferredDistance}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, preferredDistance: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Örn: 5K, 10K, 21K, 42K"
                  />
                </div>

                <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/20">
                  <p className="text-yellow-400 text-sm">💡 Kayıt olduktan sonra koçunuz size ulaşacaktır.</p>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Katıl
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && selectedRace && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRace.title}</h3>
                  <p className="text-gray-400 text-sm">Toplam {selectedRace.participants?.length || 0} katılımcı</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportToExcel(selectedRace)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={!selectedRace.participants || selectedRace.participants.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel İndir
                  </Button>
                  <Button
                    onClick={() => {
                      setShowParticipantsModal(false)
                      setSelectedRace(null)
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedRace.participants && selectedRace.participants.length > 0 ? (
                <div className="space-y-4">
                  {selectedRace.participants.map((participant, index) => (
                    <Card key={participant.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                                {index + 1}
                              </div>
                              <h4 className="text-white font-semibold">{participant.name} {participant.surname}</h4>
                            </div>
                            <div className="space-y-1 text-sm text-gray-400">
                              <p>📧 {participant.email}</p>
                              {participant.preferredDistance && (
                                <p>🏃 Mesafe: <span className="text-green-400 font-medium">{participant.preferredDistance}</span></p>
                              )}
                              <p className="text-xs text-gray-500">
                                Kayıt: {new Date(participant.registrationDate).toLocaleDateString("tr-TR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Henüz katılımcı yok</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Race Edit Modal */}
      {(editingRace || showAddRace) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{editingRace ? "Yarışı Düzenle" : "Yeni Yarış Ekle"}</h3>
                <Button
                  onClick={() => {
                    setEditingRace(null)
                    setShowAddRace(false)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <RaceForm
                race={editingRace}
                onSave={handleSaveRace}
                onCancel={() => {
                  setEditingRace(null)
                  setShowAddRace(false)
                }}
              />
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}

// Race Form Component
function RaceForm({
  race,
  onSave,
  onCancel,
}: {
  race: Race | null
  onSave: (data: Partial<Race>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: race?.title || "",
    date: race?.date || "",
    location: race?.location || "",
    distance: race?.distance || "",
    category: race?.category || "Maraton",
    registrationUrl: race?.registrationUrl || "",
    websiteUrl: race?.websiteUrl || "",
    description: race?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Yarış Adı</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-gray-800 border-gray-600 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Lokasyon</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mesafe</label>
          <Input
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
          >
            <option value="Maraton">Maraton</option>
            <option value="Yarı Maraton">Yarı Maraton</option>
            <option value="Ultra Trail">Ultra Trail</option>
            <option value="Trail">Trail</option>
            <option value="10K">10K</option>
            <option value="15K">15K</option>
            <option value="30K">30K</option>
            <option value="Yüzme">Yüzme</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Web Sitesi URL</label>
        <Input
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-gray-800 border-gray-600 text-white"
          rows={3}
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">
          <Save className="w-4 h-4 mr-2" />
          Kaydet
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-300 bg-transparent"
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
