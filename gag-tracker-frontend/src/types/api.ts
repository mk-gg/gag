export interface StockItem {
  id: number
  name: string
  quantity: number
  category: string
  lastUpdated: string
}

export interface ProcessedStockData {
  seeds: Array<{ name: string; count: string; color: string }>
  gears: Array<{ name: string; count: string; color: string }>
  eggs: Array<{ name: string; count: string; color: string }>
  eventShop: Array<{ name: string; count: string; color: string }>
  cosmeticCrates: Array<{ name: string; count: string; color: string }>
  cosmeticItems: Array<{ name: string; count: string; color: string }>
}
