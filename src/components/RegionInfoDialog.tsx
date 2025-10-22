import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card } from './ui/card';
import type { RegionData } from '../App';
import { Cloud, Wind, Droplets } from 'lucide-react';
import { allCrops, getCropsByDepartment } from '../data/cropsData';
import { SMSAlertButton } from "./SMSAlertButton";

interface RegionInfoDialogProps {
  region: RegionData | null;
  open: boolean;
  onClose: () => void;
  selectedCrop: string;
  selectedRecommendation: string;
  onCropChange?: (cropId: string) => void;
}

export function RegionInfoDialog({ region, open, onClose, selectedCrop, selectedRecommendation, onCropChange }: RegionInfoDialogProps) {
  if (!region) return null;

  const getRiskInfo = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return { label: '¡ADELANTE!', color: 'bg-green-600', icon: '✓', borderColor: 'border-green-700' };
      case 'medium':
        return { label: '¡PRECAUCIÓN!', color: 'bg-yellow-500', icon: '!', borderColor: 'border-yellow-600' };
      case 'high':
        return { label: '¡DETENTE!', color: 'bg-red-600', icon: '✕', borderColor: 'border-red-700' };
    }
  };

  const riskInfo = getRiskInfo(region.risk);

  const getCropName = (crop: string) => {
    const cropData = allCrops.find(c => c.id === crop);
    return cropData ? `${cropData.icon} ${cropData.name}` : crop;
  };

  const getRecommendationName = (rec: string) => {
    const recommendations: Record<string, string> = {
      siembra: '🌱 Siembra',
      cosecha: '🌾 Cosecha',
      fumigacion: '💨 Fumigación'
    };
    return recommendations[rec] || rec;
  };

  const getRecommendationText = () => {
    if (region.risk === 'low') {
      return `Recomendado para ${getRecommendationName(selectedRecommendation)}`;
    } else if (region.risk === 'medium') {
      return `Precaución para ${getRecommendationName(selectedRecommendation)}`;
    } else {
      return `No Recomendado para ${getRecommendationName(selectedRecommendation)}`;
    }
  };

  // ✅ Obtener cultivos del departamento
  const departmentCrops = getCropsByDepartment(region.name);

  // ✅ Preparar datos para el botón de alerta SMS
  const smsAlert = {
    departmentName: region.name,
    aldea: region.aldea,
    cropName: getCropName(selectedCrop),
    recommendationType: selectedRecommendation,
    riskLevel: region.risk,
    temperature: region.temperature,
    rainfall: region.rainfall,
    wind: region.wind,
    humidity: region.soilMoisture,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-xl border-4 border-blue-400 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex items-center gap-2 text-2xl">
            📍 {region.name}
          </DialogTitle>
          {region.aldea && (
            <p className="text-gray-600 mt-1">Aldea: {region.aldea}</p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Banner principal de riesgo */}
          <Card className={`${riskInfo.color} ${riskInfo.borderColor} border-4 text-white p-6 shadow-xl`}>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl">{riskInfo.icon}</div>
              <div className="flex-1">
                <div className="bg-white/20 px-4 py-2 rounded-lg mb-2 inline-block">
                  {riskInfo.label}
                </div>
                <h3 className="text-white">
                  Riesgo {region.risk === 'low' ? 'Bajo' : region.risk === 'medium' ? 'Moderado' : 'Alto'} para {getCropName(selectedCrop)}
                </h3>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mt-3">
              <p className="text-xl">{getRecommendationText()}</p>
            </div>
          </Card>

          {/* Datos climáticos */}
          <div className="grid grid-cols-1 gap-3">
            {region.temperature && (
              <Card className="p-5 bg-gradient-to-r from-orange-50 to-red-50 border-3 border-orange-300 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-4 rounded-xl shadow-md">
                    <span className="text-3xl">🌡️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 mb-1">🌡️ Temperatura</p>
                    <p className="text-orange-700 text-2xl">{region.temperature}°C</p>
                    {region.condition && (
                      <p className="text-gray-500 mt-1">{region.condition}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-3 border-blue-300 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-4 rounded-xl shadow-md">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 mb-1">💧 Nivel de Lluvia (24h)</p>
                  <p className="text-blue-700 text-2xl">{region.rainfall.toFixed(1)} mm</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-r from-cyan-50 to-teal-50 border-3 border-cyan-300 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-500 p-4 rounded-xl shadow-md">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 mb-1">🌬️ Viento</p>
                  <p className="text-cyan-700 text-2xl">{region.wind.toFixed(1)} km/h</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-300 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 p-4 rounded-xl shadow-md">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 mb-1">💦 Humedad</p>
                  <p className="text-green-700 text-2xl">{Math.round(region.soilMoisture)}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cultivos disponibles */}
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-400 shadow-lg">
            <h4 className="text-green-900 mb-3 flex items-center gap-2">
              🌾 Cultivos de {region.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {departmentCrops.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => onCropChange && onCropChange(crop.id)}
                  type="button"
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    crop.id === selectedCrop 
                      ? 'bg-green-600 border-green-700 text-white shadow-md' 
                      : 'bg-white border-green-300 text-green-900 hover:bg-green-100'
                  }`}
                >
                  <div className="text-2xl mb-1 text-center">{crop.icon}</div>
                  <p className="text-sm text-center">{crop.name}</p>
                </button>
              ))}
            </div>
            <p className="text-sm text-green-700 mt-3 text-center">
              {departmentCrops.length} cultivo{departmentCrops.length !== 1 ? 's' : ''} disponible{departmentCrops.length !== 1 ? 's' : ''}
            </p>
          </Card>

          {/* ✅ Botón de envío de alerta SMS */}
          <SMSAlertButton alert={smsAlert} />

          {/* Botón de cierre */}
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-lg"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
