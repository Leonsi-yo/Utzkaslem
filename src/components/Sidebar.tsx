import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sprout, CalendarDays, RefreshCw } from 'lucide-react';
import { ApiKeyNotice } from './ApiKeyNotice';
import { isApiKeyConfigured } from '../services/weatherService';
import { getCropsByDepartment, allCrops, type Crop } from '../data/cropsData';

interface SidebarProps {
  selectedCrop: string;
  onCropChange: (value: string) => void;
  selectedRecommendation: string;
  onRecommendationChange: (value: string) => void;
  timeWindow: string;
  onTimeWindowChange: (value: string) => void;
  lastUpdate: Date;
  isLoading: boolean;
  onRefresh: () => void;
  selectedDepartmentName?: string;
  onMoreInfoClick?: () => void;
}

export function Sidebar({
  selectedCrop,
  onCropChange,
  selectedRecommendation,
  onRecommendationChange,
  timeWindow,
  onTimeWindowChange,
  lastUpdate,
  isLoading,
  onRefresh,
  onMoreInfoClick,
  selectedDepartmentName
}: SidebarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener cultivos disponibles según el departamento seleccionado
  const availableCrops: Crop[] = selectedDepartmentName 
    ? getCropsByDepartment(selectedDepartmentName)
    : allCrops;

  // Verificar si el cultivo actual está disponible en el departamento seleccionado
  const isCropAvailable = availableCrops.some(crop => crop.id === selectedCrop);
  
  // Si el cultivo seleccionado no está disponible, seleccionar el primero disponible
  if (selectedDepartmentName && !isCropAvailable && availableCrops.length > 0) {
    onCropChange(availableCrops[0].id);
  }

  return (
    <aside className="w-full lg:w-80 bg-white border-b lg:border-r lg:border-b-0 border-blue-200 shadow-lg p-4 lg:p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-lg">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-blue-900">Filtros Esenciales</h2>
      </div>

      {!isApiKeyConfigured() && <ApiKeyNotice />}
      
      <div className="space-y-5">
        <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 shadow-md">
          <Label htmlFor="crop" className="text-green-900 mb-3 block">
            🌱 Cultivo Primario
          </Label>
          {selectedDepartmentName && (
            <p className="text-sm text-green-700 mb-2">
              📍 Cultivos de {selectedDepartmentName}
            </p>
          )}
          <Select value={selectedCrop} onValueChange={onCropChange}>
            <SelectTrigger id="crop" className="bg-white border-2 border-green-400 h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableCrops.map(crop => (
                <SelectItem key={crop.id} value={crop.id} className="text-lg py-3">
                  <span className="flex items-center gap-2">
                    {crop.icon} {crop.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDepartmentName && availableCrops.length > 0 && (
            <p className="text-xs text-green-600 mt-2">
              {availableCrops.length} cultivo{availableCrops.length !== 1 ? 's' : ''} disponible{availableCrops.length !== 1 ? 's' : ''}
            </p>
          )}
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 shadow-md">
          <Label htmlFor="recommendation" className="text-amber-900 mb-3 block">
            ⚙️ Tipo de Recomendación
          </Label>
          <Select value={selectedRecommendation} onValueChange={onRecommendationChange}>
            <SelectTrigger id="recommendation" className="bg-white border-2 border-amber-400 h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="siembra" className="text-lg py-3">
                <span className="flex items-center gap-2">
                  🌱 Siembra
                </span>
              </SelectItem>
              <SelectItem value="cosecha" className="text-lg py-3">
                <span className="flex items-center gap-2">
                  🌾 Cosecha
                </span>
              </SelectItem>
              <SelectItem value="fumigacion" className="text-lg py-3">
                <span className="flex items-center gap-2">
                  💨 Fumigación
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-100 border-2 border-blue-300 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-5 h-5 text-blue-700" />
            <Label className="text-blue-900">
              📅 Ventana de Tiempo
            </Label>
          </div>
          <Select value={timeWindow} onValueChange={onTimeWindowChange}>
            <SelectTrigger className="bg-white border-2 border-blue-400 h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy" className="text-lg py-3">
                Hoy
              </SelectItem>
              <SelectItem value="7dias" className="text-lg py-3">
                Próximos 7 Días
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="space-y-3">
            <p className="opacity-90">📡 Última actualización</p>
            <p>{formatTime(lastUpdate)}</p>
            <p className="mt-3 opacity-90">
              {isApiKeyConfigured() ? '🌤️ Datos de WeatherAPI.com' : '🔄 Datos Simulados'}
            </p>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Actualizando...' : 'Actualizar Datos'}
            </button>
            <button
              onClick={() => onMoreInfoClick && onMoreInfoClick()}
              className="mt-3 w-full bg-white text-blue-700 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Más info
            </button>
          </div>
        </Card>
      </div>
    </aside>
  );
}
