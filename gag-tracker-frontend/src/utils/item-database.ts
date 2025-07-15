import type { GameItem, ItemDatabase } from "@/types/item-database"

// Default item database - can be updated by users
export const defaultItemDatabase: ItemDatabase = {
  seeds: [
    { id: "carrot", name: "Carrot", category: "Seeds", color: "bg-orange-500", rarity: "common" },
    { id: "strawberry", name: "Strawberry", category: "Seeds", color: "bg-red-500", rarity: "common" },
    { id: "blueberry", name: "Blueberry", category: "Seeds", color: "bg-blue-500", rarity: "uncommon" },
    // { id: "green-apple", name: "Green Apple", category: "Seeds", color: "bg-green-500", rarity: "uncommon" },
    { id: "orange-tulip", name: "Orange Tulip", category: "Seeds", color: "bg-yellow-500", rarity: "uncommon"},
    { id: "tomato", name: "Tomato", category: "Seeds", color: "bg-red-600", rarity: "rare" },
    { id: "corn", name: "Corn", category: "Seeds", color: "bg-yellow-500", rarity: "rare" },
    { id: "daffodil", name: "Daffodil", category: "Seeds", color: "bg-yellow-500", rarity: "rare"},
    { id: "watermelon", name: "Watermelon", category: "Seeds", color: "bg-green-600", rarity: "legendary" },
    { id: "pumpkin", name: "Pumpkin", category: "Seeds", color: "bg-orange-600", rarity: "legendary" },
    { id: "apple", name: "Apple", category: "Seeds", color: "bg-red-500", rarity: "legendary" },
    { id: "bamboo", name: "Bamboo", category: "Seeds", color: "bg-green-600", rarity: "legendary" },
    { id: "coconut", name: "Coconut", category: "Seeds", color: "bg-amber-500", rarity: "mythical" },
    { id: "cactus", name: "Cactus", category: "Seeds", color: "bg-green-600", rarity: "mythical" },
    { id: "dragon-fruit", name: "Dragon Fruit", category: "Seeds", color: "bg-purple-600", rarity: "mythical" },
    { id: "mango", name: "Mango", category: "Seeds", color: "bg-amber-500", rarity: "mythical" },
    // { id: "celestial-bloom", name: "Celestial Bloom", category: "Seeds", color: "bg-indigo-600", rarity: "mythical" },
    { id: "grape", name: "Grape", category: "Seeds", color: "bg-violet-600", rarity: "divine" },
    { id: "mushroom", name: "Mushroom", category: "Seeds", color: "bg-red-600", rarity: "divine" },
    { id: "pepper", name: "Pepper", category: "Seeds", color: "bg-red-600", rarity: "divine" },
    { id: "cacao", name: "Cacao", category: "Seeds", color: "bg-amber-500", rarity: "divine" },
    // { id: "starlight-seed", name: "Starlight Seed", category: "Seeds", color: "bg-violet-600", rarity: "divine" },
    {
      id: "beanstalk",
      name: "Beanstalk",
      category: "Seeds",
      color: "bg-gradient-to-r from-green-500 to-purple-500",
      rarity: "prismatic",
    },
    {
      id: "ember-lily",
      name: "Ember Lily",
      category: "Seeds",
      color: "bg-gradient-to-r from-orange-500 to-green-600",
      rarity: "prismatic",
    },
    {
      id: "sugar-apple",
      name: "Sugar Apple",
      category: "Seeds",
      color: "bg-gradient-to-r from-green-100 to-green-600",
      rarity: "prismatic",
    },
    {
      id: "burning-bud",
      name: "Burning Bud",
      category: "Seeds",
      color: "bg-gradient-to-r from-yellow-500 to-red-600",
      rarity: "prismatic",
    },
    {
      id: "giant-pinecone",
      name: "Giant Pinecone",
      category: "Seeds",
      color: "bg-gradient-to-r from-orange-950 to-stone-900",
      rarity: "prismatic",
    },
    // {
    //   id: "eternal-genesis-seed",
    //   name: "Eternal Genesis Seed",
    //   category: "Seeds",
    //   color: "bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500",
    //   rarity: "transcendent",
    // },
  ],
  gears: [
    { id: "watering-can", name: "Watering Can", category: "Gears", color: "bg-blue-600", rarity: "common" },
    { id: "trowel", name: "Trowel", category: "Gears", color: "bg-amber-500", rarity: "uncommon" },
    { id: "recall-wrench", name: "Recall Wrench", category: "Gears", color: "bg-gray-500", rarity: "uncommon" },
    { id: "basic-sprinkler", name: "Basic Sprinkler", category: "Gears", color: "bg-blue-500", rarity: "rare"},
    { id: "advance-sprinkler", name: "Advance Sprinkler", category: "Gears", color: "bg-yellow-500", rarity: "legendary"},
    { id: "medium-toy", name: "Medium Toy", category: "Gears", color: "bg-blue-500", rarity: "legendary"},
    { id: "medium-treat", name: "Medium Treat", category: "Gears", color: "bg-amber-500", rarity: "common" },
    { id: "godly-sprinkler", name: "Godly Sprinkler", category: "Gears", color: "bg-green-600", rarity: "mythical"},
    { id: "magnifying-glass", name: "Magnifying Glass", category: "Gears", color: "bg-cyan-600", rarity: "mythical" },
    { id: "tanning-mirror", name: "Tanning Mirror", category: "Gears", color: "bg-blue-500", rarity: "mythical"},
    { id: "master-sprinkler", name: "Master Sprinkler", category: "Gears", color: "bg-green-600", rarity: "divine"},
    { id: "cleaning-spray", name: "Cleaning Spray", category: "Gears", color: "bg-blue-500", rarity: "divine"},
    { id: "favorite-tool", name: "Favorite Tool", category: "Gears", color: "bg-pink-500", rarity: "divine" },
    { id: "harvest-tool", name: "Harvest Tool", category: "Gears", color: "bg-yellow-500", rarity: "divine" },
    { id: "friendship-pot", name: "Friendship Pot", category: "Gears", color: "bg-rose-600", rarity: "divine" },
    {
      id: "levelup-lollipop",
      name: "Levelup Lollipop",
      category: "Gears",
      color: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
      rarity: "prismatic",
    },
    // {
    //   id: "master-cultivator",
    //   name: "Master Cultivator",
    //   category: "Gears",
    //   color: "bg-gold-500",
    //   rarity: "legendary",
    // },
    // { id: "time-bender-tool", name: "Time Bender Tool", category: "Gears", color: "bg-cyan-600", rarity: "mythical" },
    // {
    //   id: "prism-multitool",
    //   name: "Prism Multitool",
    //   category: "Gears",
    //   color: "bg-gradient-to-r from-green-400 to-blue-500",
    //   rarity: "prismatic",
    // },

  ],
  eggs: [
    { id: "common-egg", name: "Common Egg", category: "Eggs", color: "bg-gray-400", rarity: "common" },
    { id: "common-summer-egg", name: "Common Summer Egg", category: "Eggs", color: "bg-yellow-500", rarity: "common" },
    { id: "rare-egg", name: "Rare Egg", category: "Eggs", color: "bg-blue-500", rarity: "rare" },
    { id: "rare-summer-egg", name: "Rare Summer Egg", category: "Eggs", color: "bg-blue-500", rarity: "rare" },
    { id: "mythical-egg", name: "Mythical Egg", category: "Eggs", color: "bg-amber-500", rarity: "mythical" },
    { id: "paradise-egg", name: "Paradise Egg", category: "Eggs", color: "bg-yellow-400", rarity: "mythical" },
    { id: "bug-egg", name: "Bug Egg", category: "Eggs", color: "bg-green-600", rarity: "divine" },
    // {
    //   id: "spectrum-egg",
    //   name: "Spectrum Egg",
    //   category: "Eggs",
    //   color: "bg-gradient-to-r from-purple-400 to-pink-400",
    //   rarity: "prismatic",
    // },
    // {
    //   id: "genesis-egg",
    //   name: "Genesis Egg",
    //   category: "Eggs",
    //   color: "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500",
    //   rarity: "transcendent",
    // },
  ],
  eventShop: [
    { id: "delphinium", name: "Delphinium", category: "Event Shop Stock", color: "bg-blue-500", rarity: "uncommon" },
    {
      id: "summer-seed-pack",
      name: "Summer Seed Pack",
      category: "Event Shop Stock",
      color: "bg-green-500",
      rarity: "uncommon",
    },
    { id: "oasis-crate", name: "Oasis Crate", category: "Event Shop Stock", color: "bg-yellow-500", rarity: "rare" },
    {
      id: "festival-bundle",
      name: "Festival Bundle",
      category: "Event Shop Stock",
      color: "bg-purple-500",
      rarity: "legendary",
    },
    {
      id: "seasonal-mystery-box",
      name: "Seasonal Mystery Box",
      category: "Event Shop Stock",
      color: "bg-teal-600",
      rarity: "mythical",
    },
    {
      id: "divine-event-token",
      name: "Divine Event Token",
      category: "Event Shop Stock",
      color: "bg-amber-600",
      rarity: "divine",
    },
  ],
  cosmetics: [
    { id: "torch", name: "Torch", category: "Cosmetics", color: "bg-orange-500", rarity: "common" },
    { id: "yellow-umbrella", name: "Yellow Umbrella", category: "Cosmetics", color: "bg-yellow-500", rarity: "common" },
    { id: "brick-stack", name: "Brick Stack", category: "Cosmetics", color: "bg-red-500", rarity: "common" },
    {
      id: "small-wood-flooring",
      name: "Small Wood Flooring",
      category: "Cosmetics",
      color: "bg-amber-400",
      rarity: "common",
    },
    { id: "rock-pile", name: "Rock Pile", category: "Cosmetics", color: "bg-gray-500", rarity: "common" },
    { id: "log", name: "Log", category: "Cosmetics", color: "bg-amber-600", rarity: "common" },
    { id: "shovel", name: "Shovel", category: "Cosmetics", color: "bg-gray-500", rarity: "common" },
    { id: "beach-crate", name: "Beach Crate", category: "Cosmetics", color: "bg-blue-400", rarity: "uncommon" },
    { id: "sign-crate", name: "Sign Crate", category: "Cosmetics", color: "bg-orange-400", rarity: "uncommon" },
    {
      id: "large-wood-flooring",
      name: "Large Wood Flooring",
      category: "Cosmetics",
      color: "bg-amber-500",
      rarity: "uncommon",
    },
    { id: "shovel-grove", name: "Shovel Grove", category: "Cosmetics", color: "bg-green-500", rarity: "uncommon" },
    { id: "green-tractor", name: "Green Tractor", category: "Cosmetics", color: "bg-green-500", rarity: "rare" },
    { id: "mini-tv", name: "Mini TV", category: "Cosmetics", color: "bg-gray-600", rarity: "rare" },
    { id: "cabana", name: "Cabana", category: "Cosmetics", color: "bg-blue-400", rarity: "legendary" },
    {
      id: "crystal-fountain",
      name: "Crystal Fountain",
      category: "Cosmetics",
      color: "bg-cyan-500",
      rarity: "mythical",
    },
    {
      id: "celestial-gazebo",
      name: "Celestial Gazebo",
      category: "Cosmetics",
      color: "bg-purple-700",
      rarity: "divine",
    },
    {
      id: "rainbow-bridge",
      name: "Rainbow Bridge",
      category: "Cosmetics",
      color: "bg-gradient-to-r from-red-400 via-yellow-400 to-green-400",
      rarity: "prismatic",
    },
    {
      id: "infinity-garden",
      name: "Infinity Garden",
      category: "Cosmetics",
      color: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
      rarity: "transcendent",
    },
  ],
}

