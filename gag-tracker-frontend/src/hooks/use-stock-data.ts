"use client"

import { useState, useEffect, useRef } from "react"
import type { StockItem, ProcessedStockData } from "@/types/api"
import { processStockData } from "@/utils/process-stock-data"

// Get user's timezone
const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.warn("Failed to get timezone, using UTC:", error)
    return "UTC"
  }
}

// Get accurate time based on user's location
const getAccurateTime = async (): Promise<Date> => {
  const userTimezone = getUserTimezone()
  
  // Since external time APIs are having CORS issues, we'll use a more robust local time approach
  const localTime = new Date()
  
  try {
    // Create a formatter for the user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // Format the time and parse it back to ensure timezone correctness
    const formattedTime = formatter.format(localTime)
    return new Date(formattedTime)
  } catch (error) {
    console.warn("Error formatting time with timezone, using direct local time:", error)
    return localTime
  }
}

// Calculate next check time (every 5 minutes + 10 seconds)
const getNextCheckTime = (currentTime: Date): Date => {
  // Get the current time components in the user's timezone
  const userTimezone = getUserTimezone()
  const timeInUserTz = new Date(currentTime.toLocaleString("en-US", { timeZone: userTimezone }))
  
  const minutes = timeInUserTz.getMinutes()
  const nextIntervalMinutes = Math.ceil(minutes / 5) * 5
  
  const nextTime = new Date(timeInUserTz)
  nextTime.setMinutes(nextIntervalMinutes)
  nextTime.setSeconds(10)
  nextTime.setMilliseconds(0)

  // If we're already past the calculated time, add 5 minutes
  if (nextTime <= timeInUserTz) {
    nextTime.setMinutes(nextTime.getMinutes() + 5)
  }

  return nextTime
}

// Notification state interface
interface NotificationState {
  lastNotified: Record<string, {
    quantity: string
    timestamp: number
  }>
  cooldown: number
}

interface ProcessedStockItem {
  name: string
  count: string
  color?: string
}

type CategoryData = ProcessedStockData

export const useStockData = () => {
  const [data, setData] = useState<ProcessedStockData | null>(null)
  const [previousData, setPreviousData] = useState<ProcessedStockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Add notification state ref to persist across renders
  const notificationStateRef = useRef<NotificationState>({
    lastNotified: {},
    cooldown: 5 * 60 * 1000 // 5 minutes cooldown
  })

  // Check if we should notify about an item
  const shouldNotifyForItem = (itemName: string, quantity: string): boolean => {
    const now = Date.now()
    const lastNotification = notificationStateRef.current.lastNotified[itemName]
    
    // If never notified before or quantity changed
    if (!lastNotification || lastNotification.quantity !== quantity) {
      // If cooldown period has passed or quantity increased
      if (!lastNotification || 
          now - lastNotification.timestamp > notificationStateRef.current.cooldown ||
          parseInt(quantity) > parseInt(lastNotification.quantity)) {
        
        // Update notification state
        notificationStateRef.current.lastNotified[itemName] = {
          quantity,
          timestamp: now
        }
        return true
      }
    }
    return false
  }

  // Compare current and previous data for changes
  const checkForChanges = (currentData: ProcessedStockData, previousData: ProcessedStockData | null) => {
    if (!previousData) return // Skip if no previous data
    
    const changedItems: Array<{ name: string; quantity: string }> = []

    // Helper to check items in a category
    const compareItems = (category: keyof ProcessedStockData) => {
      const currentItems = currentData[category] || []
      const prevItems = previousData[category] || []
      
      currentItems.forEach((currentItem) => {
        const prevItem = prevItems.find((p) => p.name === currentItem.name)
        
        // Check if item should trigger notification
        if (shouldNotifyForItem(currentItem.name, currentItem.count)) {
          changedItems.push({
            name: currentItem.name,
            quantity: currentItem.count
          })
        }
      })
    }

    // Check all categories
    (Object.keys(currentData) as Array<keyof ProcessedStockData>).forEach(category => {
      compareItems(category)
    })

    // If we have changes, show a single grouped notification
    if (changedItems.length > 0) {
      const message = changedItems
        .map(item => `${item.name}: ${item.quantity}`)
        .join('\n')
      
      // Show notification using the browser's notification API
      if (Notification.permission === "granted") {
        new Notification("Stock Update", {
          body: message,
          icon: "/rosydelight.ico", // Make sure you have a favicon
          tag: "stock-update" // This replaces previous notifications
        })
      }
    }
  }

  const fetchData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_STOCK_API_URL

    if (!apiUrl) {
      // Use mock data if no API URL provided
      const mockData = {
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

      // Store previous data before updating
      setPreviousData(data)
      setData(mockData)
      setLastUpdated(new Date())
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(apiUrl, {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiData: StockItem[] = await response.json()
      const processedData = processStockData(apiData) as ProcessedStockData

      // Check for changes before updating state
      if (data) {
        checkForChanges(processedData, data)
      }

      // Store previous data before updating
      setPreviousData(data)
      setData(processedData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Failed to fetch stock data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const setupSyncedPolling = async () => {
    try {
      // Get accurate time based on user's location
      const accurateTime = await getAccurateTime()
      
      // Calculate next check time
      const nextCheckTime = getNextCheckTime(accurateTime)
      setNextUpdate(nextCheckTime)

      // Calculate milliseconds until next check
      const msUntilNextCheck = nextCheckTime.getTime() - accurateTime.getTime()

      // Clear existing timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)

      // Set initial timeout to sync with accurate time
      timeoutRef.current = setTimeout(async () => {
        await fetchData()

        // Start regular interval polling
        intervalRef.current = setInterval(async () => {
          const currentTime = await getAccurateTime() // Get fresh accurate time for each interval
          const nextCheck = getNextCheckTime(currentTime)
          setNextUpdate(nextCheck)
          await fetchData()
        }, 5 * 60 * 1000) // 5 minutes in milliseconds
      }, msUntilNextCheck)
    } catch (error) {
      console.error("Failed to setup synced polling:", error)
      // Fallback to regular 5-minute interval if sync fails
      intervalRef.current = setInterval(fetchData, 5 * 60 * 1000)
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Setup synced polling
    setupSyncedPolling()

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return {
    data,
    previousData,
    loading,
    error,
    lastUpdated,
    nextUpdate,
    refetch: fetchData,
  }
}
