// frontend/config.js
// Configuration file for Saudi Tourism Website

export const CONFIG = {
  // API Endpoints
  API: {
    PRAYER_TIMES: 'https://api.aladhan.com/v1/timingsByCity',
    QIBLA: 'https://api.aladhan.com/v1/qibla',
    QURAN: 'https://api.alquran.cloud/v1',
    WEATHER: 'https://api.openweathermap.org/data/2.5/weather'
  },
  
  // Default Settings
  DEFAULTS: {
    CITY: 'Riyadh',
    COUNTRY: 'Saudi Arabia',
    LANGUAGE: 'en',
    THEME: 'light',
    PRAYER_METHOD: 4, // Umm al-Qura University, Makkah
    TIMEZONE: 'Asia/Riyadh'
  },
  
  // App Settings
  APP: {
    NAME: 'Saudi Tourism',
    VERSION: '1.0.0',
    DESCRIPTION: 'Discover the Kingdom of Saudi Arabia',
    AUTHOR: 'Saudi Tourism Team'
  },
  
  // Feature Flags
  FEATURES: {
    DARK_MODE: true,
    PRAYER_TIMES: true,
    QIBLA_COMPASS: true,
    QURAN_READER: true,
    ISLAMIC_GUIDE: true,
    HISTORICAL_TIMELINE: true,
    TOURISM_DESTINATIONS: true
  },
  
  // UI Settings
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
  }
};

// Export individual configs for easier imports
export const { API, DEFAULTS, APP, FEATURES, UI } = CONFIG;
