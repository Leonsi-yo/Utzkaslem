// SMS Service para enviar alertas a agricultores
const SMS_GATEWAY_TOKEN = "690df4b5-29fa-4c8c-8347-35957908f492"
const SMS_GATEWAY_ENDPOINTS = ["http://172.20.10.9:8082", "http://10.66.105.58:8082"]
const DEFAULT_PHONE_NUMBER = "+50212345678"

export interface SMSMessage {
  to: string
  message: string
}

export interface SMSAlert {
  departmentName: string
  aldea?: string
  cropName: string
  recommendationType: string
  riskLevel: "low" | "medium" | "high"
  temperature?: number
  rainfall: number
  wind: number
  humidity: number
}

export function isSMSConfigured(): boolean {
  return SMS_GATEWAY_TOKEN !== "" && SMS_GATEWAY_TOKEN.length > 0
}

export function generateAlertMessage(alert: SMSAlert): string {
  const riskEmoji = { low: "✅", medium: "⚠️", high: "🛑" }
  const riskText = { low: "ADELANTE", medium: "PRECAUCIÓN", high: "DETENTE" }
  const location = alert.aldea ? `${alert.departmentName} (${alert.aldea})` : alert.departmentName

  return `${riskEmoji[alert.riskLevel]} ALERTA UTZK'ASLEM

${riskText[alert.riskLevel]} para ${alert.recommendationType} de ${alert.cropName}

📍 ${location}
🌡️ Temp: ${alert.temperature || "N/A"}°C
💧 Lluvia: ${alert.rainfall.toFixed(1)} mm
🌬️ Viento: ${alert.wind.toFixed(1)} km/h
💦 Humedad: ${Math.round(alert.humidity)}%`
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!isSMSConfigured()) {
    console.warn("SMS no configurado. Mensaje simulado:")
    console.log(`Para: ${to}\nMensaje:\n${message}`)
    return false
  }

  try {
    console.log("[v0] Enviando SMS a:", to)
    
    for (const endpoint of SMS_GATEWAY_ENDPOINTS) {
      try {
        const response = await fetch(`${endpoint}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SMS_GATEWAY_TOKEN}`
          },
          body: JSON.stringify({ to, message, token: SMS_GATEWAY_TOKEN })
        })

        if (response.ok) {
          console.log("[v0] SMS enviado exitosamente")
          return true
        }
      } catch (error) {
        console.warn(`Error con ${endpoint}:`, error)
        continue
      }
    }
    
    console.log("Mostrando SMS en consola:", { to, message })
    return false
  } catch (error) {
    console.error("[v0] Error enviando SMS:", error)
    return false
  }
}

export async function sendRiskAlert(phoneNumber: string, alert: SMSAlert): Promise<boolean> {
  const message = generateAlertMessage(alert)
  return await sendSMS(phoneNumber, message)
}

export function getDefaultPhoneNumber(): string {
  return DEFAULT_PHONE_NUMBER
}