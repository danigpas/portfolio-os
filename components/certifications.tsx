"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Calendar, ExternalLink, CheckCircle, Star, Trophy, Target } from "lucide-react"

interface Certification {
  id: string
  name: string
  issuer: string
  issuedDate: string
  expiryDate?: string
  credentialId: string
  verificationUrl: string
  skills: string[]
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: string
  icon: string
  color: string
  verified: boolean
}

const certifications: Certification[] = [
  {
    id: "python-advanced",
    name: "Python Advanced Programming",
    issuer: "Python Institute",
    issuedDate: "2023-09-15",
    credentialId: "PCAP-31-03-2023-001",
    verificationUrl: "https://verify.python.org/pcap-31-03",
    skills: ["Python", "OOP", "Advanced Concepts", "Data Structures"],
    level: "Advanced",
    category: "Programming",
    icon: "🐍",
    color: "bg-yellow-500",
    verified: true,
  },
  {
    id: "fastapi-expert",
    name: "FastAPI Expert Developer",
    issuer: "FastAPI Academy",
    issuedDate: "2023-11-20",
    credentialId: "FAPI-EXP-2023-456",
    verificationUrl: "https://verify.fastapi-academy.com/expert/456",
    skills: ["FastAPI", "Async Programming", "API Design", "Performance"],
    level: "Expert",
    category: "Web Development",
    icon: "⚡",
    color: "bg-green-500",
    verified: true,
  },
  {
    id: "aws-solutions",
    name: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    issuedDate: "2024-01-10",
    expiryDate: "2027-01-10",
    credentialId: "AWS-SAA-C03-2024-789",
    verificationUrl: "https://aws.amazon.com/verification/789",
    skills: ["AWS", "Cloud Architecture", "Scalability", "Security"],
    level: "Intermediate",
    category: "Cloud Computing",
    icon: "☁️",
    color: "bg-orange-500",
    verified: true,
  },
  {
    id: "docker-certified",
    name: "Docker Certified Associate",
    issuer: "Docker Inc.",
    issuedDate: "2023-08-05",
    expiryDate: "2025-08-05",
    credentialId: "DCA-2023-321",
    verificationUrl: "https://docker.com/verify/321",
    skills: ["Docker", "Containerization", "DevOps", "Orchestration"],
    level: "Intermediate",
    category: "DevOps",
    icon: "🐳",
    color: "bg-blue-500",
    verified: true,
  },
  {
    id: "postgresql-expert",
    name: "PostgreSQL Database Expert",
    issuer: "PostgreSQL Global Development Group",
    issuedDate: "2023-12-01",
    credentialId: "PSQL-EXP-2023-654",
    verificationUrl: "https://postgresql.org/verify/654",
    skills: ["PostgreSQL", "Database Design", "Query Optimization", "Performance"],
    level: "Advanced",
    category: "Database",
    icon: "🐘",
    color: "bg-indigo-500",
    verified: true,
  },
]

export function Certifications() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [animatedBadges, setAnimatedBadges] = useState<Set<string>>(new Set())

  const categories = ["all", ...Array.from(new Set(certifications.map((cert) => cert.category)))]

  const filteredCertifications = certifications.filter(
    (cert) => selectedCategory === "all" || cert.category === selectedCategory,
  )

  useEffect(() => {
    // Animate badges on mount
    const timer = setTimeout(() => {
      certifications.forEach((cert, index) => {
        setTimeout(() => {
          setAnimatedBadges((prev) => new Set([...prev, cert.id]))
        }, index * 200)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Expert":
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case "Advanced":
        return <Star className="w-4 h-4 text-purple-500" />
      case "Intermediate":
        return <Target className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-green-100 text-green-800 border-green-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Certificaciones Profesionales</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Certificaciones verificadas que demuestran mi expertise técnico y compromiso con el aprendizaje continuo.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === "all" ? "Todas" : category}
          </Button>
        ))}
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertifications.map((cert) => (
          <Card
            key={cert.id}
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
              animatedBadges.has(cert.id) ? "animate-in slide-in-from-bottom-4" : "opacity-0"
            }`}
          >
            <div className="p-6">
              {/* Header with Icon and Verification */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${cert.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {cert.icon}
                </div>
                {cert.verified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Verificado</span>
                  </div>
                )}
              </div>

              {/* Certification Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{cert.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>

                <div className="flex items-center gap-2 mb-3">
                  {getLevelIcon(cert.level)}
                  <Badge className={`text-xs border ${getLevelColor(cert.level)}`}>{cert.level}</Badge>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {cert.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="mb-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>Emitido: {new Date(cert.issuedDate).toLocaleDateString("es-ES")}</span>
                </div>
                {cert.expiryDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>Expira: {new Date(cert.expiryDate).toLocaleDateString("es-ES")}</span>
                  </div>
                )}
              </div>

              {/* Credential ID */}
              <div className="mb-4">
                <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
              </div>

              {/* Verify Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => window.open(cert.verificationUrl, "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Verificar Certificación
              </Button>
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <Card className="p-4 text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">{certifications.length}</div>
          <div className="text-sm text-gray-600">Certificaciones</div>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">{certifications.filter((c) => c.verified).length}</div>
          <div className="text-sm text-gray-600">Verificadas</div>
        </Card>
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{certifications.filter((c) => c.level === "Expert").length}</div>
          <div className="text-sm text-gray-600">Nivel Experto</div>
        </Card>
        <Card className="p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">{categories.length - 1}</div>
          <div className="text-sm text-gray-600">Categorías</div>
        </Card>
      </div>
    </div>
  )
}
