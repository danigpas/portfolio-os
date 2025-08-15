"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, Search, Filter } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  readTime: number
  views: number
  likes: number
  comments: number
  tags: string[]
  category: string
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: "fastapi-optimization",
    title: "Optimización de APIs con FastAPI: Técnicas Avanzadas",
    excerpt:
      "Descubre cómo optimizar el rendimiento de tus APIs FastAPI usando técnicas de caching, conexiones asíncronas y optimización de consultas.",
    content: `# Optimización de APIs con FastAPI

FastAPI es un framework moderno y rápido para construir APIs con Python. En este artículo, exploraremos técnicas avanzadas para optimizar el rendimiento.

## 1. Implementación de Caching

\`\`\`python
from fastapi import FastAPI
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

app = FastAPI()

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

@app.get("/users/{user_id}")
@cache(expire=300)
async def get_user(user_id: int):
    # Lógica de consulta optimizada
    return await fetch_user_from_db(user_id)
\`\`\`

## 2. Conexiones Asíncronas

El uso de conexiones asíncronas mejora significativamente el rendimiento...`,
    author: "Daniel González Pascual",
    publishedAt: "2024-01-15",
    readTime: 8,
    views: 1250,
    likes: 89,
    comments: 23,
    tags: ["FastAPI", "Python", "Performance", "Caching"],
    category: "Backend",
    featured: true,
  },
  {
    id: "python-async-patterns",
    title: "Patrones Asíncronos en Python: Más Allá de async/await",
    excerpt:
      "Explora patrones avanzados de programación asíncrona en Python, incluyendo context managers asíncronos y generadores.",
    content: `# Patrones Asíncronos en Python

La programación asíncrona en Python va más allá de async/await. Exploremos patrones avanzados.

## Context Managers Asíncronos

\`\`\`python
class AsyncDatabaseConnection:
    async def __aenter__(self):
        self.connection = await create_connection()
        return self.connection
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.connection.close()

async def process_data():
    async with AsyncDatabaseConnection() as conn:
        result = await conn.execute("SELECT * FROM users")
        return result
\`\`\``,
    author: "Daniel González Pascual",
    publishedAt: "2024-01-10",
    readTime: 12,
    views: 890,
    likes: 67,
    comments: 15,
    tags: ["Python", "Async", "Patterns", "Advanced"],
    category: "Python",
    featured: false,
  },
  {
    id: "database-optimization",
    title: "Optimización de Consultas SQL: De Principiante a Experto",
    excerpt: "Aprende técnicas avanzadas de optimización de consultas SQL, desde índices hasta particionado de tablas.",
    content: `# Optimización de Consultas SQL

La optimización de consultas es crucial para el rendimiento de aplicaciones backend.

## Índices Estratégicos

\`\`\`sql
-- Índice compuesto para consultas frecuentes
CREATE INDEX idx_user_activity 
ON user_activities (user_id, activity_date DESC, activity_type);

-- Índice parcial para datos activos
CREATE INDEX idx_active_users 
ON users (created_at) 
WHERE status = 'active';
\`\`\``,
    author: "Daniel González Pascual",
    publishedAt: "2024-01-05",
    readTime: 15,
    views: 2100,
    likes: 156,
    comments: 42,
    tags: ["SQL", "Database", "Performance", "Optimization"],
    category: "Database",
    featured: true,
  },
]

export function TechnicalBlog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Backend", "Python", "Database", "DevOps"]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-6">
          ← Volver al blog
        </Button>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{selectedPost.title}</h1>

            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedPost.publishedAt).toLocaleDateString("es-ES")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{selectedPost.readTime} min lectura</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{selectedPost.views} vistas</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPost.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="whitespace-pre-wrap leading-relaxed">{selectedPost.content}</div>

          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  {selectedPost.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {selectedPost.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Blog Técnico</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Artículos sobre desarrollo backend, Python, optimización y mejores prácticas en el desarrollo de software.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "Todas las categorías" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Artículos Destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts
            .filter((post) => post.featured)
            .map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-orange-100 text-orange-800">{post.category}</Badge>
                    {post.featured && <Badge variant="outline">Destacado</Badge>}
                  </div>

                  <h3 className="text-xl font-semibold mb-3 hover:text-orange-600 transition-colors">{post.title}</h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("es-ES")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button onClick={() => setSelectedPost(post)} className="w-full">
                    Leer artículo
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* All Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Todos los Artículos</h3>
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.featured && <Badge className="bg-orange-100 text-orange-800">Destacado</Badge>}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 hover:text-orange-600 transition-colors">{post.title}</h3>

                    <p className="text-gray-600 mb-3">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("es-ES")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                    </div>
                  </div>

                  <Button onClick={() => setSelectedPost(post)} variant="outline" size="sm">
                    Leer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron artículos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
