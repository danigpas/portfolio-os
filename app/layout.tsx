import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat, Open_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-system"
import { LanguageProvider } from "@/components/language-provider"
import { getCvData } from "@/lib/cv-data"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
})

const siteUrl = "https://danigpascual.dev"
const cv = getCvData("es")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: cv.meta.title,
    template: "%s | Daniel González Pascual",
  },
  description: cv.meta.description,
  keywords: cv.meta.keywords,
  authors: [{ name: cv.about.name, url: siteUrl }],
  creator: cv.about.name,
  applicationName: "Daniel González Pascual - Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Daniel González Pascual - Portfolio",
    title: cv.meta.title,
    description: cv.meta.description,
    images: [
      {
        url: "/daniel-gonzalez-pascual-portrait.png",
        width: 1024,
        height: 1024,
        alt: "Daniel González Pascual, desarrollador backend Python",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: cv.meta.title,
    description: cv.meta.description,
    images: ["/daniel-gonzalez-pascual-portrait.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daniel Portfolio",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1b26",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${openSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
