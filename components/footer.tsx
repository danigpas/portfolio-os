"use client"

import { useLanguage } from "@/components/language-provider"
import { Logo } from "@/components/logo"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-background via-secondary/5 to-background border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo className="h-8" />
          </div>

          <p className="text-muted-foreground text-sm mb-2">© 2024 Daniel González Pascual. {t("footer.rights")}</p>

          <p className="text-muted-foreground text-xs">
            {t("footer.built")} ❤️ <span className="text-primary font-semibold">Next.js</span> &{" "}
            <span className="text-accent font-semibold">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
