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
  
  const timeApis = [
    {
      // Google's Time API alternative that respects timezone
      url: `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(userTimezone)}`,
      parser: (data: any) => new Date(data.dateTime)
    },
    {
      // Timezone-aware API
      url: `https://worldtimeapi.org/api/timezone/${encodeURIComponent(userTimezone)}`,
      parser: (data: any) => new Date(data.datetime)
    }
  ]

  // Try each API in sequence
  for (const api of timeApis) {
    try {
      const response = await fetch(api.url)
      if (!response.ok) continue
      const data = await response.json()
      return api.parser(data)
    } catch (error) {
      console.warn(`Failed to get time from ${api.url}:`, error)
      continue
    }
  }

  // If APIs fail, use local time but ensure it's timezone-aware
  console.warn("All time APIs failed, using local time with timezone adjustment")
  const localTime = new Date()
  return new Date(localTime.toLocaleString("en-US", { timeZone: userTimezone }))
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

export const useStockData = () => {
  const [data, setData] = useState<ProcessedStockData | null>(null)
  const [previousData, setPreviousData] = useState<ProcessedStockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      const processedData = processStockData(apiData)

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
