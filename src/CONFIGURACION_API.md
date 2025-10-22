# Configuración de WeatherAPI.com

Esta aplicación utiliza **WeatherAPI.com** para obtener datos meteorológicos en tiempo real de los departamentos de Guatemala.

## Pasos para Configurar la API

### 1. Obtener una API Key Gratuita

1. Visita [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Regístrate con tu correo electrónico (es gratis)
3. Una vez registrado, encontrarás tu **API Key** en el dashboard
4. La versión gratuita permite:
   - 1,000,000 llamadas al mes
   - Datos en tiempo real
   - Pronóstico de hasta 3 días
   - Alertas climáticas

### 2. Configurar la API Key en la Aplicación

1. Abre el archivo `/services/weatherService.ts`
2. En la línea 4, reemplaza `'YOUR_WEATHERAPI_KEY_HERE'` con tu API key real:

```typescript
const API_KEY = 'tu_api_key_aqui'; // Reemplaza con tu API key de WeatherAPI.com
```

### 3. Verificar la Conexión

Una vez configurada la API key:

1. Refresca la aplicación
2. Los datos meteorológicos se cargarán automáticamente
3. Verás información real de:
   - Temperatura actual
   - Precipitación en las últimas 24h
   - Velocidad del viento
   - Humedad del suelo (basada en humedad relativa)

### 4. Modo de Datos Simulados (Sin API Key)

Si no configuras una API key o si la API falla:

- La aplicación funcionará con **datos simulados**
- Los datos son aleatorios pero realistas
- Útil para desarrollo y pruebas
- No se conectará a internet

## Datos Disponibles

La API proporciona:

- ✅ Temperatura en grados Celsius
- ✅ Precipitación en milímetros
- ✅ Velocidad del viento en km/h
- ✅ Humedad relativa (%)
- ✅ Condiciones climáticas en español
- ✅ Pronóstico de hasta 7 días (plan gratuito: 3 días)

## Límites del Plan Gratuito

- **1,000,000 llamadas/mes** - Más que suficiente para esta aplicación
- **Pronóstico:** Hasta 3 días
- **Alertas climáticas:** Incluidas
- **Datos históricos:** No disponibles en plan gratuito

## Cálculo de Riesgo Agrícola

La aplicación calcula automáticamente el nivel de riesgo basándose en:

### Para Fumigación:
- 🟢 **Riesgo Bajo:** Viento < 15 km/h, Lluvia < 2mm
- 🟡 **Riesgo Moderado:** Viento 15-20 km/h, Lluvia 2-5mm
- 🔴 **Riesgo Alto:** Viento > 20 km/h, Lluvia > 5mm

### Para Cosecha:
- 🟢 **Riesgo Bajo:** Lluvia < 5mm, Viento < 18 km/h
- 🟡 **Riesgo Moderado:** Lluvia 5-10mm, Viento 18-25 km/h
- 🔴 **Riesgo Alto:** Lluvia > 10mm, Viento > 25 km/h

### Para Siembra:
- 🟢 **Riesgo Bajo:** Humedad 50-85%, Lluvia 5-20mm
- 🟡 **Riesgo Moderado:** Humedad 40-50% o 85-90%, Lluvia < 5mm o > 20mm
- 🔴 **Riesgo Alto:** Humedad < 40% o > 90%

## Actualización de Datos

- Los datos se cargan automáticamente al iniciar la aplicación
- Puedes actualizar manualmente con el botón **"Actualizar Datos"** en el panel lateral
- Recomendado actualizar cada 1-2 horas para tener información precisa

## Soporte

Para más información sobre la API:
- Documentación: [https://www.weatherapi.com/docs/](https://www.weatherapi.com/docs/)
- FAQ: [https://www.weatherapi.com/faq.aspx](https://www.weatherapi.com/faq.aspx)

## Seguridad

⚠️ **IMPORTANTE:** 
- No compartas tu API key públicamente
- No la subas a repositorios públicos de GitHub
- En producción, usa variables de entorno para almacenarla de forma segura
- Esta aplicación es para propósitos educativos y de demostración
