"use client"

import { useState } from "react"
import { X, Code, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeveloperModeProps {
  activeEndpoint: string
  onClose: () => void
}

export function DeveloperMode({ activeEndpoint, onClose }: DeveloperModeProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("backend")

  const getEndpointCode = (endpoint: string, type: "backend" | "frontend" | "database") => {
    const path = endpoint.split(" ")[1]

    switch (type) {
      case "backend":
        return getBackendCode(path)
      case "frontend":
        return getFrontendCode(path)
      case "database":
        return getDatabaseCode(path)
      default:
        return ""
    }
  }

  const getBackendCode = (path: string) => {
    switch (path) {
      case "/about":
        return `# FastAPI Backend - About Endpoint
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import asyncio

router = APIRouter()

@router.get("/about")
async def get_about_info() -> Dict[str, Any]:
    """
    Retrieve developer profile information
    Returns personal and professional details
    """
    try:
        # Simulate database query
        await asyncio.sleep(0.045)  # 45ms response time
        
        profile_data = {
            "name": "Daniel González Pascual",
            "role": "Desarrollador Backend Python",
            "location": "Málaga, España",
            "description": "Desarrollador backend especializado en Python...",
            "skills": ["Python", "FastAPI", "Django", "PostgreSQL", "Redis"],
            "years_of_experience": 2.3,
            "currently_learning": "Desarrollo de Aplicaciones Web (DAW)"
        }
        
        return {
            "status": "success",
            "data": profile_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`

      case "/experience":
        return `# FastAPI Backend - Experience Endpoint
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Experience

router = APIRouter()

@router.get("/experience")
async def get_work_experience(db: Session = Depends(get_db)):
    """
    Retrieve professional work experience
    Includes current and past positions
    """
    try:
        experiences = db.query(Experience).order_by(
            Experience.start_date.desc()
        ).all()
        
        experience_data = []
        for exp in experiences:
            experience_data.append({
                "company": exp.company,
                "position": exp.position,
                "duration": f"{exp.start_date} - {exp.end_date or 'Actualidad'}",
                "type": exp.employment_type,
                "description": exp.description,
                "technologies": exp.technologies.split(","),
                "achievements": exp.achievements.split(";")
            })
        
        return {
            "status": "success",
            "data": experience_data,
            "total_positions": len(experience_data)
        }
        
    except Exception as e:
        logger.error(f"Error fetching experience: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")`

      case "/projects":
        return `# FastAPI Backend - Projects Endpoint
from fastapi import APIRouter, Query
from typing import List, Optional
import redis
import json

router = APIRouter()
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@router.get("/projects")
async def get_projects(
    status: Optional[str] = Query(None, description="Filter by project status"),
    tech: Optional[str] = Query(None, description="Filter by technology")
):
    """
    Retrieve portfolio projects with optional filtering
    Cached with Redis for better performance
    """
    cache_key = f"projects:{status}:{tech}"
    
    # Try to get from cache first
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    # Query database
    projects = [
        {
            "name": "El Nieto de Pascual",
            "type": "Blog Personal",
            "description": "Blog sobre desarrollo backend y Python",
            "technologies": ["Python", "Django", "PostgreSQL"],
            "status": "Activo",
            "url": "https://elnietodepascual.com",
            "github": "https://github.com/danielgp/blog"
        },
        {
            "name": "Portfolio Retro NES",
            "type": "Portfolio Personal", 
            "description": "Portfolio con estética retro Nintendo",
            "technologies": ["HTML", "CSS", "JavaScript"],
            "status": "Completado",
            "url": "#"
        }
    ]
    
    # Apply filters
    if status:
        projects = [p for p in projects if p["status"].lower() == status.lower()]
    if tech:
        projects = [p for p in projects if tech.lower() in [t.lower() for t in p["technologies"]]]
    
    result = {
        "status": "success",
        "data": projects,
        "total": len(projects)
    }
    
    # Cache for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(result))
    
    return result`

      default:
        return `# FastAPI Backend - Generic Endpoint
from fastapi import APIRouter

router = APIRouter()

@router.get("${path}")
async def get_data():
    return {"message": "Endpoint implementation"}`
    }
  }

  const getFrontendCode = (path: string) => {
    switch (path) {
      case "/about":
        return `// React Component - About Section
import { useState, useEffect } from 'react'
import { User, MapPin, Code } from 'lucide-react'

export default function AboutSection() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/about')
        const data = await response.json()
        setProfileData(data.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profileData?.name}</h1>
            <p className="text-xl text-orange-600">{profileData?.role}</p>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{profileData?.location}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">{profileData?.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-orange-500" />
              Tecnologías
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Experiencia</h3>
            <p className="text-2xl font-bold text-orange-600">
              {profileData?.yearsOfExperience} años
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Actualmente estudiando: {profileData?.currentlyLearning}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`

      default:
        return `// React Component - ${path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)} Section
import { useState, useEffect } from 'react'

export default function ${path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}Section() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api${path}')
        const result = await response.json()
        setData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">${path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}</h2>
      {/* Component implementation */}
    </div>
  )
}`
    }
  }

  const getDatabaseCode = (path: string) => {
    switch (path) {
      case "/experience":
        return `-- Database Schema - Experience Table
CREATE TABLE experiences (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    employment_type VARCHAR(100),
    description TEXT,
    technologies TEXT, -- Comma-separated values
    achievements TEXT, -- Semicolon-separated values
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO experiences (
    company, position, start_date, end_date, employment_type,
    description, technologies, achievements
) VALUES (
    'DisOfic',
    'Desarrollador Backend',
    '2023-09-01',
    NULL,
    'Jornada completa',
    'Desarrollo de API de integración en tiempo real con FastAPI...',
    'Python,FastAPI,MySQL,PostgreSQL,Redis,Celery,RabbitMQ',
    'Automatización de consulta de stock y precios de +12,000 productos;Reducción del 50% en incidencias relacionadas con pedidos'
);

-- Indexes for better performance
CREATE INDEX idx_experiences_company ON experiences(company);
CREATE INDEX idx_experiences_start_date ON experiences(start_date DESC);
CREATE INDEX idx_experiences_end_date ON experiences(end_date DESC);

-- Query for API endpoint
SELECT 
    company,
    position,
    CONCAT(
        TO_CHAR(start_date, 'Mon YYYY'), 
        ' - ', 
        COALESCE(TO_CHAR(end_date, 'Mon YYYY'), 'Actualidad')
    ) as duration,
    employment_type,
    description,
    STRING_TO_ARRAY(technologies, ',') as technologies,
    STRING_TO_ARRAY(achievements, ';') as achievements
FROM experiences 
ORDER BY start_date DESC;`

      case "/projects":
        return `-- Database Schema - Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    technologies JSONB, -- Store as JSON array
    status VARCHAR(50) DEFAULT 'En desarrollo',
    url VARCHAR(500),
    github_url VARCHAR(500),
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample projects
INSERT INTO projects (name, type, description, technologies, status, url) VALUES
('El Nieto de Pascual', 'Blog Personal', 
 'Blog personal sobre desarrollo backend, Python y tecnología',
 '["Python", "Django", "PostgreSQL", "HTML/CSS"]',
 'Activo', 'https://elnietodepascual.com'),
 
('Portfolio Retro NES', 'Portfolio Personal',
 'Portfolio con estética retro inspirada en Nintendo NES',
 '["HTML", "CSS", "JavaScript", "Pixel Art"]',
 'Completado', '#');

-- Indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_technologies ON projects USING GIN(technologies);

-- Query with technology filtering
SELECT 
    name,
    type,
    description,
    technologies,
    status,
    url
FROM projects 
WHERE 
    ($1::text IS NULL OR status = $1) AND
    ($2::text IS NULL OR technologies ? $2)
ORDER BY featured DESC, created_at DESC;`

      default:
        return `-- Database Schema - Generic Table
CREATE TABLE ${path.replace("/", "")}_data (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Basic query
SELECT * FROM ${path.replace("/", "")}_data ORDER BY created_at DESC;`
    }
  }

  const handleCopy = async () => {
    const code = getEndpointCode(activeEndpoint, activeTab as "backend" | "frontend" | "database")
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: "backend", label: "Backend (Python)", icon: "🐍" },
    { id: "frontend", label: "Frontend (React)", icon: "⚛️" },
    { id: "database", label: "Database (SQL)", icon: "🗄️" },
  ]

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-700 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-white">Developer Mode</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-gray-800 text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 bg-gray-800">
          <span className="text-sm text-gray-300">
            {activeEndpoint} - {tabs.find((t) => t.id === activeTab)?.label}
          </span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="text-gray-400 hover:text-white">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-black">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
            {getEndpointCode(activeEndpoint, activeTab as "backend" | "frontend" | "database")}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-gray-400">
          💡 Este código muestra la implementación real detrás de cada endpoint del portfolio
        </p>
      </div>
    </div>
  )
}
