"use client"

import { useState } from "react"
import { getSmsConfig, saveSmsConfig, sendAlertToAll, type SmsConfig } from "../services/smsService"

interface SmsConfigProps {
  onClose: () => void
}

export function SmsConfigDialog({ onClose }: SmsConfigProps) {
  const [config, setConfig] = useState<SmsConfig>(getSmsConfig())
  const [newPhone, setNewPhone] = useState("")
  const [newEndpoint, setNewEndpoint] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const handleSave = () => {
    saveSmsConfig(config)
    alert("Configuración guardada exitosamente")
  }

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setConfig({
        ...config,
        phoneNumbers: [...config.phoneNumbers, newPhone.trim()],
      })
      setNewPhone("")
    }
  }

  const handleRemovePhone = (index: number) => {
    setConfig({
      ...config,
      phoneNumbers: config.phoneNumbers.filter((_, i) => i !== index),
    })
  }

  const handleAddEndpoint = () => {
    if (newEndpoint.trim()) {
      setConfig({
        ...config,
        endpoints: [...config.endpoints, newEndpoint.trim()],
      })
      setNewEndpoint("")
    }
  }

  const handleRemoveEndpoint = (index: number) => {
    setConfig({
      ...config,
      endpoints: config.endpoints.filter((_, i) => i !== index),
    })
  }

  const handleTestSms = async () => {
    setIsSending(true)
    setTestResult(null)

    const result = await sendAlertToAll(
      "🧪 Mensaje de prueba desde Utzka'slem\n\nSi recibe este mensaje, la configuración del gateway SMS está funcionando correctamente.",
      config,
    )

    if (result.sent > 0) {
      setTestResult(`✅ Enviado a ${result.sent} número(s)`)
    } else {
      setTestResult(`❌ Error: ${result.errors.join(", ")}`)
    }

    setIsSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-4">📱 Configuración de Alertas SMS</h2>

        {/* Token */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">🔑 Token de Autenticación</label>
          <input
            type="text"
            value={config.token}
            onChange={(e) => setConfig({ ...config, token: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Token del gateway"
          />
        </div>

        {/* Endpoints */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">🌐 Endpoints del Gateway</label>
          <div className="space-y-2 mb-2">
            {config.endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => {
                    const newEndpoints = [...config.endpoints]
                    newEndpoints[index] = e.target.value
                    setConfig({ ...config, endpoints: newEndpoints })
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveEndpoint(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEndpoint}
              onChange={(e) => setNewEndpoint(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddEndpoint()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="http://192.168.1.100:8082"
            />
            <button
              onClick={handleAddEndpoint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Números de teléfono */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">📞 Números para Alertas</label>
          <div className="space-y-2 mb-2">
            {config.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const newPhones = [...config.phoneNumbers]
                    newPhones[index] = e.target.value
                    setConfig({ ...config, phoneNumbers: newPhones })
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemovePhone(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddPhone()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+502 1234-5678"
            />
            <button onClick={handleAddPhone} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Agregar
            </button>
          </div>
        </div>

        {/* Auto-envío */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoSendAlerts}
              onChange={(e) => setConfig({ ...config, autoSendAlerts: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enviar alertas automáticamente cuando se detecte riesgo alto</span>
          </label>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`mb-4 p-3 rounded-lg ${testResult.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {testResult}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handleTestSms}
            disabled={isSending || config.phoneNumbers.length === 0}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSending ? "📤 Enviando..." : "🧪 Enviar Prueba"}
          </button>
          <button
            onClick={() => {
              handleSave()
              onClose()
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 Guardar y Cerrar
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
