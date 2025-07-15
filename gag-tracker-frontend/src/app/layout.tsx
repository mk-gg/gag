import type React from "react"
import "../styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GaG Tracker - Shop Tracker",
  description: "Track real-time inventory and availability of seeds, tools, and cosmetics across all in-game shops.",
  icons: [
      {
        url: '/sugarapple.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
