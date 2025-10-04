"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wifi, Battery, Signal, Bluetooth, Bell } from "lucide-react"

interface AndroidStatusBarProps {
  onNotificationToggle?: () => void
  isDarkMode?: boolean
  onThemeToggle?: () => void
}

export default function AndroidStatusBar({
  onNotificationToggle,
  isDarkMode = false,
  onThemeToggle,
}: AndroidStatusBarProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [batteryLevel, setBatteryLevel] = useState(85)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      )
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 flex justify-between items-center text-sm relative z-50">
      {/* Left side - Time and Date */}
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{currentTime}</span>
        <span className="text-xs text-muted-foreground">{currentDate}</span>
      </div>

      {/* Right side - System Icons */}
      <div className="flex items-center gap-1">
        {/* Network Signal */}
        <Signal className="w-4 h-4 text-foreground" />

        {/* WiFi */}
        <Wifi className="w-4 h-4 text-foreground" />

        {/* Bluetooth */}
        <Bluetooth className="w-3 h-3 text-muted-foreground" />

        {/* Battery */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <Battery className="w-4 h-4 text-foreground" />
            <div
              className="absolute top-1 left-0.5 bg-foreground rounded-sm transition-all"
              style={{
                width: `${(batteryLevel / 100) * 10}px`,
                height: "8px",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{batteryLevel}%</span>
        </div>

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="w-6 h-6 p-0" onClick={onNotificationToggle}>
          <Bell className="w-3 h-3 text-foreground" />
        </Button>
      </div>
    </div>
  )
}
