"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { StockCard } from "./stock-card"
import { Sprout, Wrench, Egg, Cloud, ShoppingBag, Palette, X, Clock, RefreshCw } from "lucide-react"
import { useStockData } from "@/hooks/use-stock-data"
import { useWishlist } from "@/hooks/use-wishlist"
import { WishlistPanel, FloatingWishlistButton } from "./wishlist-panel"
import { useEffect, useState } from "react"
import { WishlistButton } from "./wishlist-button"
import { useMobile } from "@/hooks/use-mobile"

interface StockSectionProps {
  wishlistPanelOpen: boolean
  onWishlistPanelClose: () => void
  wishlistInitialView?: "wishlist" | "settings"
}

export function StockSection({ wishlistPanelOpen, onWishlistPanelClose, wishlistInitialView }: StockSectionProps) {
  const { data: stockData, previousData, loading, error, lastUpdated, nextUpdate } = useStockData()
  const { checkWishlistItems } = useWishlist()
  const [showFloatingButton, setShowFloatingButton] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const isMobile = useMobile()

  // Fallback to original mock data if API data is not available
  const fallbackData = {
    seeds: [
      { name: "Blueberry", count: "x1", color: "bg-blue-500" },
      { name: "Carrot", count: "x18", color: "bg-orange-500" },
      { name: "Strawberry", count: "x3", color: "bg-red-500" },
      { name: "Tomato", count: "x1", color: "bg-red-600" },
    ],
    gears: [
      { name: "Cleaning Spray", count: "x3", color: "bg-blue-500" },
      { name: "Favorite Tool", count: "x2", color: "bg-pink-500" },
      { name: "Harvest Tool", count: "x3", color: "bg-orange-500" },
      { name: "Watering Can", count: "x1", color: "bg-blue-600" },
    ],
    eggs: [
      { name: "Common Egg", count: "x4", color: "bg-gray-400" },
      { name: "Common Egg", count: "x4", color: "bg-gray-400" },
      { name: "Common Summer Egg", count: "x3", color: "bg-blue-400" },
    ],
    eventShop: [
      { name: "Delphinium", count: "x4", color: "bg-blue-500" },
      { name: "Summer Seed Pack", count: "x2", color: "bg-green-500" },
    ],
    cosmeticCrates: [
      { name: "Beach Crate", count: "x4", color: "bg-blue-400" },
      { name: "Sign Crate", count: "x4", color: "bg-orange-400" },
    ],
    cosmeticItems: [
      { name: "Large Wood Flooring", count: "x4", color: "bg-amber-500" },
      { name: "Torch", count: "x2", color: "bg-orange-500" },
      { name: "Shovel Grove", count: "x1", color: "bg-green-500" },
      { name: "Rock Pile", count: "x3", color: "bg-gray-500" },
      { name: "Log", count: "x3", color: "bg-amber-600" },
      { name: "Small Wood Flooring", count: "x4", color: "bg-amber-400" },
      { name: "Cabana", count: "x1", color: "bg-blue-400" },
    ],
  }

  const currentData = stockData || fallbackData

  // Check for wishlist items when stock data updates
  useEffect(() => {
    if (currentData) {
      console.log("Stock data changed, checking wishlist items")
      checkWishlistItems(currentData, previousData)
    }
  }, [currentData, previousData, checkWishlistItems])

  // Hide floating button when panel is open
  useEffect(() => {
    setShowFloatingButton(!wishlistPanelOpen)
  }, [wishlistPanelOpen])

  // Show updating animation when data changes
  useEffect(() => {
    if (stockData && previousData && stockData !== previousData) {
      setIsUpdating(true)
      const timer = setTimeout(() => setIsUpdating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [stockData, previousData])

  // Add loading state in the title section
  const titleSection = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12"
    >
      <Badge className="rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium" variant="secondary">
        <div className="flex items-center gap-2">
          <span>🌱 Live Stock Market</span>
          {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
          {isUpdating && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2 w-2 bg-green-500 rounded-full" />
          )}
        </div>
      </Badge>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Grow a Garden - Shop Tracker</h2>
      <p className="max-w-[800px] text-muted-foreground text-sm sm:text-base md:text-lg px-4">
        Track real-time inventory and availability of seeds, tools, and cosmetics across all in-game shops.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-xs text-muted-foreground">
        {lastUpdated && (
          <motion.div
            className="flex items-center gap-1"
            key={lastUpdated.getTime()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Clock className="h-3 w-3" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </motion.div>
        )}
        {nextUpdate && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Next update: {nextUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
          Error loading data: {error}
        </motion.p>
      )}
    </motion.div>
  )

  return (
    <section
      id="stock"
      className="w-full pt-6 sm:pt-8 pb-16 sm:pb-20 md:pt-12 md:pb-32 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="container px-4 md:px-6 relative">
        {titleSection}

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <StockCard
            title="Seeds"
            icon={<Sprout className="size-4 text-green-600 dark:text-green-400" />}
            items={currentData.seeds}
            delay={isMobile ? 0 : 0.1}
            isLoading={loading}
          />

          <StockCard
            title="Gears"
            icon={<Wrench className="size-4 text-gray-600 dark:text-gray-400" />}
            items={currentData.gears}
            delay={isMobile ? 0 : 0.2}
            isLoading={loading}
          />

          <StockCard
            title="Eggs"
            icon={<Egg className="size-4 text-yellow-600 dark:text-yellow-400" />}
            items={currentData.eggs}
            delay={isMobile ? 0 : 0.3}
            isLoading={loading}
          />

          <StockCard
            title="Weather"
            icon={<Cloud className="size-4 text-blue-600 dark:text-blue-400" />}
            items={[]}
            delay={isMobile ? 0 : 0.4}
            isLoading={loading}
          >
            {!loading && (
              <div className="text-center py-6 sm:py-8">
                <div className="size-12 sm:size-16 mx-auto mb-4 rounded-full bg-orange-500/10 dark:bg-orange-400/10 flex items-center justify-center">
                  <X className="size-6 sm:size-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Weather data is currently unavailable</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Checking for updates...</p>
              </div>
            )}
          </StockCard>

          <StockCard
            title="Event Shop Stock"
            icon={<ShoppingBag className="size-4 text-purple-600 dark:text-purple-400" />}
            items={currentData.eventShop}
            delay={isMobile ? 0 : 0.5}
            isLoading={loading}
          />

          <StockCard
            title="Cosmetics"
            icon={<Palette className="size-4 text-pink-600 dark:text-pink-400" />}
            items={[]}
            delay={isMobile ? 0 : 0.6}
            isLoading={loading}
          >
            {!loading && (
              <div className="space-y-4">
                {currentData.cosmeticCrates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Cosmetic Crates
                    </p>
                    <div className="space-y-2">
                      {currentData.cosmeticCrates.map((item, i) => (
                        <motion.div
                          key={`${item.name}-${item.count}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`size-2.5 sm:size-3 rounded ${item.color}`}></div>
                            <span className="text-xs font-medium truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <motion.span
                              key={item.count}
                              initial={{
                                scale: 1.2,
                                backgroundColor: "rgba(16, 185, 129, 1)",
                                color: "rgba(255, 255, 255, 1)",
                              }}
                              animate={{
                                scale: 1,
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                color: "rgba(var(--foreground-rgb), 1)",
                              }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="text-xs font-bold px-1 py-0.5 rounded"
                            >
                              {item.count}
                            </motion.span>
                            <WishlistButton
                              name={item.name}
                              category="Cosmetics"
                              color={item.color}
                              isCurrentlyInStock={item.count !== "x0"}
                              size="sm"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentData.cosmeticItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Cosmetic Items
                    </p>
                    <div className="space-y-1">
                      {currentData.cosmeticItems.map((item, i) => (
                        <motion.div
                          key={`${item.name}-${item.count}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                          className="flex items-center justify-between p-1.5 rounded bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`size-2 sm:size-2.5 rounded ${item.color}`}></div>
                            <span className="text-xs font-medium truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <motion.span
                              key={item.count}
                              initial={{
                                scale: 1.2,
                                backgroundColor: "rgba(16, 185, 129, 1)",
                                color: "rgba(255, 255, 255, 1)",
                              }}
                              animate={{
                                scale: 1,
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                color: "rgba(var(--foreground-rgb), 1)",
                              }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="text-xs font-bold px-1 py-0.5 rounded"
                            >
                              {item.count}
                            </motion.span>
                            <WishlistButton
                              name={item.name}
                              category="Cosmetics"
                              color={item.color}
                              isCurrentlyInStock={item.count !== "x0"}
                              size="sm"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentData.cosmeticCrates.length === 0 && currentData.cosmeticItems.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <div className="size-12 sm:size-16 mx-auto mb-4 rounded-full bg-gray-500/10 dark:bg-gray-400/10 flex items-center justify-center">
                      <Palette className="size-6 sm:size-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">No cosmetic items available</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Check back later for updates</p>
                  </div>
                )}
              </div>
            )}
          </StockCard>
        </div>
      </div>

      {/* Floating wishlist button - only show when panel is closed */}
      {showFloatingButton && (
        <FloatingWishlistButton onClick={() => window.dispatchEvent(new CustomEvent("openWishlist"))} />
      )}

      {/* Wishlist Panel */}
      <WishlistPanel isOpen={wishlistPanelOpen} onClose={onWishlistPanelClose} initialView={wishlistInitialView} />
    </section>
  )
}
