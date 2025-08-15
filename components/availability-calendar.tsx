"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Mail, Phone, MessageSquare } from "lucide-react"

interface AvailabilitySlot {
  date: string
  time: string
  available: boolean
  type: "consultation" | "interview" | "project_discussion"
  duration: number
}

interface ContactMethod {
  type: "email" | "linkedin" | "phone" | "whatsapp"
  label: string
  value: string
  icon: any
  available: boolean
  responseTime: string
}

export function AvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [currentStatus, setCurrentStatus] = useState<"available" | "busy" | "away">("available")

  const contactMethods: ContactMethod[] = [
    {
      type: "email",
      label: "Email",
      value: "daniel@example.com",
      icon: Mail,
      available: true,
      responseTime: "< 24 horas",
    },
    {
      type: "linkedin",
      label: "LinkedIn",
      value: "daniel-gonzalez-pascual",
      icon: User,
      available: true,
      responseTime: "< 12 horas",
    },
    {
      type: "phone",
      label: "Teléfono",
      value: "+34 XXX XXX XXX",
      icon: Phone,
      available: false,
      responseTime: "Inmediato",
    },
    {
      type: "whatsapp",
      label: "WhatsApp",
      value: "+34 XXX XXX XXX",
      icon: MessageSquare,
      available: true,
      responseTime: "< 2 horas",
    },
  ]

  useEffect(() => {
    // Generate availability slots for the next 14 days
    const slots: AvailabilitySlot[] = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split("T")[0]

      // Skip weekends for now
      if (date.getDay() === 0 || date.getDay() === 6) continue

      // Morning slots
      slots.push({
        date: dateString,
        time: "09:00",
        available: Math.random() > 0.3,
        type: "consultation",
        duration: 30,
      })

      slots.push({
        date: dateString,
        time: "10:00",
        available: Math.random() > 0.4,
        type: "interview",
        duration: 60,
      })

      slots.push({
        date: dateString,
        time: "11:30",
        available: Math.random() > 0.2,
        type: "project_discussion",
        duration: 45,
      })

      // Afternoon slots
      slots.push({
        date: dateString,
        time: "15:00",
        available: Math.random() > 0.3,
        type: "consultation",
        duration: 30,
      })

      slots.push({
        date: dateString,
        time: "16:00",
        available: Math.random() > 0.5,
        type: "interview",
        duration: 60,
      })
    }

    setAvailabilitySlots(slots)
  }, [])

  useEffect(() => {
    // Simulate real-time status updates
    const statuses: Array<"available" | "busy" | "away"> = ["available", "busy", "away"]
    const interval = setInterval(() => {
      setCurrentStatus(statuses[Math.floor(Math.random() * statuses.length)])
    }, 30000) // Change every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300"
      case "busy":
        return "bg-red-100 text-red-800 border-red-300"
      case "away":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />
      case "busy":
        return <XCircle className="w-4 h-4" />
      case "away":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "project_discussion":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "Consulta"
      case "interview":
        return "Entrevista"
      case "project_discussion":
        return "Proyecto"
      default:
        return "Reunión"
    }
  }

  const uniqueDates = Array.from(new Set(availabilitySlots.map((slot) => slot.date))).sort()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Disponibilidad en Tiempo Real</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Consulta mi disponibilidad actual y agenda una reunión directamente. Mi estado se actualiza en tiempo real.
        </p>
      </div>

      {/* Current Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Estado Actual
          </h3>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${getStatusColor(currentStatus)}`}>
            {getStatusIcon(currentStatus)}
            <span className="font-medium capitalize">
              {currentStatus === "available" ? "Disponible" : currentStatus === "busy" ? "Ocupado" : "Ausente"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {currentStatus === "available" && "Listo para nuevas oportunidades"}
            {currentStatus === "busy" && "En reunión o trabajando en proyecto"}
            {currentStatus === "away" && "Temporalmente no disponible"}
          </div>
        </div>
      </Card>

      {/* Contact Methods */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Métodos de Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  method.available ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${method.available ? "text-green-600" : "text-gray-400"}`} />
                  <span className="font-medium">{method.label}</span>
                  {method.available ? (
                    <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                  ) : (
                    <Badge variant="outline">No disponible</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-1">{method.value}</div>
                <div className="text-xs text-gray-500">Respuesta: {method.responseTime}</div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Calendar */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Calendario de Disponibilidad
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div>
            <h4 className="font-medium mb-3">Seleccionar Fecha</h4>
            <div className="space-y-2">
              {uniqueDates.slice(0, 7).map((date) => {
                const dateObj = new Date(date)
                const availableSlotsForDate = availabilitySlots.filter(
                  (slot) => slot.date === date && slot.available,
                ).length
                const totalSlotsForDate = availabilitySlots.filter((slot) => slot.date === date).length

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedDate === date
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {dateObj.toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {availableSlotsForDate} de {totalSlotsForDate} slots disponibles
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${availableSlotsForDate > 0 ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h4 className="font-medium mb-3">
              Horarios Disponibles
              {selectedDate && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({new Date(selectedDate).toLocaleDateString("es-ES")})
                </span>
              )}
            </h4>

            {selectedDate ? (
              <div className="space-y-2">
                {availabilitySlots
                  .filter((slot) => slot.date === selectedDate)
                  .map((slot, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        slot.available
                          ? "border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{slot.time}</div>
                          <Badge className={getTypeColor(slot.type)}>{getTypeLabel(slot.type)}</Badge>
                          <span className="text-sm text-gray-600">{slot.duration} min</span>
                        </div>
                        {slot.available ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Selecciona una fecha para ver los horarios disponibles</p>
              </div>
            )}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6 pt-6 border-t">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              <Calendar className="w-4 h-4 mr-2" />
              Solicitar Reunión
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Te contactaré en menos de 24 horas para confirmar la reunión
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
