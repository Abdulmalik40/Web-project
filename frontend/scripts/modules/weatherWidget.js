/**
 * Weather Widget Component
 * Displays current weather and forecast for Saudi cities
 * 
 * Usage:
 * - Automatically detects city from page URL or data attribute
 * - Responsive design with RTL support
 * - Auto-refreshes every 10 minutes
 */

class WeatherWidget {
    constructor(containerId, cityName) {
        this.containerId = containerId;
        this.cityName = cityName;
        this.weatherAPI = window.weatherAPI;
        this.i18n = window.i18n;
        this.refreshInterval = null;
        this.isExpanded = false;
        
        if (!this.weatherAPI) {
            console.error('WeatherAPI not found. Make sure weatherApi.js is loaded first.');
            return;
        }
        
        this.init();
    }

    async init() {
        console.log('Initializing weather widget for', this.cityName);
        
        // Subscribe to language changes
        if (this.i18n) {
            this.i18n.subscribe(() => {
                this.refresh();
            });
        }

        // Initial render
        await this.render();

        // Set up auto-refresh every 10 minutes
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 10 * 60 * 1000);
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Weather widget container #${this.containerId} not found`);
            return;
        }

        // Show loading state
        container.innerHTML = this.getLoadingHTML();

        try {
            // Fetch weather data
            const currentWeather = await this.weatherAPI.getCurrentWeather(this.cityName);
            
            // Render weather widget
            container.innerHTML = this.getWeatherHTML(currentWeather);

            // Add event listeners
            this.attachEventListeners();

            console.log('Weather widget rendered successfully');
        } catch (error) {
            console.error('Error rendering weather widget:', error);
            container.innerHTML = this.getErrorHTML();
        }
    }

    getLoadingHTML() {
        return `
            <div class="weather-widget loading">
                <div class="weather-loading-spinner"></div>
                <p>${this.getText('Loading weather...')}</p>
            </div>
        `;
    }

    getErrorHTML() {
        return `
            <div class="weather-widget error">
                <p>${this.getText('Unable to load weather data')}</p>
                <button class="weather-retry-btn" onclick="window.weatherWidget_${this.containerId}.refresh()">
                    ${this.getText('Retry')}
                </button>
            </div>
        `;
    }

    getCityIcon(cityName) {
        const cityIcons = {
            'riyadh': '🏛️',      // Capital building
            'jeddah': '⚓',       // Port/anchor
            'makkah': '🕋',      // Kaaba
            'madinah': '🕌',     // Mosque
            'alkhobar': '🏭',    // Industrial
            'al khobar': '🏭',
            'alula': '🏜️',      // Desert heritage
            'aseer': '⛰️'        // Mountains
        };
        
        const normalized = cityName.toLowerCase().trim();
        return cityIcons[normalized] || '📍';
    }

    getWeatherHTML(weather) {
        const isRTL = this.i18n && this.i18n.getLanguage() === 'ar';
        const mockBadge = weather.isMock ? `<span class="weather-mock-badge">${this.getText('Demo')}</span>` : '';
        
        return `
            <div class="weather-widget weather-widget-compact" dir="${isRTL ? 'rtl' : 'ltr'}">
                <div class="weather-widget-header">
                    <div class="weather-city-name">
                        <img 
                            src="${this.weatherAPI.getWeatherIconUrl(weather.icon)}" 
                            alt="${weather.description}"
                            class="weather-city-icon-img"
                        />
                        <h3>${weather.city}</h3>
                        ${mockBadge}
                    </div>
                </div>
                
                <div class="weather-current">
                    <div class="weather-main">
                        <div class="weather-temp">
                            <span class="weather-temp-value">${weather.temperature}</span>
                            <span class="weather-temp-unit">°C</span>
                        </div>
                    </div>
                    <div class="weather-description">
                        <p>${this.capitalizeFirst(weather.description)}</p>
                        <p class="weather-feels-like">
                            ${this.getText('Feels like')} ${weather.feelsLike}°C
                        </p>
                    </div>
                </div>
                
                <div class="weather-weekly-forecast" id="weekly-forecast-${this.containerId}">
                    ${this.getWeeklyForecastHTML()}
                </div>

                <div class="weather-footer">
                    <small>${this.getText('Updated')}: ${this.formatTime(new Date(weather.timestamp))}</small>
                </div>
            </div>
        `;
    }

    getWeeklyForecastHTML() {
        // Generate 7 days starting from today
        const days = [];
        const today = new Date();
        const dayNames = {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
        };
        
        const lang = this.i18n ? this.i18n.getLanguage() : 'en';
        const icons = ['☀️', '🌤️', '⛅', '🌤️', '☀️', '🌤️', '☀️'];
        const baseTemp = 28; // Will be updated with real data
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayIndex = date.getDay();
            const dayName = dayNames[lang][dayIndex];
            const temp = Math.round(baseTemp + (Math.random() * 6 - 3)); // ±3°C variation
            const isToday = i === 0;
            
            days.push(`
                <div class="forecast-day-item ${isToday ? 'current-day' : ''}">
                    <div class="forecast-day-name">${isToday ? (lang === 'ar' ? 'اليوم' : 'Today') : dayName}</div>
                    <div class="forecast-day-icon">${icons[i]}</div>
                    <div class="forecast-day-temp">${temp}°</div>
                </div>
            `);
        }
        
        return days.join('');
    }

    attachEventListeners() {
        // No expand button in compact mode
        // Could add click handlers for individual forecast days if needed
    }

    async refresh() {
        console.log('Refreshing weather widget...');
        this.weatherAPI.clearCache();
        await this.render();
    }

    getText(key) {
        const translations = {
            'Loading weather...': {
                en: 'Loading weather...',
                ar: 'جارٍ تحميل الطقس...'
            },
            'Unable to load weather data': {
                en: 'Unable to load weather data',
                ar: 'تعذر تحميل بيانات الطقس'
            },
            'Retry': {
                en: 'Retry',
                ar: 'إعادة المحاولة'
            },
            'Demo': {
                en: 'Demo',
                ar: 'تجريبي'
            },
            'Feels like': {
                en: 'Feels like',
                ar: 'يبدو كأنه'
            },
            'Humidity': {
                en: 'Humidity',
                ar: 'الرطوبة'
            },
            'Wind': {
                en: 'Wind',
                ar: 'الرياح'
            },
            'Pressure': {
                en: 'Pressure',
                ar: 'الضغط الجوي'
            },
            'Visibility': {
                en: 'Visibility',
                ar: 'الرؤية'
            },
            'Sunrise': {
                en: 'Sunrise',
                ar: 'الشروق'
            },
            'Sunset': {
                en: 'Sunset',
                ar: 'الغروب'
            },
            'Updated': {
                en: 'Updated',
                ar: 'آخر تحديث'
            }
        };

        const lang = this.i18n ? this.i18n.getLanguage() : 'en';
        return translations[key] ? translations[key][lang] : key;
    }

    formatTime(date) {
        return date.toLocaleTimeString(this.i18n ? this.i18n.getLanguage() : 'en', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Helper function to initialize weather widget
function initWeatherWidget(containerId, cityName) {
    // Store reference globally for easy access
    window[`weatherWidget_${containerId}`] = new WeatherWidget(containerId, cityName);
    return window[`weatherWidget_${containerId}`];
}

// Auto-detect city from URL and initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const weatherContainer = document.getElementById('weather-widget');
    if (weatherContainer) {
        // Try to detect city from URL
        const path = window.location.pathname;
        const cityMatch = path.match(/\/cities\/([^\/\.]+)/);
        
        if (cityMatch) {
            const cityName = cityMatch[1];
            console.log('Auto-detected city:', cityName);
            initWeatherWidget('weather-widget', cityName);
        } else if (weatherContainer.dataset.city) {
            // Fallback to data attribute
            initWeatherWidget('weather-widget', weatherContainer.dataset.city);
        } else {
            console.warn('Could not detect city for weather widget');
        }
    }
});

// Make available globally
window.WeatherWidget = WeatherWidget;
window.initWeatherWidget = initWeatherWidget;

