# Saudi Tourism Website

A comprehensive tourism website for Saudi Arabia featuring Islamic guides, prayer times, Qibla direction, and historical information.

---

## Highlights

- 🕌 **Islamic utilities**: Qibla finder, configurable prayer times, Quran audio player, and (soon) nearby mosques.  
- 🌆 **City journeys**: Dedicated pages for Makkah, Madinah, Riyadh, Jeddah, Alkhobar, Asir, and AlUla with climate widgets, rituals, and etiquette tips.  
- 🗺️ **Dual interactive maps**: MapLibre (RTL) and Mapbox implementations powered by curated GeoJSON datasets.  
- 🧳 **Itineraries + planner**: Ready-made 12/14/30-day plans plus an Arabic trip planner that saves preferences locally and feeds the Trips dashboard.  
- 🤖 **Chatbot + accessibility**: Consistent chatbot toggle, sticky header with theme/language switches, and scroll cues across every page.  
- 🌐 **Bilingual-ready**: `i18n` module with Arabic and English locale files plus RTL-aware layouts.  
- ☁️ **Weather-ready**: Centralized weather widget prototype and city pages wired to `weatherApi.js` / `weatherWidget.js`.

For a narrative description of every page and artifact, see `frontend/site-organization.txt`.

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
│   └── config/                # API key loaders (excluded from VCS if needed)
├── backend/                   # Placeholder for future API layer
├── docs/                      # High-level documentation / reports
├── vendor/, node packages     # Deployment tooling
└── start-server.py, build.js  # Local dev utilities
```

Key supporting files:
- `frontend/site-organization.txt` – report-ready Site Organization section (pages, navigation, artifacts).  
- `frontend/config/api-keys.js` – wrapper used by weather/map modules (expects OpenWeatherMap key).  
- `NETWORK_SETUP.md` – networking notes for multi-machine previews.  
- `deploy.sh` / `build.js` – helper scripts for packaging the static site.

---

- 🕌 Islamic Guide and Prayer Times
- 🧭 Qibla Direction Finder
- 📖 Quran Reader
- 🏛️ Historical Timeline
- 🏜️ Tourism Destinations
- 📱 Responsive Design
- 🌙 Dark/Light Theme

Prerequisites: Python 3 or Node.js (any static HTTP server works).

```bash
# 1) Install dependencies (only if you plan to use build scripts)
npm install

# 2) Serve the frontend
cd frontend
python -m http.server 8000      # or: npx http-server -p 8000

# 3) Open the site
http://localhost:8000/pages/index.html
```

> Tip: use `start-server.py` from the repo root to spin up a static server with sensible defaults.

### Configuration
1. Copy `frontend/config/api-keys.js.example` (if provided) to `frontend/config/api-keys.js`.  
2. Add your OpenWeatherMap key and any other credentials referenced by the weather/map modules.  
3. Restart the dev server so scripts pick up the updated config.

---

## Feature Guide

| Area | Entry Point | Description |
|------|-------------|-------------|
| Landing | `pages/index.html` | Hero video, chatbot, featured destinations, curated plan cards, deep links to every pillar. |
| History & Land | `pages/core/history.html`, `pages/core/land.html` | Historical timelines (RTL) and Vision 2030 mega-projects. |
| Islamic Guide | `pages/islamic-guide/*.html` | Hub + Qibla finder, prayer scheduler, Quran audio, mosque placeholder. |
| City Guides | `pages/cities/*.html` | Simple descriptions of rituals, etiquette, climate, and attractions per city plus reviews/weather. |
| Maps | `pages/maps/maplibre.html`, `map-mapbox.html` | Filterable map experiences with shared GeoJSON data. |
| Plans & Planner | `pages/plans/*.html`, `pages/plans/planner.html` | Fixed itineraries and smart planner that saves to Trips. |
| User Area | `pages/auth/*.html`, `pages/user/*.html` | Login/register, profile summary, trip management (local storage for now). |

Navigation, authentication guards, and asset inventories are detailed in `frontend/site-organization.txt`.

---

## Tech Stack

- **HTML5 / CSS3** (modular partials, RTL-ready utilities)  
- **Vanilla JavaScript (ES6 modules)**  
- **MapLibre GL** for maps  
- **OpenWeatherMap API** for weather data  
- **Custom i18n module** with JSON locale bundles  
- **Local storage** for lightweight auth/trip persistence  
- **Python/Node static servers** for local development

Planned backend integrations (future):
- Node.js/Express or PHP API  
- MongoDB/PostgreSQL for persistent trips + auth  
- Secure auth service (JWT/OAuth)  
- REST endpoints for itinerary management

---

## Contributing / Next Steps

1. Fork or clone the repo.  
2. Keep `frontend/site-organization.txt` in sync with any structural changes (used in the accompanying report).  
3. Update `config/api-keys.js` with placeholder-safe values before committing.  
4. For sizeable features, open an issue or PR describing scope (maps, planner logic, backend hooks, etc.).  

Ideas on the roadmap:
- Plug Trips/Planner into a real backend (Mongo/Postgres).  
- Finish “Nearby Mosques” with live data and geolocation.  
- Expand multilingual support beyond ar/en.  
- Package the frontend with Docker + Nginx for deployment.

---

Need a quick tour of all pages? Check the generated documentation inside `frontend/site-organization.txt` or ping the team with questions. Happy exploring! 🎒🕌✈️
