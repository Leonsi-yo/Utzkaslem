import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { Sidebar } from './components/Sidebar';
import { RiskLegend } from './components/RiskLegend';
import { RegionInfoDialog } from './components/RegionInfoDialog';
import { getCurrentWeather, calculateRisk, getMockWeatherData } from './services/weatherService';
import { getCropsByDepartment } from './data/cropsData';

export interface RegionData {
  id: string;
  name: string;
  aldea?: string;
  risk: 'low' | 'medium' | 'high';
  rainfall: number;
  wind: number;
  soilMoisture: number;
  position: { x: number; y: number };
  temperature?: number;
  condition?: string;
}

// Información base de departamentos de Guatemala (22 departamentos)
const guatemalaDepartmentsBase = [
  // Top / North
  { id: '1', name: 'Petén', aldea: 'San Benito', position: { x: 52, y: 20 } },
  // West
  { id: '2', name: 'Huehuetenango', aldea: 'Todos Santos', position: { x: 32, y: 55 } },
  { id: '11', name: 'Quetzaltenango', aldea: 'Xela', position: { x: 32, y: 71 } },
  { id: '21', name: 'Totonicapán', aldea: 'Totonicapán', position: { x: 35, y: 67 } },
  { id: '19', name: 'Sololá', aldea: 'Panajachel', position: { x: 37, y: 73 } },
  { id: '3', name: 'Quiché', aldea: 'Chichicastenango', position: { x: 41, y: 58 } },

  // Central / North-Center
  { id: '4', name: 'Alta Verapaz', aldea: 'Cobán', position: { x: 53, y: 55 } },
  { id: '15', name: 'Baja Verapaz', aldea: 'Salamá', position: { x: 48, y: 66 } },

  // East
  { id: '5', name: 'Izabal', aldea: 'Puerto Barrios', position: { x: 65, y: 55 } },
  { id: '22', name: 'Zacapa', aldea: 'Estanzuela', position: { x: 59, y: 67 } },
  { id: '16', name: 'Chiquimula', aldea: 'Esquipulas', position: { x: 61, y: 75 } },

  // Central / Metropolitan
  { id: '6', name: 'Guatemala', aldea: 'Villa Nueva', position: { x: 47, y: 75 } },
  { id: '7', name: 'Sacatepéquez', aldea: 'Antigua', position: { x: 43, y: 77 } },
  { id: '8', name: 'Chimaltenango', aldea: 'Patzún', position: { x: 41, y: 72 } },
  { id: '17', name: 'El Progreso', aldea: 'Guastatoya', position: { x: 52, y: 69 } },
  { id: '13', name: 'Jalapa', aldea: 'Mataquescuintla', position: { x: 54, y: 75 } },

  // South / Pacific
  { id: '9', name: 'Escuintla', aldea: 'Tiquisate', position: { x: 40, y: 84 } },
  { id: '12', name: 'Retalhuleu', aldea: 'Champerico', position: { x: 29, y: 80 } },
  { id: '20', name: 'Suchitepéquez', aldea: 'Mazatenango', position: { x: 34, y: 79 } },
  { id: '10', name: 'San Marcos', aldea: 'San Pedro', position: { x: 28, y: 65 } },
  { id: '14', name: 'Jutiapa', aldea: 'El Progreso', position: { x: 55, y: 83 } },
  { id: '18', name: 'Santa Rosa', aldea: 'Cuilapa', position: { x: 49, y: 85 } },
];

