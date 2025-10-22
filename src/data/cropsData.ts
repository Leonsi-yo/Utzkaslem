// Base de datos de cultivos por departamento de Guatemala

export interface Crop {
  id: string;
  name: string;
  icon: string;
}

// Todos los cultivos disponibles en Guatemala
export const allCrops: Crop[] = [
  { id: 'maiz', name: 'Maíz', icon: '🌽' },
  { id: 'frijol', name: 'Frijol', icon: '🫘' },
  { id: 'cafe', name: 'Café', icon: '☕' },
  { id: 'cardamomo', name: 'Cardamomo', icon: '🌿' },
  { id: 'cana', name: 'Caña de Azúcar', icon: '🎋' },
  { id: 'banano', name: 'Banano', icon: '🍌' },
  { id: 'hortalizas', name: 'Hortalizas', icon: '🥬' },
  { id: 'tomate', name: 'Tomate', icon: '🍅' },
  { id: 'papa', name: 'Papa', icon: '🥔' },
  { id: 'trigo', name: 'Trigo', icon: '🌾' },
  { id: 'brocoli', name: 'Brócoli', icon: '🥦' },
  { id: 'aguacate', name: 'Aguacate', icon: '🥑' },
];

// Cultivos por departamento
export const cropsByDepartment: Record<string, string[]> = {
  // Alta Verapaz - clima húmedo, ideal para café y cardamomo
  'Alta Verapaz': ['maiz', 'frijol', 'cafe', 'cardamomo', 'hortalizas', 'aguacate'],
  
  // Baja Verapaz - agricultura diversa
  'Baja Verapaz': ['maiz', 'frijol', 'cafe', 'hortalizas', 'tomate', 'aguacate'],
  
  // Chimaltenango - altiplano central, hortalizas
  'Chimaltenango': ['maiz', 'frijol', 'cafe', 'hortalizas', 'brocoli', 'aguacate'],
  
  // Chiquimula - oriente seco, tomate
  'Chiquimula': ['maiz', 'frijol', 'tomate', 'hortalizas'],
  
  // Petén - selva tropical, agricultura extensiva
  'Petén': ['maiz', 'frijol', 'cardamomo'],
  
  // El Progreso - oriente, tomate y hortalizas
  'El Progreso': ['maiz', 'frijol', 'tomate', 'hortalizas'],
  
  // Quiché - altiplano, papa y trigo
  'Quiché': ['maiz', 'frijol', 'cafe', 'cardamomo', 'papa', 'trigo'],
  
  // Escuintla - costa sur, caña y banano
  'Escuintla': ['maiz', 'frijol', 'cana', 'banano', 'hortalizas'],
  
  // Guatemala - departamento central, diverso
  'Guatemala': ['maiz', 'frijol', 'hortalizas', 'cafe', 'aguacate'],
  
  // Huehuetenango - café de altura, papa y trigo
  'Huehuetenango': ['maiz', 'frijol', 'cafe', 'cardamomo', 'papa', 'trigo'],
  
  // Izabal - caribe, cardamomo y banano
  'Izabal': ['maiz', 'frijol', 'cardamomo', 'banano', 'hortalizas'],
  
  // Jalapa - café y tomate
  'Jalapa': ['maiz', 'frijol', 'cafe', 'tomate', 'aguacate'],
  
  // Jutiapa - oriente seco, tomate
  'Jutiapa': ['maiz', 'frijol', 'tomate', 'hortalizas'],
  
  // Quetzaltenango - altiplano occidental, café y papa
  'Quetzaltenango': ['maiz', 'frijol', 'cafe', 'papa', 'trigo', 'hortalizas', 'brocoli'],
  
  // Retalhuleu - costa sur, caña
  'Retalhuleu': ['maiz', 'frijol', 'cana', 'banano', 'hortalizas'],
  
  // Sacatepéquez - altiplano central, café y hortalizas
  'Sacatepéquez': ['maiz', 'frijol', 'cafe', 'hortalizas', 'brocoli', 'aguacate'],
  
  // San Marcos - altiplano occidental, café de altura
  'San Marcos': ['maiz', 'frijol', 'cafe', 'papa', 'trigo', 'banano'],
  
  // Santa Rosa - costa sur, caña y café
  'Santa Rosa': ['maiz', 'frijol', 'cafe', 'cana', 'tomate'],
  
  // Sololá - altiplano, papa y hortalizas
  'Sololá': ['maiz', 'frijol', 'cafe', 'papa', 'hortalizas'],
  
  // Suchitepéquez - costa sur, caña y banano
  'Suchitepéquez': ['maiz', 'frijol', 'cana', 'banano', 'hortalizas'],
  
  // Totonicapán - altiplano occidental, papa y trigo
  'Totonicapán': ['maiz', 'frijol', 'papa', 'trigo'],
  
  // Zacapa - oriente seco, tomate
  'Zacapa': ['maiz', 'frijol', 'tomate', 'hortalizas'],
};

// Función para obtener cultivos de un departamento
export function getCropsByDepartment(departmentName: string): Crop[] {
  const cropIds = cropsByDepartment[departmentName] || [];
  return allCrops.filter(crop => cropIds.includes(crop.id));
}

// Función para obtener todos los cultivos únicos de múltiples departamentos
export function getAllCropsFromDepartments(departmentNames: string[]): Crop[] {
  if (departmentNames.length === 0) {
    return allCrops;
  }
  
  const allCropIds = new Set<string>();
  departmentNames.forEach(name => {
    const cropIds = cropsByDepartment[name] || [];
    cropIds.forEach(id => allCropIds.add(id));
  });
  
  return allCrops.filter(crop => allCropIds.has(crop.id));
}
