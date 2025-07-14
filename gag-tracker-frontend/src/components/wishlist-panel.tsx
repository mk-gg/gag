"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Heart, Settings, Bell, BellOff, Trash2, X } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { ManualWishlistManager } from "./manual-wishlist-manager"

interface WishlistPanelProps {
  isOpen: boolean
  onClose: () => void
  initialView?: "wishlist" | "settings"
}

export function WishlistPanel({ isOpen, onClose, initialView = "wishlist" }: WishlistPanelProps) {
  const [showSettings, setShowSettings] = useState(initialView === "settings")
  const [activeTab, setActiveTab] = useState<"list" | "add">("list")
  const {
    wishlist,
    notificationSettings,
    notificationPermission,
    removeFromWishlist,
    requestNotificationPermission,
    updateNotificationSettings,
  } = useWishlist()

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && notificationPermission !== "granted") {
      const granted = await requestNotificationPermission()
      if (!granted) return
    }

    updateNotificationSettings({
      ...notificationSettings,
      enabled,
    })
  }

  const handleClose = () => {
    setShowSettings(false)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setActiveTab("list")
      setShowSettings(initialView === "settings")
    }
  }, [isOpen, initialView])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h2 className="font-semibold">{showSettings ? "Notification Settings" : "My Wishlist"}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {!showSettings && (
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {showSettings ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Enable Notifications</p>
                            <p className="text-xs text-muted-foreground">
                              Get notified when wishlist items are in stock
                            </p>
                          </div>
                          <Switch checked={notificationSettings.enabled} onCheckedChange={handleNotificationToggle} />
                        </div>

                        {notificationSettings.enabled && (
                          <>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Desktop Notifications</p>
                                <p className="text-xs text-muted-foreground">Show browser notifications</p>
                              </div>
                              <Switch
                                checked={notificationSettings.desktop}
                                onCheckedChange={(desktop) =>
                                  updateNotificationSettings({ ...notificationSettings, desktop })
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Sound Alerts</p>
                                <p className="text-xs text-muted-foreground">Play sound when notified</p>
                              </div>
                              <Switch
                                checked={notificationSettings.sound}
                                onCheckedChange={(sound) =>
                                  updateNotificationSettings({ ...notificationSettings, sound })
                                }
                              />
                            </div>
                          </>
                        )}

                        {notificationPermission === "denied" && (
                          <div className="p-3 bg-destructive/10 rounded-lg">
                            <p className="text-xs text-destructive">
                              Browser notifications are blocked. Please enable them in your browser settings.
                            </p>
                          </div>
                        )}

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 <strong>Smart Notifications:</strong> Multiple items will be grouped into a single
                            notification to avoid spam.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Button variant="outline" onClick={() => setShowSettings(false)} className="w-full">
                      Back to Wishlist
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Tab Navigation */}
                    <div className="flex border-b">
                      <button
                        onClick={() => setActiveTab("list")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "list"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        My Wishlist ({wishlist.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("add")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === "add"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Add Items
                      </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "list" ? (
                      <div className="space-y-4">
                        {wishlist.length === 0 ? (
                          <div className="text-center py-12">
                            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-2">Your wishlist is empty</p>
                            <p className="text-xs text-muted-foreground">
                              Click the "Add Items" tab to search and add items to your wishlist
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground">
                                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} tracked
                              </p>
                              {notificationSettings.enabled ? (
                                <Badge variant="secondary" className="text-xs">
                                  <Bell className="h-3 w-3 mr-1" />
                                  Notifications On
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <BellOff className="h-3 w-3 mr-1" />
                                  Notifications Off
                                </Badge>
                              )}
                            </div>

                            <AnimatePresence>
                              {wishlist.map((item) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded ${item.color}`} />
                                        <div>
                                          <p className="text-sm font-medium">{item.name}</p>
                                          <p className="text-xs text-muted-foreground">{item.category}</p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    ) : (
                      <ManualWishlistManager onItemAdded={() => setActiveTab("list")} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Floating button component
export function FloatingWishlistButton({ onClick }: { onClick: () => void }) {
  const { wishlist } = useWishlist()

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
      >
        <Heart className="h-6 w-6" />
        {wishlist.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
            {wishlist.length}
          </Badge>
        )}
      </Button>
    </div>
  )
}
