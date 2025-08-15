"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Eye, Users, Clock, TrendingUp, Globe, Smartphone, Monitor, BarChart3, Activity, MapPin } from "lucide-react"
import { CountUpAnimation, ProgressBar } from "@/components/enhanced-animations"

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  averageTime: string
  bounceRate: number
  topPages: Array<{ page: string; views: number; percentage: number }>
  deviceTypes: Array<{ type: string; percentage: number; icon: any }>
  countries: Array<{ country: string; visitors: number; flag: string }>
  realTimeUsers: number
  conversionRate: number
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 12547,
    uniqueVisitors: 8932,
    averageTime: "3:42",
    bounceRate: 32.5,
    topPages: [
      { page: "/about", views: 4521, percentage: 36 },
      { page: "/projects", views: 3876, percentage: 31 },
      { page: "/experience", views: 2234, percentage: 18 },
      { page: "/blog", views: 1456, percentage: 12 },
      { page: "/contact", views: 460, percentage: 3 },
    ],
    deviceTypes: [
      { type: "Desktop", percentage: 58, icon: Monitor },
      { type: "Mobile", percentage: 35, icon: Smartphone },
      { type: "Tablet", percentage: 7, icon: Globe },
    ],
    countries: [
      { country: "España", visitors: 3456, flag: "🇪🇸" },
      { country: "Estados Unidos", visitors: 2134, flag: "🇺🇸" },
      { country: "Reino Unido", visitors: 1876, flag: "🇬🇧" },
      { country: "Francia", visitors: 987, flag: "🇫🇷" },
      { country: "Alemania", visitors: 479, flag: "🇩🇪" },
    ],
    realTimeUsers: 23,
    conversionRate: 4.2,
  })

  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 23,
    pageViews: 156,
    newSessions: 12,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 6) - 2),
        pageViews: prev.pageViews + Math.floor(Math.random() * 3),
        newSessions: prev.newSessions + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600">Métricas en tiempo real del portfolio y engagement de usuarios</p>
      </div>

      {/* Real-time Stats */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Actividad en Tiempo Real</h3>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              <CountUpAnimation end={realTimeData.activeUsers} duration={1000} />
            </div>
            <div className="text-sm text-gray-600">Usuarios Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              <CountUpAnimation end={realTimeData.pageViews} duration={1000} />
            </div>
            <div className="text-sm text-gray-600">Vistas de Página</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              <CountUpAnimation end={realTimeData.newSessions} duration={1000} />
            </div>
            <div className="text-sm text-gray-600">Nuevas Sesiones</div>
          </div>
        </div>
      </Card>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">
                <CountUpAnimation end={analyticsData.totalViews} duration={2000} />
              </div>
              <div className="text-sm text-gray-600">Total de Vistas</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                <CountUpAnimation end={analyticsData.uniqueVisitors} duration={2000} />
              </div>
              <div className="text-sm text-gray-600">Visitantes Únicos</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+8.3% vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">{analyticsData.averageTime}</div>
              <div className="text-sm text-gray-600">Tiempo Promedio</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+15.2% vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">
                <CountUpAnimation end={analyticsData.conversionRate} duration={2000} suffix="%" />
              </div>
              <div className="text-sm text-gray-600">Tasa de Conversión</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span>+2.1% vs mes anterior</span>
          </div>
        </Card>
      </div>

      {/* Top Pages */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Páginas Más Visitadas
        </h3>
        <div className="space-y-3">
          {analyticsData.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-gray-600">{page.views.toLocaleString()} vistas</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar progress={page.percentage} className="w-20" />
                <span className="text-sm font-medium w-10">{page.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Device Types and Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-500" />
            Tipos de Dispositivo
          </h3>
          <div className="space-y-3">
            {analyticsData.deviceTypes.map((device, index) => {
              const Icon = device.icon
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{device.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar progress={device.percentage} className="w-20" />
                    <span className="text-sm font-medium w-10">{device.percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            Visitantes por País
          </h3>
          <div className="space-y-3">
            {analyticsData.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{country.flag}</span>
                  <span className="font-medium">{country.country}</span>
                </div>
                <div className="text-sm font-medium">{country.visitors.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bounce Rate */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Tasa de Rebote</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar progress={analyticsData.bounceRate} className="h-3" />
          </div>
          <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Porcentaje de visitantes que abandonan el sitio después de ver solo una página
        </p>
      </Card>
    </div>
  )
}
