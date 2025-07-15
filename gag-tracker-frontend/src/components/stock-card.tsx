"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"
import { WishlistButton } from "./wishlist-button"
import { useIsMobile } from "@/hooks/use-mobile"
import { memo } from "react"

interface StockItem {
  name: string
  count: string
  color: string
}

interface StockCardProps {
  title: string
  icon: ReactNode
  items: StockItem[]
  delay?: number
  children?: ReactNode
  isLoading?: boolean
}

// Memoized individual stock item component
const StockItemComponent = memo(
  ({
    item,
    title,
    index,
    isMobile,
  }: {
    item: StockItem
    title: string
    index: number
    isMobile: boolean
  }) => (
    <motion.div
      key={`${item.name}-${item.count}`}
      layout={!isMobile}
      initial={isMobile ? false : { opacity: 0, x: -20, scale: 0.95 }}
      animate={
        isMobile
          ? {}
          : {
              opacity: 1,
              x: 0,
              scale: 1,
              transition: {
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }
      }
      exit={
        isMobile
          ? {}
          : {
              opacity: 0,
              x: 20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }
      }
      whileHover={
        isMobile
          ? {}
          : {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
      }
      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className={`size-3 sm:size-4 rounded ${item.color}`} />
        <span className="text-xs sm:text-sm font-medium truncate">{item.name}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <span className="text-xs sm:text-sm font-bold px-1.5 py-0.5 rounded">{item.count}</span>
        <WishlistButton
          name={item.name}
          category={title}
          color={item.color}
          isCurrentlyInStock={item.count !== "x0"}
          size="sm"
        />
      </div>
    </motion.div>
  ),
)

StockItemComponent.displayName = "StockItemComponent"

export const StockCard = memo(function StockCard({
  title,
  icon,
  items,
  delay = 0,
  children,
  isLoading = false,
}: StockCardProps) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={isMobile ? false : { opacity: 0, y: 20 }}
      whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={isMobile ? {} : { duration: 0.5, delay }}
    >
      <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 rounded-lg bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center">
              {icon}
            </div>
            <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
            <div className="ml-auto size-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
              i
            </div>
          </div>

          {/* Loading state */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </motion.div>
            ) : children ? (
              <motion.div
                key="children"
                initial={isMobile ? false : { opacity: 0, y: 10 }}
                animate={isMobile ? {} : { opacity: 1, y: 0 }}
                exit={isMobile ? {} : { opacity: 0, y: -10 }}
                transition={isMobile ? {} : { duration: 0.3 }}
              >
                {children}
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial={isMobile ? false : { opacity: 0, y: 10 }}
                animate={isMobile ? {} : { opacity: 1, y: 0 }}
                exit={isMobile ? {} : { opacity: 0, y: -10 }}
                transition={isMobile ? {} : { duration: 0.3 }}
                className="space-y-2 sm:space-y-3"
              >
                <AnimatePresence mode={isMobile ? "wait" : "popLayout"}>
                  {items.map((item, i) => (
                    <StockItemComponent
                      key={`${item.name}-${item.count}`}
                      item={item}
                      title={title}
                      index={i}
                      isMobile={isMobile}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
})
