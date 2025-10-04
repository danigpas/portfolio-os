"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  User,
  Code,
  Terminal,
  Mail,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Award,
  BarChart3,
  Clock,
  Smartphone,
} from "lucide-react"
import ApiClientApp from "@/components/api-client-app"
import TerminalApp from "@/components/terminal-app"
import AndroidStatusBar from "@/components/android-status-bar"
import NotificationPanel from "@/components/notification-panel"
import AppSwitcher from "@/components/app-switcher"
import AndroidToast from "@/components/android-toast"
import MaterialFAB from "@/components/material-fab"
import MaterialBottomSheet from "@/components/material-bottom-sheet"
import MaterialDialog from "@/components/material-dialog"

// App Icon Component
interface AppIconProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

function AppIcon({ icon, label, onClick, color = "bg-primary" }: AppIconProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={onClick}
        className={`w-16 h-16 rounded-2xl ${color} hover:scale-105 transition-transform shadow-lg`}
        size="icon"
      >
        {icon}
      </Button>
      <span className="text-xs text-center font-medium text-foreground max-w-20 truncate">{label}</span>
    </div>
  )
}

// Main Apps
const portfolioApps = [
  { icon: <User className="w-8 h-8" />, label: "About Me", id: "about", color: "bg-primary" },
  { icon: <Briefcase className="w-8 h-8" />, label: "Experience", id: "experience", color: "bg-secondary" },
  { icon: <Code className="w-8 h-8" />, label: "Projects", id: "projects", color: "bg-accent" },
  { icon: <Terminal className="w-8 h-8" />, label: "Terminal", id: "terminal", color: "bg-destructive" },
  { icon: <FileText className="w-8 h-8" />, label: "API Client", id: "api-client", color: "bg-chart-5" },
  { icon: <Mail className="w-8 h-8" />, label: "Contact", id: "contact", color: "bg-chart-1" },
]

const additionalApps = [
  { icon: <GraduationCap className="w-6 h-6" />, label: "Education", id: "education" },
  { icon: <MessageSquare className="w-6 h-6" />, label: "Blog", id: "blog" },
  { icon: <Award className="w-6 h-6" />, label: "Certificates", id: "certificates" },
  { icon: <BarChart3 className="w-6 h-6" />, label: "Analytics", id: "analytics" },
  { icon: <Clock className="w-6 h-6" />, label: "Availability", id: "availability" },
  { icon: <Smartphone className="w-6 h-6" />, label: "PWA Features", id: "pwa" },
]

type AppView = "launcher" | "api-client" | "terminal"

export default function AndroidLauncher() {
  const [currentView, setCurrentView] = useState<AppView>("launcher")
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAppSwitcher, setShowAppSwitcher] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [bottomSheetContent, setBottomSheetContent] = useState<{ title: string; content: React.ReactNode }>({
    title: "",
    content: null,
  })

  const handleAppClick = (appId: string) => {
    setSelectedApp(appId)
    console.log(`[v0] Launching app: ${appId}`)

    // Show toast notification
    setToast(`Opening ${appId.replace("-", " ")}...`)

    // Navigate to specific apps
    if (appId === "api-client") {
      setCurrentView("api-client")
    } else if (appId === "terminal") {
      setCurrentView("terminal")
    } else {
      // Show bottom sheet for other apps
      setBottomSheetContent({
        title: appId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This section is coming soon! It will contain detailed information about {appId.replace("-", " ")}.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowBottomSheet(false)}>
                Close
              </Button>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        ),
      })
      setShowBottomSheet(true)
    }
  }

  const handleBackToLauncher = () => {
    setCurrentView("launcher")
    setSelectedApp(null)
  }

  const handleAppSwitcherSelect = (appId: string) => {
    if (appId === "launcher") {
      handleBackToLauncher()
    } else {
      handleAppClick(appId)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
    setToast(`Switched to ${isDarkMode ? "light" : "dark"} mode`)
  }

  const handleFABAction = (action: string) => {
    switch (action) {
      case "edit":
        setShowDialog(true)
        break
      case "share":
        setToast("Portfolio shared successfully!")
        break
      case "download":
        setToast("CV download started!")
        break
    }
  }

  // Show API Client App
  if (currentView === "api-client") {
    return (
      <>
        <ApiClientApp onBack={handleBackToLauncher} />
        {toast && <AndroidToast message={toast} onClose={() => setToast(null)} />}
      </>
    )
  }

  // Show Terminal App
  if (currentView === "terminal") {
    return (
      <>
        <TerminalApp onBack={handleBackToLauncher} />
        {toast && <AndroidToast message={toast} onClose={() => setToast(null)} />}
      </>
    )
  }

  // Show Launcher
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Android Status Bar */}
      <AndroidStatusBar
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />

      {/* App Switcher */}
      <AppSwitcher
        isOpen={showAppSwitcher}
        onClose={() => setShowAppSwitcher(false)}
        onAppSelect={handleAppSwitcherSelect}
        currentApp={currentView}
      />

      {/* Material Bottom Sheet */}
      <MaterialBottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title={bottomSheetContent.title}
        content={bottomSheetContent.content}
      />

      {/* Material Dialog */}
      <MaterialDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title="Edit Profile"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDialog(false)
                setToast("Profile updated!")
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Profile editing functionality will be available soon. You'll be able to update your personal information,
          skills, and portfolio content.
        </p>
      </MaterialDialog>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Launcher Content */}
        <div className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2 font-work-sans">Portfolio OS</h1>
            <p className="text-muted-foreground font-open-sans">Tap an app to explore my professional journey</p>
          </div>

          {/* Main Apps Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground font-work-sans">Main Apps</h2>
            <div className="grid grid-cols-3 gap-6 justify-items-center">
              {portfolioApps.map((app) => (
                <AppIcon
                  key={app.id}
                  icon={app.icon}
                  label={app.label}
                  onClick={() => handleAppClick(app.id)}
                  color={app.color}
                />
              ))}
            </div>
          </div>

          {/* Additional Apps */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground font-work-sans">More Apps</h2>
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {additionalApps.map((app) => (
                <AppIcon
                  key={app.id}
                  icon={app.icon}
                  label={app.label}
                  onClick={() => handleAppClick(app.id)}
                  color="bg-muted-foreground"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dock */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex justify-center items-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => handleBackToLauncher()}
            >
              <div className="w-6 h-6 bg-primary rounded-full"></div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => window.history.back()}
            >
              <div className="w-6 h-1 bg-foreground rounded-full"></div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setShowAppSwitcher(true)}
            >
              <div className="w-6 h-6 border-2 border-foreground rounded"></div>
            </Button>
          </div>
        </div>
      </div>

      {/* Material FAB */}
      <MaterialFAB onAction={handleFABAction} />

      {/* Toast Notifications */}
      {toast && <AndroidToast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
