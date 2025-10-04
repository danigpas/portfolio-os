"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Settings,
  Wifi,
  Bluetooth,
  PlaneIcon as Airplane,
  RotateCcw,
  Flashlight,
  Volume2,
  Sun,
  Moon,
  Bell,
  MessageSquare,
  Download,
} from "lucide-react"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  onThemeToggle?: () => void
}

const notifications = [
  {
    id: 1,
    app: "Portfolio API",
    title: "New visitor from San Francisco",
    message: "Someone viewed your projects section",
    time: "2 min ago",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    id: 2,
    app: "Terminal",
    title: "Command executed successfully",
    message: "help command completed",
    time: "5 min ago",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: 3,
    app: "System",
    title: "Portfolio updated",
    message: "New project added to showcase",
    time: "1 hour ago",
    icon: <Download className="w-5 h-5" />,
  },
]

const quickSettings = [
  { id: "wifi", icon: Wifi, label: "WiFi", active: true },
  { id: "bluetooth", icon: Bluetooth, label: "Bluetooth", active: false },
  { id: "airplane", icon: Airplane, label: "Airplane", active: false },
  { id: "rotation", icon: RotateCcw, label: "Rotation", active: true },
  { id: "flashlight", icon: Flashlight, label: "Flashlight", active: false },
  { id: "volume", icon: Volume2, label: "Sound", active: true },
]

export default function NotificationPanel({
  isOpen,
  onClose,
  isDarkMode = false,
  onThemeToggle,
}: NotificationPanelProps) {
  const [quickSettingsExpanded, setQuickSettingsExpanded] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm">
      <div className="bg-background border-b border-border shadow-lg animate-in slide-in-from-top duration-300">
        {/* Quick Settings */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Quick Settings</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onThemeToggle} className="w-8 h-8">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Settings Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickSettings.slice(0, quickSettingsExpanded ? quickSettings.length : 6).map((setting) => {
              const Icon = setting.icon
              return (
                <Button
                  key={setting.id}
                  variant={setting.active ? "default" : "outline"}
                  className="h-16 flex flex-col gap-1"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{setting.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            className="w-full gap-2 bg-transparent"
            onClick={() => console.log("[v0] Opening settings")}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="p-4 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button variant="ghost" size="sm">
              Clear all
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-3">
                <div className="flex gap-3">
                  <div className="text-primary mt-1">{notification.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {notification.app}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <h4 className="font-medium text-sm text-foreground mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
