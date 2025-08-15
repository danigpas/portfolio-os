"use client"

export function MalagaDecorations() {
  return (
    <>
      {/* Farola de Málaga */}
      <div className="malaga-decoration top-20 right-10 animate-malaga-breeze">
        <svg width="60" height="120" viewBox="0 0 60 120" fill="currentColor" className="text-primary/20">
          <rect x="28" y="20" width="4" height="80" />
          <circle cx="30" cy="15" r="8" />
          <rect x="25" y="100" width="10" height="20" />
          <path d="M20 15 L40 15 L38 25 L22 25 Z" />
        </svg>
      </div>

      {/* Palmera */}
      <div className="malaga-decoration bottom-32 left-10 animate-float">
        <svg width="80" height="100" viewBox="0 0 80 100" fill="currentColor" className="text-accent/20">
          <rect x="38" y="60" width="4" height="40" />
          <path d="M40 60 Q20 40 15 20 Q25 35 40 50" />
          <path d="M40 60 Q60 40 65 20 Q55 35 40 50" />
          <path d="M40 50 Q25 25 10 15 Q30 30 40 45" />
          <path d="M40 50 Q55 25 70 15 Q50 30 40 45" />
        </svg>
      </div>

      {/* Espeto */}
      <div className="malaga-decoration top-1/2 left-1/4 animate-gentle-pulse">
        <svg width="100" height="20" viewBox="0 0 100 20" fill="currentColor" className="text-secondary/20">
          <rect x="0" y="9" width="90" height="2" />
          <circle cx="15" cy="10" r="3" />
          <circle cx="30" cy="10" r="3" />
          <circle cx="45" cy="10" r="3" />
          <circle cx="60" cy="10" r="3" />
          <circle cx="75" cy="10" r="3" />
          <path d="M90 10 L100 5 L100 15 Z" />
        </svg>
      </div>

      {/* Jabega (barca) */}
      <div className="malaga-decoration bottom-20 right-1/4 animate-malaga-breeze">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" className="text-primary/20">
          <path d="M10 30 Q60 20 110 30 L105 35 Q60 25 15 35 Z" />
          <rect x="55" y="15" width="3" height="15" />
          <path d="M58 15 L80 20 L58 25 Z" />
        </svg>
      </div>

      {/* Sol mediterráneo */}
      <div className="malaga-decoration top-10 left-1/2 animate-gentle-pulse">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="currentColor" className="text-primary/30">
          <circle cx="25" cy="25" r="12" />
          <path d="M25 5 L25 10 M25 40 L25 45 M5 25 L10 25 M40 25 L45 25" strokeWidth="2" stroke="currentColor" />
          <path
            d="M11.5 11.5 L15 15 M35 15 L38.5 11.5 M11.5 38.5 L15 35 M35 35 L38.5 38.5"
            strokeWidth="2"
            stroke="currentColor"
          />
        </svg>
      </div>
    </>
  )
}
