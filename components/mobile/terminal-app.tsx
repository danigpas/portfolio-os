"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Terminal, Minimize2, X } from "lucide-react"

interface TerminalAppProps {
  onBack: () => void
}

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
  timestamp?: string
}

const portfolioCommands = {
  help: `Available commands:
  help          - Show this help message
  about         - Display personal information
  skills        - List technical skills
  experience    - Show work experience
  projects      - Display project portfolio
  education     - Show educational background
  contact       - Display contact information
  git status    - Show git repository status
  python --version - Show Python version
  docker ps     - List running containers
  clear         - Clear terminal screen
  whoami        - Display current user
  reboot        - Restart system
  suspend       - Suspend system
  shutdown      - Shutdown system`,

  about: `Alex Rodriguez - Full Stack Developer
Location: San Francisco, CA
Experience: 5+ years in web development
Specialization: React, Node.js, Cloud Technologies

Bio: Passionate developer focused on building scalable web applications
that solve real-world problems. Always learning new technologies and
best practices to deliver exceptional user experiences.`,

  skills: `Technical Skills:
Frontend:     React, TypeScript, Next.js, Vue.js, HTML5, CSS3
Backend:      Node.js, Python, Express.js, FastAPI, REST APIs
Database:     PostgreSQL, MongoDB, Redis, MySQL
Cloud:        AWS, Docker, Kubernetes, Vercel, Netlify
Tools:        Git, VS Code, Figma, Postman, Jest, Cypress
Other:        GraphQL, WebSockets, Microservices, CI/CD`,

  experience: `Work Experience:

[2022 - Present] Senior Full Stack Developer @ TechCorp Inc.
• Lead development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

[2020 - 2022] Frontend Developer @ StartupXYZ
• Built responsive web applications using React and TypeScript
• Collaborated with design team to implement pixel-perfect UIs
• Optimized application performance achieving 95+ Lighthouse scores

[2019 - 2020] Junior Developer @ WebSolutions Ltd.
• Developed and maintained client websites using modern frameworks
• Participated in agile development processes and daily standups`,

  projects: `Featured Projects:

1. E-commerce Platform
   Tech Stack: React, Node.js, MongoDB, Stripe
   Description: Full-stack e-commerce solution with payment integration
   Status: Production (serving 10k+ users)
   
2. Task Management App
   Tech Stack: Next.js, Prisma, PostgreSQL, WebSockets
   Description: Collaborative task management with real-time updates
   Status: Development
   
3. Weather Dashboard
   Tech Stack: Vue.js, Express.js, OpenWeather API
   Description: Real-time weather monitoring with data visualization
   Status: Production`,

  education: `Educational Background:

Bachelor of Computer Science
University of Technology, 2019
GPA: 3.8/4.0

Relevant Coursework:
• Data Structures and Algorithms
• Software Engineering
• Database Systems
• Web Development
• Computer Networks

Certifications:
• AWS Certified Developer Associate (2023)
• Google Cloud Professional Developer (2022)
• MongoDB Certified Developer (2021)`,

  contact: `Contact Information:

Email:     alex.rodriguez@email.com
Phone:     +1 (555) 123-4567
LinkedIn:  linkedin.com/in/alexrodriguez
GitHub:    github.com/alexrodriguez
Website:   alexrodriguez.dev
Location:  San Francisco, CA

Available for:
• Full-time opportunities
• Freelance projects
• Technical consulting
• Speaking engagements`,

  "git status": `On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
        modified:   src/components/Portfolio.tsx
        new file:   src/pages/Projects.tsx

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   README.md
        modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .env.local`,

  "python --version": "Python 3.11.5",

  "docker ps": `CONTAINER ID   IMAGE           COMMAND                  STATUS
a1b2c3d4e5f6   portfolio-app   "npm start"              Up 2 hours
g7h8i9j0k1l2   postgres:14     "docker-entrypoint.s…"   Up 2 hours
m3n4o5p6q7r8   redis:alpine    "docker-entrypoint.s…"   Up 2 hours`,

  whoami: "alex.rodriguez",

  reboot: "System reboot initiated... Please wait.",
  suspend: "System suspended. Press any key to resume.",
  shutdown: "System shutdown initiated. Goodbye!",
}

export default function TerminalApp({ onBack }: TerminalAppProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Portfolio Terminal v1.0.0" },
    { type: "output", content: 'Type "help" for available commands.' },
    { type: "output", content: "" },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMinimized, setIsMinimized] = useState(false)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus input when component mounts
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new lines are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase()
    const timestamp = new Date().toLocaleTimeString()

    // Add command to history
    if (trimmedCommand && !commandHistory.includes(trimmedCommand)) {
      setCommandHistory((prev) => [...prev, trimmedCommand])
    }
    setHistoryIndex(-1)

    // Add command line
    setLines((prev) => [
      ...prev,
      {
        type: "command",
        content: `alex@portfolio:~$ ${command}`,
        timestamp,
      },
    ])

    // Handle special commands
    if (trimmedCommand === "clear") {
      setLines([])
      return
    }

    if (trimmedCommand === "reboot") {
      setLines((prev) => [...prev, { type: "output", content: portfolioCommands.reboot }])
      setTimeout(() => {
        setLines([
          { type: "output", content: "System rebooted successfully." },
          { type: "output", content: "Portfolio Terminal v1.0.0" },
          { type: "output", content: 'Type "help" for available commands.' },
          { type: "output", content: "" },
        ])
      }, 2000)
      return
    }

    if (trimmedCommand === "shutdown") {
      setLines((prev) => [...prev, { type: "output", content: portfolioCommands.shutdown }])
      setTimeout(() => {
        onBack()
      }, 2000)
      return
    }

    // Execute command
    const output = portfolioCommands[trimmedCommand as keyof typeof portfolioCommands]
    if (output) {
      setLines((prev) => [...prev, { type: "output", content: output }])
    } else {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          content: `Command not found: ${command}. Type "help" for available commands.`,
        },
      ])
    }

    // Add empty line for spacing
    setLines((prev) => [...prev, { type: "output", content: "" }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim()) {
      executeCommand(currentCommand)
      setCurrentCommand("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand("")
      }
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsMinimized(false)} className="bg-primary text-primary-foreground shadow-lg">
          <Terminal className="w-4 h-4 mr-2" />
          Terminal
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col font-mono">
      {/* Terminal App Bar */}
      <div className="bg-gray-900 text-white p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <span className="font-semibold">Terminal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-gray-800"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-gray-800">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-auto bg-black" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, index) => (
          <div
            key={index}
            className={`mb-1 ${
              line.type === "command" ? "text-cyan-400" : line.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{line.content}</pre>
          </div>
        ))}

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-cyan-400 mr-2">alex@portfolio:~$</span>
          <Input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none text-green-400 font-mono text-sm p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type a command..."
            autoComplete="off"
          />
        </form>
      </div>

      {/* Mobile Command Shortcuts */}
      <div className="bg-gray-900 p-3 border-t border-gray-700">
        <div className="flex gap-2 overflow-x-auto">
          {["help", "about", "skills", "projects", "clear"].map((cmd) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentCommand(cmd)
                executeCommand(cmd)
              }}
              className="bg-gray-800 text-green-400 border-gray-600 hover:bg-gray-700 whitespace-nowrap"
            >
              {cmd}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
