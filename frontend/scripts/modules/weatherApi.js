/**
 * Weather API Module
 * Handles fetching and displaying weather data from OpenWeatherMap API
 * 
 * Features:
 * - Current weather data
 * - 5-day forecast
 * - Weather icons and descriptions
 * - Temperature in Celsius
 * - Support for English and Arabic
 */

class WeatherAPI {
    constructor() {
        this.apiKey = null;
        this.baseUrl = null;
        this.units = 'metric'; // Celsius
        this.language = 'en';
        this.cache = new Map();
        this.cacheExpiration = 10 * 60 * 1000; // 10 minutes
        this.init();
    }

    init() {
        // Load API configuration
        if (typeof window.API_CONFIG !== 'undefined') {
            this.apiKey = window.API_CONFIG.API_KEYS.OPENWEATHER;
            this.baseUrl = window.API_CONFIG.API_CONFIG.OPENWEATHER.BASE_URL;
            this.units = window.API_CONFIG.API_CONFIG.OPENWEATHER.DEFAULT_UNITS;
        }

        // Subscribe to language changes if i18n is available
        if (typeof window.i18n !== 'undefined') {
            this.language = window.i18n.getLanguage();
            window.i18n.subscribe((lang) => {
                this.language = lang;
            });
        }

        console.log('WeatherAPI initialized');
    }

    /**
     * City coordinates for Saudi cities
     */
    getCityCoordinates(cityName) {
        const cities = {
            'riyadh': { lat: 24.7136, lon: 46.6753, nameEn: 'Riyadh', nameAr: 'الرياض' },
            'jeddah': { lat: 21.5433, lon: 39.1728, nameEn: 'Jeddah', nameAr: 'جدة' },
            'makkah': { lat: 21.3891, lon: 39.8579, nameEn: 'Makkah', nameAr: 'مكة المكرمة' },
            'madinah': { lat: 24.5247, lon: 39.5692, nameEn: 'Madinah', nameAr: 'المدينة المنورة' },
            'alkhobar': { lat: 26.2172, lon: 50.1971, nameEn: 'Al Khobar', nameAr: 'الخبر' },
            'alula': { lat: 26.6084, lon: 37.9221, nameEn: 'AlUla', nameAr: 'العلا' },
            'aseer': { lat: 18.2164, lon: 42.5053, nameEn: 'Aseer', nameAr: 'عسير' }
        };

        return cities[cityName.toLowerCase()] || null;
    }

    /**
     * Fetch current weather for a city
     */
    async getCurrentWeather(cityName) {
        const cacheKey = `current_${cityName}`;
        
        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiration) {
                console.log('Returning cached weather data for', cityName);
                return cached.data;
            }
        }

        const coords = this.getCityCoordinates(cityName);
        if (!coords) {
            throw new Error(`City ${cityName} not found`);
        }

        if (!this.apiKey || this.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
            // Return mock data for demonstration
            console.warn('OpenWeather API key not configured, returning mock data');
            return this.getMockWeatherData(cityName);
        }

        try {
            const url = `${this.baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&units=${this.units}&lang=${this.language}&appid=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Process and format the data
            const weatherData = {
                city: this.language === 'ar' ? coords.nameAr : coords.nameEn,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                pressure: data.main.pressure,
                visibility: Math.round(data.visibility / 1000), // Convert to km
                sunrise: new Date(data.sys.sunrise * 1000),
                sunset: new Date(data.sys.sunset * 1000),
                timestamp: Date.now()
            };

            // Cache the data
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });

            return weatherData;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Return mock data as fallback
            return this.getMockWeatherData(cityName);
        }
    }

    /**
     * Fetch 5-day forecast for a city
     */
    async getForecast(cityName) {
        const cacheKey = `forecast_${cityName}`;
        
        // Check cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiration) {
                console.log('Returning cached forecast data for', cityName);
                return cached.data;
            }
        }

        const coords = this.getCityCoordinates(cityName);
        if (!coords) {
            throw new Error(`City ${cityName} not found`);
        }

        if (!this.apiKey || this.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
            console.warn('OpenWeather API key not configured, returning mock forecast');
            return this.getMockForecastData(cityName);
        }

        try {
            const url = `${this.baseUrl}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=${this.units}&lang=${this.language}&appid=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Group forecast by day (take one reading per day at noon)
            const dailyForecasts = [];
            const processedDays = new Set();

            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const dayKey = date.toISOString().split('T')[0];
                
                // Get forecast around noon (12:00)
                const hour = date.getHours();
                if (!processedDays.has(dayKey) && hour >= 11 && hour <= 14) {
                    processedDays.add(dayKey);
                    dailyForecasts.push({
                        date: date,
                        dayName: this.getDayName(date),
                        temperature: Math.round(item.main.temp),
                        tempMin: Math.round(item.main.temp_min),
                        tempMax: Math.round(item.main.temp_max),
                        description: item.weather[0].description,
                        icon: item.weather[0].icon,
                        humidity: item.main.humidity,
                        windSpeed: Math.round(item.wind.speed * 3.6)
                    });
                }
            });

            // Cache the data
            this.cache.set(cacheKey, {
                data: dailyForecasts.slice(0, 5), // Return max 5 days
                timestamp: Date.now()
            });

            return dailyForecasts.slice(0, 5);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            return this.getMockForecastData(cityName);
        }
    }

    /**
     * Get day name in current language
     */
    getDayName(date) {
        const days = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
        };
        
        const dayIndex = date.getDay();
        return days[this.language] ? days[this.language][dayIndex] : days.en[dayIndex];
    }

    /**
     * Get weather icon URL from OpenWeatherMap
     */
    getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    /**
     * Mock weather data for demonstration (when API key is not configured)
     */
    getMockWeatherData(cityName) {
        const coords = this.getCityCoordinates(cityName);
        const mockTemps = {
            'riyadh': 28,
            'jeddah': 32,
            'makkah': 35,
            'madinah': 30,
            'alkhobar': 29,
            'alula': 25,
            'aseer': 20
        };

        return {
            city: this.language === 'ar' ? coords.nameAr : coords.nameEn,
            temperature: mockTemps[cityName.toLowerCase()] || 25,
            feelsLike: (mockTemps[cityName.toLowerCase()] || 25) + 2,
            description: this.language === 'ar' ? 'صافي' : 'Clear sky',
            icon: '01d',
            humidity: 45,
            windSpeed: 12,
            pressure: 1013,
            visibility: 10,
            sunrise: new Date(Date.now() - 6 * 60 * 60 * 1000),
            sunset: new Date(Date.now() + 6 * 60 * 60 * 1000),
            timestamp: Date.now(),
            isMock: true
        };
    }

    /**
     * Mock forecast data for demonstration
     */
    getMockForecastData(cityName) {
        const coords = this.getCityCoordinates(cityName);
        const baseTemp = this.getMockWeatherData(cityName).temperature;
        const forecast = [];

        for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            forecast.push({
                date: date,
                dayName: this.getDayName(date),
                temperature: baseTemp + (Math.random() * 6 - 3),
                tempMin: baseTemp - 3,
                tempMax: baseTemp + 3,
                description: this.language === 'ar' ? 'صافي' : 'Clear sky',
                icon: '01d',
                humidity: 40 + Math.floor(Math.random() * 20),
                windSpeed: 10 + Math.floor(Math.random() * 10),
                isMock: true
            });
        }

        return forecast;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Weather cache cleared');
    }
}

// Create global instance
const weatherAPI = new WeatherAPI();

// Make available globally
window.weatherAPI = weatherAPI;

