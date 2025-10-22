// SMS Gateway Service para enviar alertas a través de endpoints locales

export interface SmsConfig {
  endpoints: string[]
  token: string
  phoneNumbers: string[]
  autoSendAlerts: boolean
}

// Configuración por defecto
const DEFAULT_CONFIG: SmsConfig = {
  endpoints: ["http://100.73.244.185:8082", "http://10.177.109.184:8082", "http://10.206.142.31:8082"],
  token: "690df4b5-29fa-4c8c-8347-35957908f492",
  phoneNumbers: [],
  autoSendAlerts: false,
}

const SMS_CONFIG_KEY = "sms_gateway_config"

/**
 * Obtiene la configuración de SMS desde localStorage
 */
export function getSmsConfig(): SmsConfig {
  try {
    const stored = localStorage.getItem(SMS_CONFIG_KEY)
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Error al cargar configuración SMS:", error)
  }
  return DEFAULT_CONFIG
}

/**
 * Guarda la configuración de SMS en localStorage
 */
export function saveSmsConfig(config: SmsConfig): void {
  try {
    localStorage.setItem(SMS_CONFIG_KEY, JSON.stringify(config))
  } catch (error) {
    console.error("Error al guardar configuración SMS:", error)
  }
}

/**
 * Envía un mensaje SMS a través del gateway local
 */
export async function sendSms(
  phoneNumber: string,
  message: string,
  config?: SmsConfig,
): Promise<{ success: boolean; error?: string }> {
  const smsConfig = config || getSmsConfig()

  if (!smsConfig.token) {
    return { success: false, error: "Token no configurado" }
  }

  if (smsConfig.endpoints.length === 0) {
    return { success: false, error: "No hay endpoints configurados" }
  }

  // Intentar enviar a través de cada endpoint hasta que uno funcione
  for (const endpoint of smsConfig.endpoints) {
    try {
      console.log(`[v0] Intentando enviar SMS a ${phoneNumber} vía ${endpoint}`)

      const response = await fetch(`${endpoint}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${smsConfig.token}`,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
          token: smsConfig.token,
        }),
      })

      if (response.ok) {
        console.log(`[v0] SMS enviado exitosamente a ${phoneNumber}`)
        return { success: true }
      } else {
        console.warn(`[v0] Endpoint ${endpoint} respondió con error: ${response.status}`)
      }
    } catch (error) {
      console.warn(`[v0] Error al conectar con ${endpoint}:`, error)
      // Continuar con el siguiente endpoint
    }
  }

  return { success: false, error: "No se pudo conectar con ningún gateway" }
}

/**
 * Envía alertas a múltiples números
 */
export async function sendAlertToAll(
  message: string,
  config?: SmsConfig,
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const smsConfig = config || getSmsConfig()
  let sent = 0
  let failed = 0
  const errors: string[] = []

  if (smsConfig.phoneNumbers.length === 0) {
    return { sent: 0, failed: 0, errors: ["No hay números de teléfono configurados"] }
  }

  for (const phoneNumber of smsConfig.phoneNumbers) {
    const result = await sendSms(phoneNumber, message, smsConfig)
    if (result.success) {
      sent++
    } else {
      failed++
      errors.push(`${phoneNumber}: ${result.error}`)
    }
  }

  return { sent, failed, errors }
}

/**
 * Genera un mensaje de alerta basado en los datos de riesgo
 */
export function generateAlertMessage(
  departmentName: string,
  risk: "low" | "medium" | "high",
  crop: string,
  recommendation: string,
  weatherData: {
    temperature?: number
    rainfall: number
    wind: number
    condition?: string
  },
): string {
  const riskText = {
    low: "BAJO",
    medium: "MEDIO",
    high: "ALTO",
  }[risk]

  const activityText =
    {
      siembra: "siembra",
      fumigacion: "fumigación",
      cosecha: "cosecha",
    }[recommendation] || recommendation

  let message = `🌾 ALERTA AGRÍCOLA - Utzka'slem\n\n`
  message += `📍 Departamento: ${departmentName}\n`
  message += `🌱 Cultivo: ${crop}\n`
  message += `⚠️ Nivel de Riesgo: ${riskText}\n`
  message += `🚜 Actividad: ${activityText}\n\n`
  message += `🌡️ Temperatura: ${weatherData.temperature?.toFixed(1) || "N/A"}°C\n`
  message += `💧 Lluvia: ${weatherData.rainfall.toFixed(1)}mm\n`
  message += `💨 Viento: ${weatherData.wind.toFixed(1)}km/h\n`

  if (risk === "high") {
    message += `\n⚠️ PRECAUCIÓN: Condiciones NO favorables para ${activityText}`
  } else if (risk === "medium") {
    message += `\n⚡ ATENCIÓN: Condiciones moderadas para ${activityText}`
  } else {
    message += `\n✅ Condiciones favorables para ${activityText}`
  }

  return message
}
