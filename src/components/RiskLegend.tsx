import { Card } from './ui/card';

export function RiskLegend() {
  return (
    <Card className="bg-white/98 backdrop-blur-sm p-5 shadow-2xl border-4 border-blue-400 w-80">
      <h4 className="text-blue-900 mb-4">🚦 Semáforo de Riesgo</h4>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl border-4 border-green-700 shadow-xl">
            <span className="text-white text-3xl">✓</span>
          </div>
          <div className="flex-1">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg mb-2 inline-block">
              ¡ADELANTE!
            </div>
            <p className="text-gray-700">Condiciones Óptimas</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl border-4 border-yellow-600 shadow-xl">
            <span className="text-white text-3xl">!</span>
          </div>
          <div className="flex-1">
            <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg mb-2 inline-block">
              ¡PRECAUCIÓN!
            </div>
            <p className="text-gray-700">Riesgo Moderado</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-xl border-4 border-red-700 shadow-xl">
            <span className="text-white text-3xl">✕</span>
          </div>
          <div className="flex-1">
            <div className="bg-red-600 text-white px-3 py-2 rounded-lg mb-2 inline-block">
              ¡DETENTE!
            </div>
            <p className="text-gray-700">Riesgo Alto / No Recomendado</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
