import type React from "react"
import "../styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export const metadata: Metadata = {
  title: "GaG Tracker - Shop Tracker",
  description: "Track real-time inventory and availability of seeds, tools, and cosmetics across all in-game shops.",
  icons: [
    {
      url: '/rosydelight.ico',
      sizes: 'any',
      type: 'image/x-icon',
    },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="preload" 
          href="/rosydelight.ico" 
          as="image" 
          type="image/x-icon"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
