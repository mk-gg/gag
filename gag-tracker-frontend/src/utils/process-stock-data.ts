import type { StockItem, ProcessedStockData } from "@/types/api"

// Color mapping for different items
const getItemColor = (name: string, category: string): string => {
  const colorMap: Record<string, string> = {
    // Seeds
    "Carrot": "bg-orange-500",
    "Strawberry": "bg-red-500",
    "Blueberry": "bg-blue-500",
    "Orange Tulip": "bg-yellow-500",
    "Tomato": "bg-red-600",
    "Corn": "bg-yellow-500",
    "Daffodil": "bg-yellow-500",
    "Watermelon": "bg-green-600",
    "Pumpkin": "bg-orange-600",
    "Apple": "bg-red-500",
    "Bamboo": "bg-green-600",
    "Coconut": "bg-amber-500",
    "Cactus": "bg-green-600",
    "Dragon Fruit": "bg-purple-600",
    "Mango": "bg-amber-500",
    "Grape": "bg-violet-600",
    "Mushroom": "bg-red-600",
    "Pepper": "bg-red-600",
    "Cacao": "bg-amber-500",
    "Beanstalk": "bg-gradient-to-r from-green-500 to-purple-500",
    "Ember Lily": "bg-gradient-to-r from-orange-500 to-green-600",
    "Sugar Apple": "bg-gradient-to-r from-green-100 to-green-600",


    // Gears
    "Watering Can": "bg-blue-600",
    "Trowel": "bg-amber-500",
    "Recall Wrench": "bg-gray-500",
    "Basic Sprinkler": "bg-blue-500",
    "Advance Sprinkler": "bg-yellow-500",
    "Medium Toy": "bg-blue-500",
    "Medium Treat": "bg-amber-500",
    "Godly Sprinkler": "bg-green-600",
    "Magnifying Glass": "bg-cyan-600",
    "Tanning Mirror": "bg-blue-500",
    "Master Sprinkler": "bg-green-600",
    "Cleaning Spray": "bg-blue-500",
    "Favorite Tool": "bg-pink-500",
    "Harvest Tool": "bg-yellow-500",
    "Friendship Pot": "bg-rose-600",
    "Levelup Lollipop": "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",


    // Eggs
    "Common Egg": "bg-gray-400",
    "Common Summer Egg": "bg-yellow-500",
    "Rare Egg": "bg-blue-500",
    "Rare Summer Egg": "bg-blue-500",
    "Mythical Egg": "bg-amber-500",
    "Paradise Egg": "bg-yellow-400",
    "Bug Egg": "bg-green-600",


    // Event Shop
    "Delphinium": "bg-blue-500",
    "Oasis Crate": "bg-yellow-500",
    "Summer Seed Pack": "bg-green-500",

    // Cosmetics
    "Beach Crate": "bg-yellow-500",
    "Sign Crate": "bg-blue-500",
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
