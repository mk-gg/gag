"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { StockSection } from "@/components/stock-section"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { useWishlist } from "@/hooks/use-wishlist"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [wishlistPanelOpen, setWishlistPanelOpen] = useState(false)
  const [wishlistInitialView, setWishlistInitialView] = useState<"wishlist" | "settings">("wishlist")
  const { requestNotificationPermission, updateNotificationSettings, notificationSettings } = useWishlist()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Listen for custom wishlist events
    const handleOpenWishlist = () => {
      setWishlistInitialView("wishlist")
      setWishlistPanelOpen(true)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("openWishlist", handleOpenWishlist)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("openWishlist", handleOpenWishlist)
    }
  }, [])

  const handleStartTracking = () => {
    setWishlistInitialView("wishlist")
    setWishlistPanelOpen(true)
  }

  const handleEnableNotifications = async () => {
    if (!notificationSettings.enabled) {
      const granted = await requestNotificationPermission()
      if (granted) {
        updateNotificationSettings({
          ...notificationSettings,
          enabled: true,
        })
      }
    }
    setWishlistInitialView("settings")
    setWishlistPanelOpen(true)
  }

  const handleSetupWishlist = () => {
    setWishlistInitialView("wishlist")
    setWishlistPanelOpen(true)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header isScrolled={isScrolled} mounted={mounted} onStartTracking={handleStartTracking} />
      <main className="flex-1">
        <StockSection
          wishlistPanelOpen={wishlistPanelOpen}
          onWishlistPanelClose={() => setWishlistPanelOpen(false)}
          wishlistInitialView={wishlistInitialView}
        />
        <FaqSection />
        <CtaSection onEnableNotifications={handleEnableNotifications} onSetupWishlist={handleSetupWishlist} />
      </main>
      <Footer />
    </div>
  )
}
