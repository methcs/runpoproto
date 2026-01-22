import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import ClientProviders from '../components/client-providers'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Runpo Coaching - Profesyonel Koşu Antrenmanı",
  description:
    "Bilimsel yaklaşımla koşu antrenmanları. Kişiselleştirilmiş programlar ve profesyonel koçluk hizmetleri.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={poppins.className}><ClientProviders>{children}</ClientProviders></body>
    </html>
  )
}
