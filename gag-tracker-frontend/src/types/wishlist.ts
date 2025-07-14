export interface WishlistItem {
  id: string
  name: string
  category: string
  color: string
  addedAt: string
  notified?: boolean
}

export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
}
