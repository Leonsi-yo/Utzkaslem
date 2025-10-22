// WeatherAPI.com Service
// Para obtener tu API key gratuita, visita: https://www.weatherapi.com/signup.aspx

const API_KEY = '95d8f430dc804982aca151836252110'; // API key de WeatherAPI.com
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Verifica si la API key está configurada
 */
export function isApiKeyConfigured(): boolean {
  return API_KEY !== 'YOUR_WEATHERAPI_KEY_HERE' && API_KEY.length > 0;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    precip_mm: number;
    humidity: number;
  };
}

export interface ForecastData {
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        totalprecip_mm: number;
        avghumidity: number;
        maxwind_kph: number;
        condition: {
          text: string;
        };
      };
    }>;
  };
}

// Coordenadas reales de los departamentos de Guatemala
export const guatemalaDepartmentCoordinates: Record<string, { lat: number; lon: number }> = {
  'Petén': { lat: 16.9167, lon: -89.8833 },
  'Huehuetenango': { lat: 15.3197, lon: -91.4722 },
  'Quiché': { lat: 15.0333, lon: -91.1500 },
  'Alta Verapaz': { lat: 15.4747, lon: -90.3106 },
  'Izabal': { lat: 15.7308, lon: -88.5978 },
  'Guatemala': { lat: 14.6349, lon: -90.5069 },
  'Sacatepéquez': { lat: 14.5583, lon: -90.7347 },
  'Chimaltenango': { lat: 14.6611, lon: -90.8194 },
  'Escuintla': { lat: 14.3050, lon: -90.7850 },
  'San Marcos': { lat: 14.9636, lon: -91.7994 },
  'Quetzaltenango': { lat: 14.8333, lon: -91.5167 },
  'Retalhuleu': { lat: 14.5375, lon: -91.6736 },
  'Jalapa': { lat: 14.6350, lon: -89.9889 },
  'Jutiapa': { lat: 14.2914, lon: -89.8956 },
  'Baja Verapaz': { lat: 15.1167, lon: -90.3167 },
  'El Progreso': { lat: 14.8511, lon: -90.0594 },
  'Zacapa': { lat: 14.9728, lon: -89.5283 },
  'Chiquimula': { lat: 14.8000, lon: -89.5333 },
  'Santa Rosa': { lat: 14.3833, lon: -90.3000 },
  'Sololá': { lat: 14.7719, lon: -91.1897 },
  'Totonicapán': { lat: 14.9167, lon: -91.3611 },
  'Suchitepéquez': { lat: 14.4167, lon: -91.4167 }
};

/**
 * Obtiene el clima actual para una ubicación específica
 */
export async function getCurrentWeather(departmentName: string): Promise<WeatherData | null> {
  // Si no hay API key configurada, retornar null para usar datos simulados
  if (!isApiKeyConfigured()) {
    console.warn('API Key no configurada. Usando datos simulados.');
    return null;
  }

  try {
    const coords = guatemalaDepartmentCoordinates[departmentName];
    if (!coords) {
      console.error(`No se encontraron coordenadas para ${departmentName}`);
      return null;
    }

    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${coords.lat},${coords.lon}&lang=es`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error(`Error obteniendo clima para ${departmentName}:`, error);
    return null;
  }
}

/**
 * Obtiene el pronóstico para los próximos días
 */
export async function getForecast(departmentName: string, days: number = 7): Promise<ForecastData | null> {
  try {
    const coords = guatemalaDepartmentCoordinates[departmentName];
    if (!coords) {
      console.error(`No se encontraron coordenadas para ${departmentName}`);
      return null;
    }

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${coords.lat},${coords.lon}&days=${days}&lang=es`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: ForecastData = await response.json();
    return data;
  } catch (error) {
    console.error(`Error obteniendo pronóstico para ${departmentName}:`, error);
    return null;
  }
}

/**
 * Calcula el nivel de riesgo basado en los datos meteorológicos
 */
export function calculateRisk(
  rainfall: number,
  windSpeed: number,
  soilMoisture: number,
  recommendationType: string
): 'low' | 'medium' | 'high' {
  // Lógica para calcular riesgo según tipo de actividad agrícola
  
  if (recommendationType === 'fumigacion') {
    // Para fumigación: viento bajo es ideal
    if (windSpeed > 20 || rainfall > 5) return 'high';
    if (windSpeed > 15 || rainfall > 2) return 'medium';
    return 'low';
  }
  
  if (recommendationType === 'cosecha') {
    // Para cosecha: clima seco es ideal
    if (rainfall > 10 || windSpeed > 25) return 'high';
    if (rainfall > 5 || windSpeed > 18) return 'medium';
    return 'low';
  }
  
  // Para siembra: humedad adecuada es importante
  if (soilMoisture < 40 || soilMoisture > 90) return 'high';
  if (soilMoisture < 50 || soilMoisture > 85) return 'medium';
  
  if (rainfall < 5 || rainfall > 20) return 'medium';
  if (windSpeed > 20) return 'medium';
  
  return 'low';
}

/**
 * Simula datos si la API key no está configurada
 */
export function getMockWeatherData(departmentName: string): WeatherData {
  const randomTemp = 20 + Math.random() * 10;
  const randomPrecip = Math.random() * 15;
  const randomWind = 8 + Math.random() * 15;
  const randomHumidity = 50 + Math.random() * 40;

  return {
    location: {
      name: departmentName,
      region: departmentName,
      country: 'Guatemala'
    },
    current: {
      temp_c: parseFloat(randomTemp.toFixed(1)),
      condition: {
        text: 'Parcialmente nublado',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
      },
      wind_kph: parseFloat(randomWind.toFixed(1)),
      precip_mm: parseFloat(randomPrecip.toFixed(1)),
      humidity: Math.round(randomHumidity)
    }
  };
}
