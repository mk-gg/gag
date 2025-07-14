"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Trash2 } from "lucide-react"
import { searchItems, addCustomItem, removeCustomItem} from "@/utils/item-database"
import type { GameItem } from "@/types/item-database"
import { useWishlist } from "@/hooks/use-wishlist"

interface ManualWishlistManagerProps {
  onItemAdded?: () => void
}

const rarityColors = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  legendary: "bg-yellow-500",
  mythical: "bg-purple-500",
  divine: "bg-pink-500",
  prismatic: "bg-gradient-to-r from-red-400 to-purple-400",
  transcendent: "bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500",
}

export function ManualWishlistManager({ onItemAdded }: ManualWishlistManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "Seeds",
    color: "bg-gray-500",
    rarity: "common" as const,
  })

  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useWishlist()

  const searchResults = useMemo(() => {
    const category = selectedCategory === "all" ? undefined : selectedCategory
    return searchItems(searchQuery, category)
  }, [searchQuery, selectedCategory])

  const categories = ["all", "Seeds", "Gears", "Eggs", "Event Shop Stock", "Cosmetics"]

  const handleAddToWishlist = (item: GameItem) => {
    addToWishlist(item.name, item.category, item.color, false)
    onItemAdded?.()
  }

  const handleRemoveFromWishlist = (item: GameItem) => {
    const wishlistItem = wishlist.find((w) => w.name === item.name && w.category === item.category)
    if (wishlistItem) {
      removeFromWishlist(wishlistItem.id)
      onItemAdded?.()
    }
  }

  const handleRemoveCustomItem = (item: GameItem) => {
    // First remove from wishlist if it exists
    handleRemoveFromWishlist(item)
    // Then remove from database
    removeCustomItem(item.id)
    // Trigger refresh
    onItemAdded?.()
  }

  const handleAddCustomItem = () => {
    if (!newItemForm.name.trim()) return

    const customItem = addCustomItem({
      name: newItemForm.name,
      category: newItemForm.category,
      color: newItemForm.color,
      rarity: newItemForm.rarity,
    })

    // Add to wishlist immediately
    addToWishlist(customItem.name, customItem.category, customItem.color, false)

    // Reset form
    setNewItemForm({
      name: "",
      category: "Seeds",
      color: "bg-gray-500",
      rarity: "common",
    })

    setShowAddDialog(false)
    onItemAdded?.()
  }

  const isCustomItem = (item: GameItem) => item.id.startsWith("custom-")

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="default" className="shrink-0 bg-transparent">
                <Plus className="h-4 w-4 mr-1" />
                Add Custom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                    placeholder="Enter item name..."
                  />
                </div>

                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <Select
                    value={newItemForm.category}
                    onValueChange={(value) => setNewItemForm({ ...newItemForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Seeds">Seeds</SelectItem>
                      <SelectItem value="Gears">Gears</SelectItem>
                      <SelectItem value="Eggs">Eggs</SelectItem>
                      <SelectItem value="Event Shop Stock">Event Shop Stock</SelectItem>
                      <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="item-color">Color</Label>
                  <Select
                    value={newItemForm.color}
                    onValueChange={(value) => setNewItemForm({ ...newItemForm, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                      <SelectItem value="bg-gray-500">Gray</SelectItem>
                      <SelectItem value="bg-amber-500">Amber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="item-rarity">Rarity</Label>
                  <Select
                    value={newItemForm.rarity}
                    onValueChange={(value: any) => setNewItemForm({ ...newItemForm, rarity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                      <SelectItem value="mythical">Mythical</SelectItem>
                      <SelectItem value="divine">Divine</SelectItem>
                      <SelectItem value="prismatic">Prismatic</SelectItem>
                      <SelectItem value="transcendent">Transcendent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddCustomItem} className="flex-1">
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {searchResults.map((item) => {
            const inWishlist = isInWishlist(item.name, item.category)
            const isCustom = isCustomItem(item)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`p-3 ${inWishlist ? "bg-muted/50 border-primary/20" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.name}</p>
                          {isCustom && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                              Custom
                            </span>
                          )}
                          {item.rarity && item.rarity !== "common" && (
                            <div className={`px-1.5 py-0.5 rounded text-xs text-white ${rarityColors[item.rarity]}`}>
                              <span className="capitalize">{item.rarity}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {inWishlist ? (
                        <Button variant="secondary" size="sm" onClick={() => handleRemoveFromWishlist(item)}>
                          Remove
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleAddToWishlist(item)}>
                          Add
                        </Button>
                      )}
                      {isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCustomItem(item)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {searchResults.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items found for "{searchQuery}"</p>
            <p className="text-xs">Try a different search term or add a custom item</p>
          </div>
        )}
      </div>
    </div>
  )
}
