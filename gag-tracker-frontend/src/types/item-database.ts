export interface GameItem {
  id: string
  name: string
  category: string
  color: string
  description?: string
  rarity?: "common" | "uncommon" | "rare" | "legendary" | "mythical" | "divine" | "prismatic" | "transcendent"
  tags?: string[]
}

export interface ItemDatabase {
  seeds: GameItem[]
  gears: GameItem[]
  eggs: GameItem[]
  eventShop: GameItem[]
  cosmetics: GameItem[]
}
