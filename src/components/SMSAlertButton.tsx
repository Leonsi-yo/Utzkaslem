import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { MessageSquare, Send, Loader2 } from 'lucide-react'

// Recibimos el objeto alert desde RegionInfoDialog
interface SMSAlertButtonProps {
  alert: {
    departmentName: string
    aldea?: string
    cropName: string
    recommendationType: string
    riskLevel: 'low' | 'medium' | 'high'
    temperature?: number
    rainfall?: number
    wind?: number
    humidity?: number
  }
}

export function SMSAlertButton({ alert }: SMSAlertButtonProps) {
  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSendWhatsApp = () => {
    if (phoneNumber.length < 8) {
      setMessage({ type: "error", text: "Ingrese un número válido (+502XXXXXXXX)" })
      return
    }

    // 🔹 Construir mensaje dinámico
    const info = `
📍 *Departamento:* ${alert.departmentName}
🏘️ *Aldea:* ${alert.aldea ?? "No especificada"}
🌾 *Cultivo:* ${alert.cropName}
📋 *Recomendación:* ${alert.recommendationType}
⚠️ *Nivel de Riesgo:* ${alert.riskLevel === 'low' ? 'Bajo ✅' : alert.riskLevel === 'medium' ? 'Moderado ⚠️' : 'Alto ❌'}

🌡️ Temperatura: ${alert.temperature ?? 'N/A'}°C
💧 Lluvia: ${alert.rainfall ?? 'N/A'} mm
🌬️ Viento: ${alert.wind ?? 'N/A'} km/h
💦 Humedad: ${alert.humidity ?? 'N/A'}%

🛰️ Recomendación generada automáticamente por el sistema de monitoreo agrícola.
    `

    // 🔹 Abrir WhatsApp
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(info)}`
    window.open(url, "_blank")

    setMessage({ type: "success", text: "WhatsApp abierto correctamente ✅" })
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
        size="lg"
      >
        <MessageSquare className="w-5 h-5" />
        Enviar Alerta por WhatsApp
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-4 border-green-400">
          <DialogHeader>
            <DialogTitle className="text-green-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Enviar Alerta por WhatsApp
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Número de Teléfono</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+502XXXXXXXX"
                disabled={isSending}
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 ${
                  message.type === "success"
                    ? "bg-green-50 border-2 border-green-400 text-green-800"
                    : "bg-red-50 border-2 border-red-400 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setOpen(false)} variant="outline" className="flex-1" disabled={isSending}>
                Cancelar
              </Button>
              <Button
                onClick={handleSendWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
