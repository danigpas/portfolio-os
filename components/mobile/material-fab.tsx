"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Share, Download, X } from "lucide-react"

interface MaterialFABProps {
  onAction?: (action: string) => void
}

export default function MaterialFAB({ onAction }: MaterialFABProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const fabActions = [
    { id: "edit", icon: Edit, label: "Edit Profile" },
    { id: "share", icon: Share, label: "Share Portfolio" },
    { id: "download", icon: Download, label: "Download CV" },
  ]

  const handleAction = (actionId: string) => {
    onAction?.(actionId)
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-20 right-6 z-40">
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {fabActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 animate-in slide-in-from-bottom duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-card text-card-foreground px-3 py-1 rounded-full text-sm shadow-lg border">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  onClick={() => handleAction(action.id)}
                  className="w-12 h-12 rounded-full shadow-lg bg-secondary hover:bg-secondary/90 hover:scale-110 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 elevation-6"
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <Plus className="w-6 h-6 transition-transform duration-200" />
        )}
      </Button>
    </div>
  )
}
