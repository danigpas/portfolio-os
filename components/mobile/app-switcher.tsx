"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface AppSwitcherProps {
  isOpen: boolean
  onClose: () => void
  onAppSelect: (appId: string) => void
  currentApp?: string
}

const recentApps = [
  {
    id: "launcher",
    name: "Portfolio OS",
    preview: "/android-launcher-homescreen.png",
    color: "bg-gradient-to-br from-primary to-secondary",
  },
  {
    id: "api-client",
    name: "API Client",
    preview: "/api-client-interface.png",
    color: "bg-gradient-to-br from-chart-5 to-accent",
  },
  {
    id: "terminal",
    name: "Terminal",
    preview: "/terminal-cli.png",
    color: "bg-gradient-to-br from-destructive to-red-600",
  },
]

export default function AppSwitcher({ isOpen, onClose, onAppSelect, currentApp }: AppSwitcherProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Apps</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Recent Apps */}
        <div className="flex-1 space-y-4 overflow-auto">
          {recentApps.map((app) => (
            <Card
              key={app.id}
              className={`relative overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                currentApp === app.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => {
                onAppSelect(app.id)
                onClose()
              }}
            >
              <div className={`h-48 ${app.color} flex items-center justify-center relative`}>
                <img
                  src={app.preview || "/placeholder.svg"}
                  alt={`${app.name} preview`}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{app.name}</span>
                </div>
              </div>
              <div className="p-3 bg-card">
                <h3 className="font-medium text-foreground">{app.name}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Clear All Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              console.log("[v0] Clearing all recent apps")
              onClose()
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}
