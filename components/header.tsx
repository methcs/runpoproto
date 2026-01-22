"use client"

import { useState } from "react"
import { Menu, Mail, Instagram, Facebook, Twitter, Youtube, X, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// AuthButton is client-only; load dynamically to avoid include in server bundle
const AuthButton = dynamic(() => import('./auth-button'), { ssr: false })

interface HeaderProps {
  isAdmin?: boolean
  onAdminToggle?: () => void
}

export function Header({ isAdmin = false, onAdminToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-black text-white relative z-50">
        {/* Top contact bar */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">{/* boş alan */}</div>
                <div className="hidden sm:flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  <span>info@runpocoaching.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 font-bold text-sm tracking-wider">
                      AEROBIC POWER, SMART PACING
                    </span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <a href="/iletisim" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com/runpocoaching"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/runpocoaching"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com/@runpocoaching"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  {/* Admin Login Button */}
                  <div className="border-l border-gray-700 pl-3 ml-3">
                    <button
                      onClick={onAdminToggle}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 ${
                        isAdmin
                          ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
                          : "text-gray-400 hover:text-yellow-400"
                      }`}
                    >
                      {isAdmin ? (
                        <>
                          <LogOut className="w-4 h-4" />
                          <span className="text-xs font-semibold">ÇIKIŞ</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="text-xs font-semibold">YÖNETİCİ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/">
                <img
                  src="/images/runpo-logo.jpg"
                  alt="Runpo Coaching"
                  className="h-12 md:h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity duration-300"
                />
              </a>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium">
                Ana Sayfa
              </a>
              <a
                href="/hakkimizda"
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                Hakkımızda
              </a>
              <a
                href="/yaris-takvimi"
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                Yarış Takvimi
              </a>
              <a
                href="/yaris-tecrubelerim"
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                Yarış Tecrübelerimiz
              </a>
              <a
                href="/iletisim"
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                İletişim
              </a>

              {/* Auth button (Sign up / username) */}
              <div className="ml-4">
                <AuthButton />
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-yellow-400 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a
                href="/"
                className="block text-white hover:text-yellow-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </a>
              <a
                href="/hakkimizda"
                className="block text-white hover:text-yellow-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <a
                href="/yaris-takvimi"
                className="block text-white hover:text-yellow-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Yarış Takvimi
              </a>
              <a
                href="/yaris-tecrubelerim"
                className="block text-white hover:text-yellow-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Yarış Tecrübelerimiz
              </a>
              <a
                href="/iletisim"
                className="block text-white hover:text-yellow-400 transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </a>

              {/* Mobile auth button */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-center mb-3">
                  <AuthButton />
                </div>
              </div>

              {/* Mobile contact info */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  <span>info@runpocoaching.com</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 font-bold text-xs tracking-wider">
                      AEROBIC POWER, SMART PACING
                    </span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <style jsx global>{`
        [id^="v0-built-with-button"] {
          display: none !important;
        }
      `}</style>
    </>
  )
}
