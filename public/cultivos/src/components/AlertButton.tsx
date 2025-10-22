"use client"

import { useState } from "react"
import { sendAlertToAll, generateAlertMessage, getSmsConfig } from "../services/smsService"
import type { RegionData } from "../App"

interface AlertButtonProps {
  selectedDepartment?: RegionData
  selectedCrop: string
  selectedRecommendation: string
  allDepartments: RegionData[]
}

export function AlertButton({
  selectedDepartment,
  selectedCrop,
  selectedRecommendation,
  allDepartments,
}: AlertButtonProps) {
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSendAlert = async () => {
    setIsSending(true)
    setResult(null)

    const config = getSmsConfig()

    if (config.phoneNumbers.length === 0) {
      setResult("❌ No hay números configurados")
      setIsSending(false)
      return
    }

    // Si hay un departamento seleccionado, enviar alerta solo para ese
    // Si no, enviar resumen de todos los departamentos con riesgo alto
    let message: string

    if (selectedDepartment) {
      message = generateAlertMessage(
        selectedDepartment.name,
        selectedDepartment.risk,
        selectedCrop,
        selectedRecommendation,
        {
          temperature: selectedDepartment.temperature,
          rainfall: selectedDepartment.rainfall,
          wind: selectedDepartment.wind,
          condition: selectedDepartment.condition,
        },
      )
    } else {
      // Enviar resumen de departamentos con riesgo alto
      const highRiskDepts = allDepartments.filter((d) => d.risk === "high")

      if (highRiskDepts.length === 0) {
        message = `🌾 REPORTE AGRÍCOLA - Utzka'slem\n\n`
        message += `✅ No hay departamentos con riesgo alto en este momento.\n\n`
        message += `Cultivo: ${selectedCrop}\n`
        message += `Actividad: ${selectedRecommendation}`
      } else {
        message = `🌾 ALERTA AGRÍCOLA - Utzka'slem\n\n`
        message += `⚠️ ${highRiskDepts.length} departamento(s) con RIESGO ALTO:\n\n`
        highRiskDepts.forEach((dept) => {
          message += `📍 ${dept.name}: ${dept.rainfall.toFixed(1)}mm lluvia, ${dept.wind.toFixed(1)}km/h viento\n`
        })
        message += `\n🌱 Cultivo: ${selectedCrop}\n`
        message += `🚜 Actividad: ${selectedRecommendation}`
      }
    }

    const sendResult = await sendAlertToAll(message, config)

    if (sendResult.sent > 0) {
      setResult(`✅ Alerta enviada a ${sendResult.sent} número(s)`)
    } else {
      setResult(`❌ Error: ${sendResult.errors.join(", ")}`)
    }

    setIsSending(false)

    // Limpiar resultado después de 5 segundos
    setTimeout(() => setResult(null), 5000)
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleSendAlert}
        disabled={isSending}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {isSending ? "📤 Enviando..." : "📢 Enviar Alerta SMS"}
      </button>

      {result && (
        <div
          className={`p-2 rounded-lg text-sm text-center ${
            result.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  )
}
