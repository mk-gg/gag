import type { StockItem, ProcessedStockData } from "@/types/api"

// Color mapping for different items
const getItemColor = (name: string, category: string): string => {
  const colorMap: Record<string, string> = {
    // Seeds
    "Blueberry": "bg-blue-500",
    "Carrot": "bg-orange-500",
    "Green Apple": "bg-green-500",
    "Strawberry": "bg-red-500",
    "Tomato": "bg-red-600",

    // Gears
    "Cleaning Spray": "bg-blue-500",
    "Favorite Tool": "bg-pink-500",
    "Harvest Tool": "bg-orange-500",
    "Magnifying Glass": "bg-purple-500",
    "Recall Wrench": "bg-gray-500",
    "Trowel": "bg-amber-500",
    "Watering Can": "bg-blue-600",

    // Eggs
    "Common Egg": "bg-gray-400",
    "Common Summer Egg": "bg-yellow-500",
    "Rare Summer Egg": "bg-blue-500",

    // Event Shop
    "Delphinium": "bg-blue-500",
    "Oasis Crate": "bg-yellow-500",
    "Summer Seed Pack": "bg-green-500",

    // Cosmetics
    "Beach Crate": "bg-blue-400",
    "Sign Crate": "bg-orange-400",
    "Green Tractor": "bg-green-500",
    "Torch": "bg-orange-500",
    "Yellow Umbrella": "bg-yellow-500",
    "Brick Stack": "bg-red-500",
    "Small Wood Flooring": "bg-amber-400",
    "Mini TV": "bg-gray-600",
    "Shovel": "bg-gray-500",
  }

  return colorMap[name] || "bg-gray-400"
}

const isCosmeticCrate = (name: string): boolean => {
  return name.toLowerCase().includes("crate")
}

export const processStockData = (apiData: StockItem[]): ProcessedStockData => {
  const processed: ProcessedStockData = {
    seeds: [],
    gears: [],
    eggs: [],
    eventShop: [],
    cosmeticCrates: [],
    cosmeticItems: [],
  }

  apiData.forEach((item) => {
    const processedItem = {
      name: item.name,
      count: `x${item.quantity}`,
      color: getItemColor(item.name, item.category),
    }

    switch (item.category) {
      case "Seeds":
        processed.seeds.push(processedItem)
        break
      case "Gears":
        processed.gears.push(processedItem)
        break
      case "Eggs":
        processed.eggs.push(processedItem)
        break
      case "Event Shop Stock":
        processed.eventShop.push(processedItem)
        break
      case "Cosmetics":
        if (isCosmeticCrate(item.name)) {
          processed.cosmeticCrates.push(processedItem)
        } else {
          processed.cosmeticItems.push(processedItem)
        }
        break
    }
  })

  return processed
}