function App() {
  const [selectedCrop, setSelectedCrop] = useState('maiz');
  const [selectedRecommendation, setSelectedRecommendation] = useState('siembra');
  const [selectedDepartment, setSelectedDepartment] = useState('todos');
  const [timeWindow, setTimeWindow] = useState('hoy');
  const [selectedRegionData, setSelectedRegionData] = useState<RegionData | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [guatemalaDepartments, setGuatemalaDepartments] = useState<RegionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Cargar datos meteorológicos al montar el componente
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      const departmentsWithWeather: RegionData[] = [];

      for (const dept of guatemalaDepartmentsBase) {
        try {
          // Intentar obtener datos reales de la API
          const weatherData = await getCurrentWeather(dept.name);
          
          let rainfall: number;
          let wind: number;
          let soilMoisture: number;
          let temperature: number;
          let condition: string;

          if (weatherData) {
            // Usar datos reales de la API
            rainfall = weatherData.current.precip_mm;
            wind = weatherData.current.wind_kph;
            soilMoisture = weatherData.current.humidity;
            temperature = weatherData.current.temp_c;
            condition = weatherData.current.condition.text;
          } else {
            // Usar datos simulados si la API no responde
            const mockData = getMockWeatherData(dept.name);
            rainfall = mockData.current.precip_mm;
            wind = mockData.current.wind_kph;
            soilMoisture = mockData.current.humidity;
            temperature = mockData.current.temp_c;
            condition = mockData.current.condition.text;
          }

          const risk = calculateRisk(rainfall, wind, soilMoisture, selectedRecommendation);

          departmentsWithWeather.push({
            ...dept,
            rainfall,
            wind,
            soilMoisture,
            temperature,
            condition,
            risk,
          });
        } catch (error) {
          console.error(`Error procesando datos para ${dept.name}:`, error);
          // Usar datos simulados en caso de error
          const mockData = getMockWeatherData(dept.name);
          departmentsWithWeather.push({
            ...dept,
            rainfall: mockData.current.precip_mm,
            wind: mockData.current.wind_kph,
            soilMoisture: mockData.current.humidity,
            temperature: mockData.current.temp_c,
            condition: mockData.current.condition.text,
            risk: 'medium' as const,
          });
        }
      }

      setGuatemalaDepartments(departmentsWithWeather);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    fetchWeatherData();
  }, []);

  // Recalcular riesgo cuando cambia el tipo de recomendación
  useEffect(() => {
    if (guatemalaDepartments.length > 0) {
      const updatedDepartments = guatemalaDepartments.map(dept => ({
        ...dept,
        risk: calculateRisk(dept.rainfall, dept.wind, dept.soilMoisture, selectedRecommendation),
      }));
      setGuatemalaDepartments(updatedDepartments);
    }
  }, [selectedRecommendation]);

  const filteredRegions = guatemalaDepartments.filter(region => {
    if (selectedDepartment !== 'todos' && region.id !== selectedDepartment) {
      return false;
    }
    return true;
  });

  const handleRegionClick = (region: RegionData) => {
    // Set the selected department and open the info dialog immediately
    setSelectedDepartment(region.id);
    setSelectedRegionData(region);
  };

  const handleMoreInfoClick = () => {
    // Only open the dialog if a specific department is selected (not 'todos')
    if (selectedDepartment && selectedDepartment !== 'todos') {
      const found = guatemalaDepartments.find(d => d.id === selectedDepartment);
      if (found) setSelectedRegionData(found);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    const departmentsWithWeather: RegionData[] = [];

    for (const dept of guatemalaDepartmentsBase) {
      const weatherData = await getCurrentWeather(dept.name);
      
      if (weatherData) {
        const rainfall = weatherData.current.precip_mm;
        const wind = weatherData.current.wind_kph;
        const soilMoisture = weatherData.current.humidity;
        const risk = calculateRisk(rainfall, wind, soilMoisture, selectedRecommendation);

        departmentsWithWeather.push({
          ...dept,
          rainfall,
          wind,
          soilMoisture,
          temperature: weatherData.current.temp_c,
          condition: weatherData.current.condition.text,
          risk,
        });
      } else {
        const mockData = getMockWeatherData(dept.name);
        departmentsWithWeather.push({
          ...dept,
          rainfall: mockData.current.precip_mm,
          wind: mockData.current.wind_kph,
          soilMoisture: mockData.current.humidity,
          temperature: mockData.current.temp_c,
          condition: mockData.current.condition.text,
          risk: 'medium' as const,
        });
      }
    }

    setGuatemalaDepartments(departmentsWithWeather);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // Obtener el nombre del departamento seleccionado
  const selectedDepartmentName = selectedDepartment !== 'todos' 
    ? guatemalaDepartments.find(dept => dept.id === selectedDepartment)?.name 
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Header 
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        departments={guatemalaDepartments}
        onHelpClick={() => setShowHelp(true)}
      />
      
      <main className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <Sidebar
          selectedCrop={selectedCrop}
          onCropChange={setSelectedCrop}
          selectedRecommendation={selectedRecommendation}
          onRecommendationChange={setSelectedRecommendation}
          timeWindow={timeWindow}
          onTimeWindowChange={setTimeWindow}
          lastUpdate={lastUpdate}
          isLoading={isLoading}
          onRefresh={handleRefreshData}
          selectedDepartmentName={selectedDepartmentName}
          onMoreInfoClick={handleMoreInfoClick}
        />
        
        <div className="flex-1 relative p-4 lg:p-6 flex flex-col">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl border-4 border-blue-400">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-900">Cargando datos meteorológicos...</p>
                <p className="text-gray-600 mt-2">Obteniendo información de WeatherAPI.com</p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-blue-900 mb-2 hidden lg:block">🗺️ Mapa de Guatemala</h3>
                <MapView 
                  regions={filteredRegions} 
                  onRegionClick={handleRegionClick}
                  showTitle={false}
                  selectedDepartmentId={selectedDepartment}
                  showBadge={false}
                  selectedCrop={selectedCrop}
                  onCropChange={setSelectedCrop}
                  selectedRecommendation={selectedRecommendation}
                  onMoreInfoClick={handleMoreInfoClick}
                  availableCrops={selectedDepartmentName ? getCropsByDepartment(selectedDepartmentName) : undefined}
                />
              </div>

              <aside className="w-full lg:w-80">
                <RiskLegend />
              </aside>
            </div>
          )}
        </div>
      </main>

      <RegionInfoDialog
        region={selectedRegionData}
        open={selectedRegionData !== null}
        onClose={() => setSelectedRegionData(null)}
        selectedCrop={selectedCrop}
        selectedRecommendation={selectedRecommendation}
        onCropChange={setSelectedCrop}
      />

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-blue-900 mb-4">¿Necesita Ayuda?</h3>
            <div className="space-y-3 text-gray-700">
              <p>📞 Línea de Contacto: 1234-5678</p>
              <p>📧 Email: ayuda@utzkaslem.gt</p>
              <p>⏰ Horario: Lunes a Viernes, 8:00 AM - 4:00 PM</p>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
