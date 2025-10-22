import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';

export function ApiKeyNotice() {
  return (
    <Card className="bg-amber-50 border-2 border-amber-400 p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="text-amber-900 mb-2">⚠️ Usando Datos Simulados</h4>
          <p className="text-amber-800 mb-3">
            Para ver datos meteorológicos reales de Guatemala, necesitas configurar tu API key de WeatherAPI.com
          </p>
          <div className="space-y-2">
            <p className="text-amber-700">
              1. Obtén tu API key gratuita en:{' '}
              <a 
                href="https://www.weatherapi.com/signup.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-amber-900 inline-flex items-center gap-1"
              >
                WeatherAPI.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
            <p className="text-amber-700">
              2. Configúrala en el archivo <code className="bg-amber-100 px-2 py-1 rounded">/services/weatherService.ts</code>
            </p>
            <p className="text-amber-700">
              3. Lee las instrucciones completas en <code className="bg-amber-100 px-2 py-1 rounded">CONFIGURACION_API.md</code>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
