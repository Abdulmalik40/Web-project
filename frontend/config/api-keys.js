/**
 * API Keys Configuration for Saudi Tourism Website
 * 
 * SECURITY NOTICE:
 * - In production, these keys should be stored securely on the server-side
 * - Never commit real API keys to version control
 * - Use environment variables or secure key management services
 * - Implement proper CORS and rate limiting
 */

// API Keys Configuration
const API_KEYS = {
    // Google Maps API Key
    // Get your key from: https://console.cloud.google.com/google/maps-apis
    GOOGLE_MAPS: 'YOUR_GOOGLE_MAPS_API_KEY_HERE', // Replace with your actual key
    
    // Geoapify API Key (provided)
    // Documentation: https://www.geoapify.com/
    GEOAPIFY: '636790d9734f4bf2af3a9f2393bdcc1d',
    
    // OpenWeatherMap API Key
    OPENWEATHER: '03f856a13f83b6957cdd514980222245' // Replace with your actual key
};

// API Configuration
const API_CONFIG = {
    // Geoapify API endpoints
    GEOAPIFY: {
        BASE_URL: 'https://api.geoapify.com',
        PLACES_ENDPOINT: '/v2/places',
        GEOCODE_ENDPOINT: '/v1/geocode/search',
        AUTOCOMPLETE_ENDPOINT: '/v1/geocode/autocomplete',
        
        // Rate limiting (requests per minute)
        RATE_LIMIT: 1000,
        
        // Request timeout (milliseconds)
        TIMEOUT: 10000
    },
    
    // OpenWeatherMap API configuration
    OPENWEATHER: {
        BASE_URL: 'https://api.openweathermap.org/data/2.5',
        CURRENT_ENDPOINT: '/weather',
        FORECAST_ENDPOINT: '/forecast',
        
        // Default units: 'metric' (Celsius), 'imperial' (Fahrenheit), 'standard' (Kelvin)
        DEFAULT_UNITS: 'metric',
        
        // Rate limiting (requests per minute for free tier)
        RATE_LIMIT: 60,
        
        // Request timeout (milliseconds)
        TIMEOUT: 10000
    },
    
    // Google Maps configuration
    GOOGLE_MAPS: {
        // Map styling
        MAP_STYLES: [
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e9f7ef" }]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{ "color": "#f5f5f5" }]
            }
        ],
        
        // Default map settings
        DEFAULT_CENTER: { lat: 23.8859, lng: 45.0792 },
        DEFAULT_ZOOM: 6,
        
        // Saudi Arabia bounds
        SAUDI_BOUNDS: {
            north: 32.2,
            south: 16.3,
            east: 55.7,
            west: 34.5
        }
    }
};

// Security configuration
const SECURITY_CONFIG = {
    // CORS settings
    CORS: {
        allowedOrigins: [
            'http://localhost:3000',
            'http://localhost:8000',
            'https://yourdomain.com'
        ]
    },
    
    // Content Security Policy
    CSP: {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            "https://maps.googleapis.com",
            "https://api.geoapify.com"
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com"
        ],
        'font-src': [
            "'self'",
            "https://fonts.gstatic.com"
        ],
        'img-src': [
            "'self'",
            "data:",
            "https://maps.gstatic.com",
            "https://maps.googleapis.com"
        ],
        'connect-src': [
            "'self'",
            "https://api.geoapify.com",
            "https://maps.googleapis.com",
            "https://api.openweathermap.org"
        ]
    }
};

// Validation functions
function validateApiKey(key, type) {
    if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.warn(`⚠️ ${type} API key not configured properly`);
        return false;
    }
    return true;
}

function validateConfiguration() {
    const errors = [];
    
    if (!validateApiKey(API_KEYS.GOOGLE_MAPS, 'Google Maps')) {
        errors.push('Google Maps API key is missing or invalid');
    }
    
    if (!validateApiKey(API_KEYS.GEOAPIFY, 'Geoapify')) {
        errors.push('Geoapify API key is missing or invalid');
    }
    
    if (!validateApiKey(API_KEYS.OPENWEATHER, 'OpenWeather')) {
        errors.push('OpenWeather API key is missing or invalid');
    }
    
    if (errors.length > 0) {
        console.error('❌ API Configuration Errors:', errors);
        return false;
    }
    
    console.log('✅ API Configuration validated successfully');
    return true;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        API_KEYS,
        API_CONFIG,
        SECURITY_CONFIG,
        validateConfiguration
    };
} else {
    // Browser environment
    window.API_CONFIG = {
        API_KEYS,
        API_CONFIG,
        SECURITY_CONFIG,
        validateConfiguration
    };
}

// Auto-validate on load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        validateConfiguration();
    });
}
