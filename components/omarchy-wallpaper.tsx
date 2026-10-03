"use client"

/**
 * Wallpaper por tema: patrón ASCII/dither/scanline sutil, 100% CSS.
 * Sustituye a los antiguos círculos blur. El patrón concreto lo decide
 * `[data-omarchy="..."] .om-wallpaper-pattern` en globals.css.
 */
export function OmarchyWallpaper() {
  return (
    <div className="om-wallpaper" aria-hidden>
      <div className="om-wallpaper-pattern" />
      <div className="om-wallpaper-scanlines" />
      <div className="om-wallpaper-vignette" />
    </div>
  )
}
