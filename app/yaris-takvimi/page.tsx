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
  registrationDate: string
}

interface Race {
  id: number
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

const initialRaces: Race[] = [
  // Ocak 2026
  {
    id: 1,
    title: "Salomon Çeşme YM",
    date: "2026-02-11",
    location: "Çeşme, İzmir",
    distance: "10K, 21K, 42K",
    category: "Yarı Maraton",
    websiteUrl: "https://salomonceşme.com",
    description: "Çeşme'nin eşsiz manzarasında yol koşusu.",
    participants: [],
  },
  {
    id: 2,
    title: "Tahtalı Run to Sky",
    date: "2026-02-09",
    location: "Kemer, Antalya",
    distance: "12K, 27K, 65K",
    category: "Ultra Trail",
    websiteUrl: "https://tahtaliruntosky.com",
    description: "Antalya'nın zirvesine tırmanış. UTMB Index ve ITRA puanlı.",
    participants: [],
  },
  {
    id: 3,
    title: "Kyzikos Ultra",
    date: "2026-02-17",
    location: "Erdek, Balıkesir",
    distance: "5K, 20K, 35K, 65K",
    category: "Ultra Trail",
    websiteUrl: "https://kyzikosultra.com",
    description: "Erdek'in doğal güzelliklerinde UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 4,
    title: "Cadde 10K - 21K",
    date: "2026-02-25",
    location: "Caddebostan, İstanbul",
    distance: "10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://cadde10k.com",
    description: "Caddebostan sahilinde şehir koşusu.",
    participants: [],
  },
  {
    id: 5,
    title: "Efeler Yolu Ultra Trail",
    date: "2026-02-24",
    location: "Birgi, İzmir",
    distance: "5K, 15K, 30K, 50K, 80K",
    category: "Ultra Trail",
    websiteUrl: "https://efeleryoluultra.com",
    description: "ITRA ve UTMB Index puanlı yeni ultra trail etkinliği.",
    participants: [],
  },
  {
    id: 6,
    title: "Gökçeada Ultra Trail Run",
    date: "2026-02-31",
    location: "Gökçeada, Çanakkale",
    distance: "5K, 11K, 33K, 44K",
    category: "Ultra Trail",
    websiteUrl: "https://gokceadaultra.com",
    description: "Ada'nın doğal güzelliklerinde ITRA puanlı trail koşusu.",
    participants: [],
  },
  {
    id: 7,
    title: "Latmos Ultra",
    date: "2026-05-31",
    location: "Bafa, Aydın",
    distance: "10K, 17K, 26K, 45K",
    category: "Ultra Trail",
    websiteUrl: "https://latmosultra.com",
    description: "Bafa Gölü ve antik kalıntılar eşliğinde trail deneyimi.",
    participants: [],
  },
  // Haziran 2025
  {
    id: 8,
    title: "Mozart 100 by UTMB",
    date: "2026-06-07",
    location: "Salzburg, Avusturya",
    distance: "9K, 20K, 37K, 45K, 92K, 119K",
    category: "Ultra Trail",
    websiteUrl: "https://mozart100.com",
    description: "UTMB World Series yarışı, Avusturya Alpleri'nde.",
    participants: [],
  },
  {
    id: 9,
    title: "Sapanca Ultra",
    date: "2026-06-14",
    location: "Sapanca, Sakarya",
    distance: "6K, 13K, 24K, 40K, 60K",
    category: "Ultra Trail",
    websiteUrl: "https://sapancaultra.com",
    description: "Sapanca Gölü manzarasında ITRA ve UTMB Index puanlı trail.",
    participants: [],
  },
  {
    id: 10,
    title: "Mont Blanc Maratonu",
    date: "2026-06-26",
    location: "Chamonix, Fransa",
    distance: "10K, 23K, 42K, 90K",
    category: "Ultra Trail",
    websiteUrl: "https://montblancmarathon.net",
    description: "Dünyanın en ikonik dağ maratonlarından biri.",
    participants: [],
  },
  {
    id: 11,
    title: "METU Trail Run",
    date: "2026-06-28",
    location: "ODTÜ, Ankara",
    distance: "6K, 12K, 25K",
    category: "Trail",
    websiteUrl: "https://metutrail.com",
    description: "ODTÜ ormanlarında trail koşusu.",
    participants: [],
  },
  {
    id: 12,
    title: "Gölpazarı Ultra Trail",
    date: "2026-06-27",
    location: "Gölpazarı, Bilecik",
    distance: "10K, 30K, 65K",
    category: "Ultra Trail",
    websiteUrl: "https://golpazariultra.com",
    description: "Bilecik'in doğal güzelliklerinde ultra trail.",
    participants: [],
  },
  // Temmuz 2025
  {
    id: 13,
    title: "Aladağlar Epic Trail",
    date: "2026-07-11",
    location: "Niğde, Demirkazık",
    distance: "13K, 25K, 55K",
    category: "Ultra Trail",
    websiteUrl: "https://aladaglarepictrail.com",
    description: "Aladağlar'ın muhteşem manzarasında epic trail deneyimi.",
    participants: [],
  },
  {
    id: 14,
    title: "Uludağ Premium Ultra Trail",
    date: "2026-07-19",
    location: "Bursa",
    distance: "6K, 16K, 30K, 42K, 66K, 95K",
    category: "Ultra Trail",
    websiteUrl: "https://uludagultra.com",
    description: "Uludağ'ın zorlu parkurunda ITRA ve UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 15,
    title: "Palandöken Run to Sky",
    date: "2026-07-25",
    location: "Erzurum",
    distance: "5K VK, 25K, 51K",
    category: "Ultra Trail",
    websiteUrl: "https://palandokenruntosky.com",
    description: "Palandöken'in zirvesine tırmanış. ITRA puanlı yeni etkinlik.",
    participants: [],
  },
  {
    id: 16,
    title: "Kanyon Ulubey Ultra Trail",
    date: "2026-07-26",
    location: "Ulubey, Uşak",
    distance: "10K, 35K, 60K",
    category: "Ultra Trail",
    websiteUrl: "https://kanyonulubey.com",
    description: "Ulubey Kanyonu'nun eşsiz manzarasında ultra trail.",
    participants: [],
  },
  // Ağustos 2025
  {
    id: 17,
    title: "Gece Maratonu",
    date: "2026-08-02",
    location: "Sarıyer, İstanbul",
    distance: "42K",
    category: "Maraton",
    websiteUrl: "https://gecemaratonu.com",
    description: "İstanbul'da gece koşusu deneyimi.",
    participants: [],
  },
  {
    id: 18,
    title: "Eskişehir Yarı Maratonu",
    date: "2026-08-03",
    location: "Eskişehir",
    distance: "10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://eskisehiryarimaratonu.com",
    description: "Eskişehir'in tarihi sokaklarında koşu deneyimi.",
    participants: [],
  },
  {
    id: 19,
    title: "Ultra Abant",
    date: "2026-08-09",
    location: "Bolu",
    distance: "6K, 18K, 33K, 60K",
    category: "Ultra Trail",
    websiteUrl: "https://ultraabant.com",
    description: "Abant Gölü çevresinde ITRA ve UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 20,
    title: "Runfire Salt Lake",
    date: "2026-08-22",
    location: "Aksaray",
    distance: "10K, 15K, 20K, 40K, 80K, 100M",
    category: "Ultra Trail",
    websiteUrl: "https://runfiresaltlake.com",
    description: "Tuz Gölü'nün eşsiz manzarasında ITRA ve UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 21,
    title: "Boğaziçi Kıtalararası Yüzme",
    date: "2026-08-24",
    location: "İstanbul",
    distance: "6.5K Yüzme",
    category: "Yüzme",
    websiteUrl: "https://bogaziciyuzme.com",
    description: "Asya'dan Avrupa'ya efsanevi yüzme yarışı.",
    participants: [],
  },
  {
    id: 22,
    title: "UTMB Mont Blanc",
    date: "2026-08-29",
    location: "Chamonix, Fransa",
    distance: "40K-170K",
    category: "Ultra Trail",
    websiteUrl: "https://utmb.world",
    description: "Dünyanın en prestijli ultra trail yarışı.",
    participants: [],
  },
  {
    id: 23,
    title: "Edirne Maratonu",
    date: "2026-08-31",
    location: "Edirne",
    distance: "10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://edirnemaratonu.org.tr",
    description: "Tarihi Edirne'de kültürel koşu deneyimi.",
    participants: [],
  },
  {
    id: 24,
    title: "Chios Sakız Adası YM",
    date: "2026-08-31",
    location: "Sakız Adası, Yunanistan",
    distance: "5K, 10.5K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://chiosmarathon.gr",
    description: "Yunanistan'ın güzel Sakız Adası'nda yarı maraton.",
    participants: [],
  },
  // Eylül 2025
  {
    id: 25,
    title: "Merrell Belgrad Ultra Trail",
    date: "2026-09-05",
    location: "Kemerburgaz, İstanbul",
    distance: "5K, 15K, 30K, 60K",
    category: "Ultra Trail",
    websiteUrl: "https://www.belgradultra.com/tr",
    description: "Belgrad Ormanı'nda ITRA ve UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 26,
    title: "9 Eylül İzmir'in Kurtuluşu YM",
    date: "2026-09-07",
    location: "İzmir",
    distance: "21K",
    category: "Yarı Maraton",
    websiteUrl: "https://izmiryarimaratonu.com",
    description: "İzmir'in kurtuluş günü anısına yarı maraton.",
    participants: [],
  },
  {
    id: 27,
    title: "Frig Ultra",
    date: "2026-09-12",
    location: "Afyonkarahisar",
    distance: "2K VK, 6K, 12K, 22K, 38K, 54K",
    category: "Ultra Trail",
    websiteUrl: "https://frigultra.com",
    description: "Frig Vadisi'nde ITRA ve UTMB Index puanlı trail koşusu.",
    participants: [],
  },
  {
    id: 28,
    title: "İstanbul'u Koşuyorum Asya",
    date: "2026-09-14",
    location: "Üsküdar, İstanbul",
    distance: "5K, 10K",
    category: "10K",
    websiteUrl: "https://istanbulukosuyorum.istanbul",
    description: "İstanbul'un Asya yakasında koşu etkinliği.",
    participants: [],
  },
  {
    id: 29,
    title: "Nilüfer BURSA YM",
    date: "2026-09-14",
    location: "Nilüfer, Bursa",
    distance: "5K, 10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://niluferyarimaratonu.com",
    description: "Bursa Nilüfer'de yarı maraton.",
    participants: [],
  },
  {
    id: 30,
    title: "Under Armour Gece Koşuları",
    date: "2026-09-20",
    location: "Belgrad Ormanı, İstanbul",
    distance: "6K, 12K",
    category: "Trail",
    websiteUrl: "https://underarmourgece.com",
    description: "Belgrad Ormanı'nda gece trail koşusu.",
    participants: [],
  },
  {
    id: 31,
    title: "Kayseri Yarı Maratonu",
    date: "2026-09-21",
    location: "Kayseri",
    distance: "10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://kayseriyarimaratonu.com",
    description: "Erciyes Dağı manzarasında yarı maraton.",
    participants: [],
  },
  {
    id: 32,
    title: "Berlin Maratonu",
    date: "2026-09-21",
    location: "Berlin, Almanya",
    distance: "42K",
    category: "Maraton",
    websiteUrl: "https://berlin-marathon.com",
    description: "Dünyanın en hızlı maraton parkurlarından biri.",
    participants: [],
  },
  {
    id: 33,
    title: "Kaçkar by UTMB",
    date: "2026-09-26",
    location: "Rize",
    distance: "20K, 50K, 100K",
    category: "Ultra Trail",
    websiteUrl: "https://kackar.utmb.world/tr",
    description: "UTMB World Series'in Türkiye ayağı, Kaçkar Dağları'nda.",
    participants: [],
  },
  {
    id: 34,
    title: "Ultimate Cunda",
    date: "2026-09-27",
    location: "Ayvalık, Cunda",
    distance: "7K, 12K, 22K + Yüzme",
    category: "Maraton",
    websiteUrl: "https://www.teamkronos.com/ultimate-cunda",
    description: "Cunda Adası'nda koşu ve yüzme kombinasyonu.",
    participants: [],
  },
  {
    id: 35,
    title: "Urla'da Biriz Koşusu",
    date: "2026-09-28",
    location: "Urla, İzmir",
    distance: "5K, 10K",
    category: "10K",
    websiteUrl: "https://urlakosusi.com",
    description: "Urla'da sosyal sorumluluk koşusu.",
    participants: [],
  },
  // Ekim 2025
  {
    id: 36,
    title: "Eker I Run Koşusu",
    date: "2026-10-05",
    location: "Bursa",
    distance: "5K, 15K, 42K",
    category: "Maraton",
    websiteUrl: "https://ekerirun.com",
    description: "Bursa'da geleneksel Eker koşusu.",
    participants: [],
  },
  {
    id: 37,
    title: "Bodrum Yarı Maratonu",
    date: "2026-10-05",
    location: "Bodrum",
    distance: "5K, 10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://bodrumyarimaratonu.com",
    description: "Ege'nin incisi Bodrum'da deniz kenarında UTMB Index puanlı koşu.",
    participants: [],
  },
  {
    id: 38,
    title: "Üsküp Yarı Maratonu",
    date: "2026-10-05",
    location: "Üsküp, Kuzey Makedonya",
    distance: "21K",
    category: "Yarı Maraton",
    websiteUrl: "http://skopskimaraton.com.mk/en/",
    description: "Üsküp'ün tarihi merkezinde koşu deneyimi.",
    participants: [],
  },
  {
    id: 39,
    title: "Bosphorun",
    date: "2026-10-12",
    location: "Kuruçeşme, İstanbul",
    distance: "10K",
    category: "10K",
    websiteUrl: "https://bosphorun.istanbul",
    description: "Boğaz manzarasında 10K koşusu.",
    participants: [],
  },
  {
    id: 40,
    title: "Salomon Cappadocia Ultra Trail",
    date: "2026-10-18",
    location: "Nevşehir",
    distance: "14K, 38K, 63K, 119K",
    category: "Ultra Trail",
    websiteUrl: "https://cappadociaultratrail.com",
    description: "Kapadokya'nın büyüleyici manzaraları eşliğinde ITRA ve UTMB Index puanlı ultra trail.",
    participants: [],
  },
  {
    id: 41,
    title: "Big Dog's Backyard Ultra",
    date: "2026-10-18",
    location: "Tennessee, ABD",
    distance: "Backyard Ultra",
    category: "Ultra Trail",
    websiteUrl: "https://backyardultra.com",
    description: "Dünyanın en zorlu backyard ultra formatı.",
    participants: [],
  },
  {
    id: 42,
    title: "Büyükada Yarı Maratonu",
    date: "2026-10-19",
    location: "Büyükada, İstanbul",
    distance: "5K, 10K, 21K",
    category: "Yarı Maraton",
    websiteUrl: "https://buyukadayarimaratonu.com",
    description: "Büyükada'nın yokuşlu sokaklarında zorlu yarı maraton.",
    participants: [],
  },
  {
    id: 43,
    title: "Amsterdam Maratonu",
    date: "2026-10-19",
    location: "Amsterdam, Hollanda",
    distance: "8K, 21K, 42K",
    category: "Maraton",
    websiteUrl: "https://tcsamsterdammarathon.nl",
    description: "Hollanda'nın düz parkurunda hızlı maraton.",
    participants: [],
  },
  {
    id: 44,
    title: "Kaş Yarı Maratonu",
    date: "2026-10-26",
    location: "Kaş, Antalya",
    distance: "21K",
    category: "Yarı Maraton",
    websiteUrl: "https://www.kasyarimadaton.com",
    description: "Akdeniz'in turkuaz sularına karşı koşu deneyimi.",
    participants: [],
  },
  {
    id: 45,
    title: "Valencia Yarı Maratonu",
    date: "2026-10-26",
    location: "Valencia, İspanya",
    distance: "21K",
    category: "Yarı Maraton",
    websiteUrl: "https://www.valenciaciudaddelrunning.com/en/half/half-marathon",
    description: "İspanya'nın güneşli şehri Valencia'da yarı maraton.",
    participants: [],
  },
  // Kasım 2025
  {
    id: 46,
    title: "İstanbul Maratonu",
    date: "2026-11-02",
    location: "İstanbul",
    distance: "15K, 42K",
    category: "Maraton",
    websiteUrl: "https://maraton.istanbul",
    description: "Türkiye'nin en büyük maraton etkinliği. Boğaz köprüsü üzerinden geçen eşsiz parkur.",
    participants: [],
  },
  {
    id: 47,
    title: "Marmaris Ultra",
    date: "2026-11-15",
    location: "Marmaris",
    distance: "Multi-distance",
    category: "Ultra Trail",
    websiteUrl: "https://marmarisultra.com",
    description: "Marmaris'in doğal güzellikleri eşliğinde ultra trail.",
    participants: [],
  },
  {
    id: 48,
    title: "İda Ultra",
    date: "2026-11-29",
    location: "Çanakkale",
    distance: "Multi-distance",
    category: "Ultra Trail",
    websiteUrl: "https://www.idaultra.com/#intro",
    description: "Kazdağları'nın eteklerinde zorlu ultra trail deneyimi.",
    participants: [],
  },
  // Aralık 2025
  {
    id: 49,
    title: "Valencia Maratonu",
    date: "2026-12-07",
    location: "Valencia, İspanya",
    distance: "42K",
    category: "Maraton",
    websiteUrl: "https://www.valenciaciudaddelrunning.com/en/marathon/marathon",
    description: "Dünya'nın en hızlı maraton parkurlarından biri, Valencia'da.",
    participants: [],
  },
]

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
  })
  const [races, setRaces] = useState<Race[]>([])

  // Load races from localStorage on mount
  useEffect(() => {
    const savedRaces = localStorage.getItem("runpo-races")
    if (savedRaces) {
      try {
        const parsedRaces = JSON.parse(savedRaces)
        // Check if races are outdated (from 2025), if so, use initialRaces
        if (parsedRaces.length > 0 && parsedRaces[0].date && parsedRaces[0].date.includes("2025")) {
          localStorage.removeItem("runpo-races")
          setRaces(initialRaces)
        } else {
          setRaces(parsedRaces)
        }
      } catch (error) {
        console.error("Error loading races from localStorage:", error)
        setRaces(initialRaces)
      }
    } else {
      setRaces(initialRaces)
    }
  }, [])

  // Save races to localStorage whenever they change
  useEffect(() => {
    if (races.length > 0) {
      localStorage.setItem("runpo-races", JSON.stringify(races))
    }
  }, [races])

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
    
    if (adminPassword === ADMIN_PASSWORD) {
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

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRace) return

    const newParticipant: Participant = {
      id: Date.now(),
      name: registrationForm.name,
      surname: registrationForm.surname,
      email: registrationForm.email,
      registrationDate: new Date().toISOString(),
    }

    setRaces(
      races.map((race) =>
        race.id === selectedRace.id ? { ...race, participants: [...(race.participants || []), newParticipant] } : race,
      ),
    )

    // Reset form
    setRegistrationForm({
      name: "",
      surname: "",
      email: "",
    })
    setShowRegistrationModal(false)
    setSelectedRace(null)

    // Show success message
    alert(`🎉 Başarıyla kayıt oldunuz! ${selectedRace.title} yarışında görüşmek üzere!`)
  }

  const openRegistrationModal = (race: Race) => {
    setSelectedRace(race)
    setShowRegistrationModal(true)
  }

  const openParticipantsModal = (race: Race) => {
    setSelectedRace(race)
    setShowParticipantsModal(true)
  }

  const exportToExcel = (race: Race) => {
    if (!race.participants || race.participants.length === 0) {
      alert("Bu yarışta henüz katılımcı yok.")
      return
    }

    // CSV header
    const headers = ["Sıra", "Ad", "Soyad", "E-Mail", "Kayıt Tarihi"]

    // CSV rows
    const rows = race.participants.map((participant, index) => [
      index + 1,
      participant.name,
      participant.surname,
      participant.email,
      new Date(participant.registrationDate).toLocaleDateString("tr-TR"),
    ])

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Add UTF-8 BOM for proper Turkish character display in Excel
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })

    // Create download link
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    const fileName = `${race.title.replace(/\s+/g, "_")}_Katilimcilar_${new Date().toISOString().split("T")[0]}.csv`

    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
              2025 yılının en heyecan verici koşu etkinlikleri
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
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`${isEditMode ? "bg-red-500 hover:bg-red-600" : "bg-yellow-400 hover:bg-yellow-500"} text-black font-semibold`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditMode ? "Düzenlemeyi Bitir" : "Takvimi Düzenle"}
                </Button>
                {isEditMode && (
                  <Button onClick={() => setShowAddRace(true)} className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Yarış Ekle
                  </Button>
                )}
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
