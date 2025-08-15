"use client"

import { useTheme } from "next-themes"

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  const { theme } = useTheme()

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.65 0.2 35.8)" />
              <stop offset="50%" stopColor="oklch(0.45 0.15 220.4)" />
              <stop offset="100%" stopColor="oklch(0.55 0.18 142.5)" />
            </linearGradient>
          </defs>

          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" className="animate-gentle-pulse" />

          {/* Code brackets */}
          <path
            d="M12 14L8 20L12 26M28 14L32 20L28 26"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Initials DGP */}
          <text
            x="20"
            y="25"
            textAnchor="middle"
            className="fill-white font-bold text-xs"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            DGP
          </text>

          {/* Small Python-inspired dots */}
          <circle cx="15" cy="12" r="1.5" fill="white" opacity="0.8" />
          <circle cx="25" cy="12" r="1.5" fill="white" opacity="0.8" />
        </svg>
      </div>
      <span className="font-heading font-bold text-xl text-gradient">Daniel González</span>
    </div>
  )
}
