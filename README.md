# Saudi Tourism Website

A comprehensive tourism website for Saudi Arabia featuring Islamic guides, prayer times, Qibla direction, and historical information.

---

## Highlights

- 🕌 **Islamic utilities**: Qibla finder, configurable prayer times, Quran audio player.  
- 🌆 **City journeys**: Dedicated pages for Makkah, Madinah, Riyadh, Jeddah, Al-Khobar, Aseer, and AlUla with climate widgets, rituals, and etiquette tips.  
- 🗺️ **Dual interactive maps**: MapLibre (RTL) and Mapbox implementations powered by curated GeoJSON datasets.  
- 🧳 **Itineraries + planner**: Ready-made 12/14/30-day plans plus an Arabic trip planner with backend integration.  
- ⭐ **Review system**: User reviews and ratings for destinations with create, view, and delete functionality.  
- 🔐 **Authentication**: Full user authentication system with Laravel backend (register, login, profile management).  
- 🤖 **Chatbot + accessibility**: Consistent chatbot toggle, sticky header with theme/language switches, and scroll cues across every page.  
- 🌐 **Bilingual-ready**: `i18n` module with Arabic and English locale files plus RTL-aware layouts.  
- ☁️ **Weather integration**: Centralized weather widget and city pages with real-time weather data.

---

## Repository Layout

```
saudi-tourism-website/
├── frontend/                  # Production-ready static site
│   ├── pages/                 # HTML screens grouped by feature (cities, plans, maps, etc.)
│   ├── assets/                # Images, icons, media
│   ├── styles/                # Base, component, and page-level CSS modules
│   ├── scripts/               # Global scripts plus /modules utilities (i18n, weather, maps…)
│   ├── data/places_unified.json
│   ├── locales/               # i18n translation files (en.json, ar.json)
│   └── config/                # API key loaders (excluded from VCS if needed)
├── backend/                   # Laravel API backend
│   ├── app/Http/Controllers/  # API controllers (Auth, Review, Trip, Itinerary)
│   ├── app/Models/            # Eloquent models (User, Review, Trip, Itinerary)
│   ├── routes/api.php         # API routes
│   └── database/              # Migrations and seeders
├── docs/                      # High-level documentation / reports
└── start-server.py, build.js  # Local dev utilities
```

- 🕌 Islamic Guide and Prayer Times
- 🧭 Qibla Direction Finder
- 📖 Quran Reader
- 🏛️ Historical Timeline
- 🏜️ Tourism Destinations
- 📱 Responsive Design
- 🌙 Dark/Light Theme

## Prerequisites

- **PHP 8.2+** with Composer (for backend)
- **PostgreSQL** database server
- **Python 3** or **Node.js** (local frontend static server)

## Setup Instructions

### Backend Setup

```bash
# 1) Navigate to backend directory
cd backend

# 2) Install PHP dependencies
composer install

# 3) Copy environment file
cp .env.example .env

# 4) Configure database in .env file
# Update these settings:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# 5) Generate application key
php artisan key:generate

# 6) Run database migrations
php artisan migrate

# 7) Start Laravel development server
php artisan serve --port=9000
# Backend will run on http://127.0.0.1:9000
# Note: Frontend expects backend on port 9000 by default
```

### Frontend Setup

```bash
# 1) Install Node dependencies (optional, for build scripts)
npm install

# 2) Serve the frontend
# Option A: Using Python
cd frontend
python -m http.server 8000

# Option B: Using Node.js
npx http-server -p 8000

# Option C: Using the included script
python start-server.py

# 3) Open the site
http://localhost:8000/pages/index.html
```

### Configuration

1. **Backend API URL**: Update `frontend/scripts/reviewSystem.js` and other API-dependent scripts with your backend URL (default: `http://127.0.0.1:8000/api` - matches Laravel's default port)

2. **API Keys**: 
   - Add your OpenWeatherMap API key to `frontend/config/api-keys.js`
   - Mapbox/Geoapify keys are configured in `frontend/config/api-keys.js`

3. **CORS**: Backend CORS is configured in `backend/bootstrap/app.php` - adjust allowed origins for production

---

## Feature Guide

| Area | Entry Point | Description |
|------|-------------|-------------|
| Landing | `pages/index.html` | Hero video, chatbot, featured destinations, curated plan cards, deep links to every pillar. |
| History & Land | `pages/core/history.html`, `pages/core/land.html` | Historical timelines (RTL) and Vision 2030 mega-projects. |
| Islamic Guide | `pages/islamic-guide/*.html` | Hub + Qibla finder, prayer scheduler, Quran audio, mosque placeholder. |
| City Guides | `pages/cities/*.html` | Detailed descriptions of rituals, etiquette, climate, and attractions per city with user reviews and weather widgets. |
| Maps | `pages/maps/maplibre.html`, `map-mapbox.html` | Filterable map experiences with shared GeoJSON data. |
| Plans & Planner | `pages/plans/*.html`, `pages/plans/planner.html` | Fixed itineraries and smart planner that saves to Trips. |
| User Area | `pages/auth/*.html`, `pages/user/*.html` | Login/register, profile summary, trip management with backend API integration. |

Navigation, authentication guards, and asset inventories are detailed in `frontend/site-organization.txt`.

---

## Tech Stack

### Frontend
- **HTML5 / CSS3** (modular partials, RTL-ready utilities)  
- **Vanilla JavaScript (ES6 modules)**  
- **MapLibre GL** for interactive maps  
- **OpenWeatherMap API** for weather data  
- **Custom i18n module** with JSON locale bundles (English/Arabic)  
- **GeoJSON datasets** for map features (mosques, restaurants, hotels, etc.)

### Backend
- **Laravel 12** (PHP framework)  
- **Laravel Sanctum** for token-based authentication  
- **PostgreSQL** database  
- **RESTful API** endpoints for:
  - User authentication (register, login, logout)
  - Review management (create, view, delete)
  - Trip planning (create, view, delete)
  - Itinerary management

### Development
- **Python/Node static servers** for frontend development
- **PHP Artisan** for backend development

---

## Contributing / Next Steps

1. Fork or clone the repo.  
2. Keep `frontend/site-organization.txt` in sync with any structural changes (used in the accompanying report).  
3. Update `config/api-keys.js` with placeholder-safe values before committing.  
4. For sizeable features, open an issue or PR describing scope (maps, planner logic, backend hooks, etc.).  

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/me` - Get current user info (requires auth)

### Reviews
- `GET /api/reviews/{place_key}` - Get all reviews for a place (public)
- `POST /api/reviews` - Create a review (requires auth)
- `DELETE /api/reviews/{id}` - Delete own review (requires auth)

### Trips
- `GET /api/trips` - Get user's trips (requires auth)
- `POST /api/trips` - Create a trip (requires auth)
- `GET /api/trips/{id}` - Get trip details (requires auth)
- `DELETE /api/trips/{id}` - Delete trip (requires auth)

### Itineraries
- `GET /api/itineraries` - Get user's itineraries (requires auth)
- `POST /api/itineraries` - Create itinerary (requires auth)
- `GET /api/itineraries/{id}` - Get itinerary details (requires auth)
- `DELETE /api/itineraries/{id}` - Delete itinerary (requires auth)

## Future Enhancements

- Expand multilingual support beyond ar/en
- Add more interactive map features
- Implement advanced search and filtering
- Package with Docker for production deployment
- Add admin panel for content management

---

Need a quick tour of all pages? Check the generated documentation inside `frontend/site-organization.txt` or ping the team with questions. Happy exploring! 🎒🕌✈️
