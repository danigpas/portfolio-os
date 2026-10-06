import type { Metadata } from "next"
import { LandingPage } from "@/components/landing-page"

export const metadata: Metadata = {
  title: { absolute: "Daniel González Pascual — CV en línea" },
  description:
    "CV en línea de Daniel González Pascual, desarrollador backend Python: experiencia, proyectos, educación y contacto.",
}

export default function CvPage() {
  return <LandingPage />
}
