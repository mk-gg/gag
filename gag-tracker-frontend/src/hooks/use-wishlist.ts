"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { WishlistItem, NotificationSettings } from "@/types/wishlist"
import type { ProcessedStockData } from "@/types/api"

const WISHLIST_STORAGE_KEY = "garden-tracker-wishlist"
const NOTIFICATION_SETTINGS_KEY = "garden-tracker-notifications"
const NOTIFICATION_DEBOUNCE_MS = 5000 // 5 second debounce

// Create a simple event emitter for cross-component updates
class WishlistEventEmitter {
  private listeners: Array<() => void> = []

  subscribe(callback: () => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  emit() {
    // Defer the emission to avoid state updates during render
    setTimeout(() => {
      this.listeners.forEach((listener) => listener())
    }, 0)
  }
}

const wishlistEmitter = new WishlistEventEmitter()

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    sound: true,
    desktop: true,
  })
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Add refs for debouncing
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingNotificationsRef = useRef<Array<{ item: WishlistItem; quantity: string }>>([])
  const isInitialLoadRef = useRef(true)

  // Subscribe to external wishlist changes
  useEffect(() => {
    const unsubscribe = wishlistEmitter.subscribe(() => {
      setUpdateTrigger((prev) => prev + 1)
    })
    return unsubscribe
  }, [])

  // Load wishlist and settings from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
    const savedSettings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)

    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        setWishlist(parsedWishlist)
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }

    if (savedSettings) {
      try {
        setNotificationSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse notification settings from localStorage:", error)
      }
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    // Set initial load timeout
    const initialLoadTimeout = setTimeout(() => {
      isInitialLoadRef.current = false
    }, NOTIFICATION_DEBOUNCE_MS)

    return () => {
      clearTimeout(initialLoadTimeout)
    }
  }, [updateTrigger])

  // Save notification settings
  const saveNotificationSettings = useCallback((settings: NotificationSettings) => {
    setNotificationSettings(settings)
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
  }, [])

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      return permission === "granted"
    }
    return false
  }

  // Add item to wishlist
  const addToWishlist = useCallback((name: string, category: string, color: string, isCurrentlyInStock: boolean) => {
    setWishlist((currentWishlist) => {
      // Check if item already exists
      const exists = currentWishlist.some((item) => item.name === name && item.category === category)
      if (exists) return currentWishlist

      const newItem: WishlistItem = {
        id: `${category}-${name}-${Date.now()}`,
        name,
        category,
        color,
        addedAt: new Date().toISOString(),
        notified: false,
      }

      const newWishlist = [...currentWishlist, newItem]
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist))

      // Emit after state update is complete
      setTimeout(() => {
        wishlistEmitter.emit()
      }, 0)

      return newWishlist
    })
  }, [])

  // Remove item from wishlist
  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((currentWishlist) => {
      const newWishlist = currentWishlist.filter((item) => item.id !== id)
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist))

      // Emit after state update is complete
      setTimeout(() => {
        wishlistEmitter.emit()
      }, 0)

      return newWishlist
    })
  }, [])

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (name: string, category: string) => {
      return wishlist.some((item) => item.name === name && item.category === category)
    },
    [wishlist],
  )

  // Helper function to get stock quantity for an item
  const getStockQuantity = (stockData: ProcessedStockData, itemName: string, itemCategory: string): string | null => {
    const categoryKey = itemCategory.toLowerCase().replace(/\s+/g, "")
    const items = stockData[categoryKey as keyof ProcessedStockData] || []
    const item = items.find((i) => i.name === itemName)
    return item ? item.count : null
  }

  // Show notification for available items
  const showNotification = useCallback(
    (availableItems: Array<{ item: WishlistItem; quantity: string }>) => {
      if (!notificationSettings.enabled || notificationPermission !== "granted" || availableItems.length === 0) return

      if (notificationSettings.desktop) {
        // Always show grouped notification
        const itemsToShow = availableItems.slice(0, 6)
        const remainingCount = availableItems.length - itemsToShow.length

        // Format items with quantities
        const itemList = itemsToShow.map(({ item, quantity }) => `${item.name} (${quantity})`).join(", ")
        const extraText = remainingCount > 0 ? ` and ${remainingCount} more item${remainingCount > 1 ? "s" : ""}` : ""

        new Notification(
          `🌱 Stock Alert: ${availableItems.length} item${availableItems.length > 1 ? "s" : ""} available!`,
          {
            body: `${itemList}${extraText}`,
            icon: "/sugarapple.ico",
            tag: `wishlist-batch-${Date.now()}`,
          },
        )
      }

      if (notificationSettings.sound) {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
        )
        audio.play().catch(() => {
          // Ignore audio play errors
        })
      }
    },
    [notificationSettings, notificationPermission],
  )

  // Debounced notification handler
  const debouncedNotification = useCallback(
    (newItems: Array<{ item: WishlistItem; quantity: string }>) => {
      // Add new items to pending notifications
      pendingNotificationsRef.current = [
        ...pendingNotificationsRef.current,
        ...newItems.filter(
          (newItem) => !pendingNotificationsRef.current.some((pending) => pending.item.id === newItem.item.id),
        ),
      ]

      // Clear existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }

      // Set new timeout
      notificationTimeoutRef.current = setTimeout(
        () => {
          if (pendingNotificationsRef.current.length > 0) {
            showNotification(pendingNotificationsRef.current)
            pendingNotificationsRef.current = [] // Clear pending notifications
          }
        },
        isInitialLoadRef.current ? NOTIFICATION_DEBOUNCE_MS : 1000,
      ) // Use longer delay for initial load
    },
    [showNotification],
  )

  // Check for wishlist items in current stock
  const checkWishlistItems = useCallback(
    (currentStockData: ProcessedStockData, previousStockData?: ProcessedStockData | null) => {
      if (!currentStockData || !notificationSettings.enabled || wishlist.length === 0) return

      const availableItemsForNotification: Array<{ item: WishlistItem; quantity: string }> = []

      // Check each wishlist item
      wishlist.forEach((wishlistItem) => {
        const currentQuantity = getStockQuantity(currentStockData, wishlistItem.name, wishlistItem.category)
        const isCurrentlyInStock = currentQuantity !== null && currentQuantity !== "x0"

        // If item is in stock, add it to notifications
        if (isCurrentlyInStock) {
          availableItemsForNotification.push({
            item: wishlistItem,
            quantity: currentQuantity || "x0",
          })
        }
      })

      // Use debounced notification if we have items to notify about
      if (availableItemsForNotification.length > 0) {
        debouncedNotification(availableItemsForNotification)
      }
    },
    [wishlist, notificationSettings, notificationPermission, debouncedNotification],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  return {
    wishlist,
    notificationSettings,
    notificationPermission,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    checkWishlistItems,
    requestNotificationPermission,
    updateNotificationSettings: saveNotificationSettings,
  }
}
