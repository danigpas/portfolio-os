"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Zap, TrendingUp, Server, Database } from "lucide-react"

interface MetricData {
  responseTime: number
  statusCode: number
  requests: number
  uptime: number
  cpuUsage: number
  memoryUsage: number
}

interface ApiMetricsProps {
  activeEndpoint: string
}

export function ApiMetrics({ activeEndpoint }: ApiMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData>({
    responseTime: 45,
    statusCode: 200,
    requests: 1247,
    uptime: 99.9,
    cpuUsage: 23,
    memoryUsage: 67,
  })

  const [history, setHistory] = useState<number[]>([45, 52, 38, 41, 47, 43, 39, 44])

  useEffect(() => {
    const interval = setInterval(() => {
      const baseTime = getBaseResponseTime(activeEndpoint)
      const newResponseTime = baseTime + Math.random() * 20 - 10
      const newCpuUsage = 15 + Math.random() * 25
      const newMemoryUsage = 50 + Math.random() * 30

      setMetrics((prev) => ({
        ...prev,
        responseTime: Math.max(10, newResponseTime),
        requests: prev.requests + Math.floor(Math.random() * 3),
        cpuUsage: Math.max(5, Math.min(95, newCpuUsage)),
        memoryUsage: Math.max(30, Math.min(90, newMemoryUsage)),
      }))

      setHistory((prev) => [...prev.slice(1), newResponseTime])
    }, 2000)

    return () => clearInterval(interval)
  }, [activeEndpoint])

  const getBaseResponseTime = (endpoint: string) => {
    const baseTimes: Record<string, number> = {
      "/api/about": 35,
      "/api/experience": 65,
      "/api/education": 40,
      "/api/projects": 85,
      "/api/contact": 25,
    }
    return baseTimes[endpoint] || 50
  }

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return "bg-green-500"
    if (code >= 300 && code < 400) return "bg-yellow-500"
    return "bg-red-500"
  }

  const renderMiniChart = () => {
    const max = Math.max(...history)
    const min = Math.min(...history)
    const range = max - min || 1

    return (
      <div className="flex items-end space-x-1 h-8">
        {history.map((value, index) => (
          <div
            key={index}
            className="bg-orange-400 rounded-sm w-2 transition-all duration-300"
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: "4px",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">API Metrics</h3>
        <Badge variant="outline" className="text-xs">
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Response Time */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Response Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.responseTime.toFixed(0)}ms</div>
            <div className="mt-2">{renderMiniChart()}</div>
          </CardContent>
        </Card>

        {/* Status Code */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-500" />
              <span>Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.statusCode)}`} />
              <span className="text-2xl font-bold text-green-600">{metrics.statusCode}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{metrics.statusCode === 200 ? "OK" : "Error"}</div>
          </CardContent>
        </Card>

        {/* Requests */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.requests.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total today</div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Server className="w-4 h-4 text-purple-500" />
              <span>Uptime</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.uptime}%</div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span>System Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>CPU Usage</span>
              <span>{metrics.cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Memory Usage</span>
              <span>{metrics.memoryUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.memoryUsage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