const ITEM_DATABASE_KEY = "garden-tracker-item-database"

export const getItemDatabase = (): ItemDatabase => {
  if (typeof window === "undefined") return defaultItemDatabase

  try {
    const saved = localStorage.getItem(ITEM_DATABASE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("Failed to load item database:", error)
  }
  return defaultItemDatabase
}

export const saveItemDatabase = (database: ItemDatabase): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(ITEM_DATABASE_KEY, JSON.stringify(database))
  } catch (error) {
    console.error("Failed to save item database:", error)
  }
}

export const getAllItems = (): GameItem[] => {
  const database = getItemDatabase()
  return [...database.seeds, ...database.gears, ...database.eggs, ...database.eventShop, ...database.cosmetics]
}

export const searchItems = (query: string, category?: string): GameItem[] => {
  const allItems = getAllItems()
  const filtered = category ? allItems.filter((item) => item.category === category) : allItems

  if (!query.trim()) return filtered

  const searchTerm = query.toLowerCase()
  return filtered.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))),
  )
}

export const addCustomItem = (item: Omit<GameItem, "id">): GameItem => {
  const database = getItemDatabase()
  const newItem: GameItem = {
    ...item,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }

  const categoryKey = item.category.toLowerCase().replace(/\s+/g, "") as keyof ItemDatabase
  if (database[categoryKey]) {
    database[categoryKey].push(newItem)
  } else {
    // If category doesn't exist, add to cosmetics as fallback
    database.cosmetics.push(newItem)
  }

  saveItemDatabase(database)
  return newItem
}

export const removeCustomItem = (itemId: string): void => {
  const database = getItemDatabase()

  // Remove from all categories
  Object.keys(database).forEach((categoryKey) => {
    const category = database[categoryKey as keyof ItemDatabase]
    const index = category.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      category.splice(index, 1)
    }
  })

  saveItemDatabase(database)
}
