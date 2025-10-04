"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  User,
  Briefcase,
  Code,
  GraduationCap,
  Mail,
  FileText,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react"

interface ApiClientAppProps {
  onBack: () => void
}

type Section =
  | "about"
  | "experience"
  | "projects"
  | "education"
  | "contact"
  | "blog"
  | "testimonials"
  | "cases"
  | "certifications"
  | "analytics"
  | "availability"
  | "pwa"

const sections = [
  { id: "about" as Section, label: "About Me", icon: User, method: "GET" },
  { id: "experience" as Section, label: "Experience", icon: Briefcase, method: "GET" },
  { id: "projects" as Section, label: "Projects", icon: Code, method: "GET" },
  { id: "education" as Section, label: "Education", icon: GraduationCap, method: "GET" },
  { id: "contact" as Section, label: "Contact", icon: Mail, method: "POST" },
  { id: "blog" as Section, label: "Blog", icon: MessageSquare, method: "GET" },
]

const portfolioData = {
  about: {
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
    location: "San Francisco, CA",
  },
  experience: [
    {
      company: "TechCorp Inc.",
      position: "Senior Full Stack Developer",
      duration: "2022 - Present",
      description: "Lead development of microservices architecture serving 1M+ users",
    },
    {
      company: "StartupXYZ",
      position: "Frontend Developer",
      duration: "2020 - 2022",
      description: "Built responsive web applications using React and TypeScript",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      tech: ["React", "Node.js", "MongoDB"],
      description: "Full-stack e-commerce solution with payment integration",
      status: "Production",
    },
    {
      name: "Task Management App",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      description: "Collaborative task management with real-time updates",
      status: "Development",
    },
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      school: "University of Technology",
      year: "2019",
      gpa: "3.8/4.0",
    },
  ],
}

export default function ApiClientApp({ onBack }: ApiClientAppProps) {
  const [activeSection, setActiveSection] = useState<Section>("about")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const handleRequest = async (section: Section) => {
    setIsLoading(true)
    setActiveSection(section)

    // Simulate API call
    setTimeout(() => {
      setResponse(portfolioData[section as keyof typeof portfolioData] || null)
      setIsLoading(false)
    }, 800)
  }

  const downloadCV = () => {
    // Simulate CV download
    console.log("[v0] Downloading CV...")
    alert("CV download started!")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Bar */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-work-sans">Portfolio API Client</h1>
          <p className="text-sm opacity-90">Interactive portfolio explorer</p>
        </div>
        <Button onClick={downloadCV} variant="secondary" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          CV
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        {/* API Request Interface */}
        <div className="p-4 bg-card border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {sections.find((s) => s.id === activeSection)?.method || "GET"}
            </Badge>
            <span className="font-mono text-sm text-muted-foreground">/api/portfolio/{activeSection}</span>
          </div>

          <Button onClick={() => handleRequest(activeSection)} disabled={isLoading} className="w-full gap-2">
            <Send className="w-4 h-4" />
            {isLoading ? "Fetching..." : "Send Request"}
          </Button>
        </div>

        {/* Response Area */}
        <div className="flex-1 p-4 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : response ? (
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <CardTitle className="text-lg">200 OK</CardTitle>
                  <p className="text-sm text-muted-foreground">Response received</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSection === "about" && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{response.name}</h3>
                        <p className="text-primary">{response.title}</p>
                        <p className="text-sm text-muted-foreground">{response.location}</p>
                      </div>
                      <Separator />
                      <p className="text-sm">{response.bio}</p>
                      <div>
                        <h4 className="font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {response.skills.map((skill: string) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "experience" && (
                    <div className="space-y-4">
                      {response.map((exp: any, index: number) => (
                        <Card key={index} className="p-4">
                          <h4 className="font-semibold">{exp.position}</h4>
                          <p className="text-primary text-sm">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mb-2">{exp.duration}</p>
                          <p className="text-sm">{exp.description}</p>
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeSection === "projects" && (
                    <div className="space-y-4">
                      {response.map((project: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <Badge variant={project.status === "Production" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((tech: string) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeSection === "education" && (
                    <div className="space-y-4">
                      {response.map((edu: any, index: number) => (
                        <Card key={index} className="p-4">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-primary text-sm">{edu.school}</p>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{edu.year}</span>
                            <span>GPA: {edu.gpa}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select an endpoint and send a request to view data</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-card border-t border-border p-2">
        <div className="grid grid-cols-3 gap-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{section.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
