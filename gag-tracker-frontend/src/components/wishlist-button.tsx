"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Heart, HeartOff } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"

interface WishlistButtonProps {
  name: string
  category: string
  color: string
  isCurrentlyInStock: boolean
  size?: "sm" | "default"
}

export function WishlistButton({ name, category, color, isCurrentlyInStock, size = "sm" }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlist } = useWishlist()
  const inWishlist = isInWishlist(name, category)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      // Find the item to remove
      const item = wishlist.find((item) => item.name === name && item.category === category)
      if (item) {
        removeFromWishlist(item.id)
      }
    } else {
      addToWishlist(name, category, color, isCurrentlyInStock)
    }
  }

  return (
    <Button
      variant={inWishlist ? "default" : "ghost"}
      size={size}
      onClick={handleToggle}
      className={`${size === "sm" ? "h-6 w-6 p-0" : ""} ${
        inWishlist
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 dark:hover:text-red-400"
      } transition-colors`}
    >
      {inWishlist ? <Heart className="h-3 w-3 fill-current" /> : <HeartOff className="h-3 w-3" />}
      <span className="sr-only">{inWishlist ? "Remove from" : "Add to"} wishlist</span>
    </Button>
  )
}
