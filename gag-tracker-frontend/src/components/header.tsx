"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface HeaderProps {
  isScrolled: boolean
  mounted: boolean
  onStartTracking?: () => void
}

// Custom hook for smooth scrolling
const useSmoothScroll = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return { scrollToSection, scrollToTop }
}

export function Header({ isScrolled, mounted, onStartTracking }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollToSection, scrollToTop } = useSmoothScroll()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleStartTracking = () => {
    if (onStartTracking) {
      onStartTracking()
    }
    setMobileMenuOpen(false)
  }

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <button onClick={scrollToTop} className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
            G
          </div>
          <span>Grow a Garden Tracker</span>
        </button>
        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={() => handleNavClick("stock")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Live Data
          </button>
          <button
            onClick={() => handleNavClick("faq")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button className="rounded-full" onClick={handleStartTracking}>
            Start Tracking
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
        >
          <div className="container py-4 flex flex-col gap-4">
            <button
              onClick={() => handleNavClick("stock")}
              className="py-2 text-sm font-medium text-left hover:text-primary transition-colors"
            >
              Live Data
            </button>
            <button
              onClick={() => handleNavClick("faq")}
              className="py-2 text-sm font-medium text-left hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link href="#" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Button className="rounded-full" onClick={handleStartTracking}>
                Start Tracking
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
