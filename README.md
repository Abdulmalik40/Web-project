# Saudi Tourism Website

A comprehensive tourism website for Saudi Arabia featuring Islamic guides, prayer times, Qibla direction, and historical information. This project combines a modern frontend with a Laravel backend to provide a full-stack tourism experience.

## Project Structure

```
Web-project/
├── frontend/                    # Frontend application (HTML/CSS/JS)
│   ├── pages/                  # HTML pages
│   ├── assets/                 # Images and media
│   ├── styles/                 # CSS modules
│   ├── scripts/                # JavaScript modules
│   └── locales/                # Internationalization files
├── backend/                    # Laravel backend API
│   ├── app/                    # Application code
│   ├── database/               # Migrations and seeders
│   └── routes/                 # API routes
├── docs/                       # Project documentation
├── api.php                     # Geoapify proxy script
├── build.js                    # Build script
└── start-server.py            # Development server script
```

## Features

- 🕌 Islamic Guide and Prayer Times
- 🧭 Qibla Direction Finder
- 📖 Quran Reader
- 🏛️ Historical Timeline of Saudi Arabia
- 🏜️ Tourism Destinations (Makkah, Madinah, Riyadh, Jeddah, AlUla, and more)
- 🗺️ Interactive Maps
- 👤 User Authentication and Profiles
- 📅 Trip Planning and Itineraries
- 📱 Responsive Design
- 🌙 Dark/Light Theme Support
- 🌍 Internationalization (Arabic/English)
- ☁️ Weather Widget
- 💬 Chatbot Assistant

## Prerequisites

### Frontend Development
- Python 3.x (for development server)
- Modern web browser

### Backend Development
- PHP 8.2 or higher
- Composer
- MySQL or PostgreSQL database
- Node.js and npm (for asset compilation)

## Getting Started

### Quick Start (Frontend Only)

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdulmalik40/Web-project.git
   cd Web-project
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   python start-server.py
   ```

3. Open your browser and visit:
   ```
   http://localhost:8000/pages/
   ```

### Full Stack Development

#### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Set up database in `.env` and run migrations:
   ```bash
   php artisan migrate
   ```

5. Start the backend server:
   ```bash
   php artisan serve
   ```

See the [backend README](backend/README.md) for more detailed backend setup instructions.

## Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` directory with optimized files ready for deployment.

## Project Documentation

- [Color System Reference](docs/color-system-reference.md) - Complete color system guide
- [Saudi Cultural Colors](docs/saudi-cultural-color-reference.md) - Cultural color guidelines
- [Backend API](backend/README.md) - Backend documentation

## Technologies Used

### Frontend
- HTML5
- CSS3 (Modular Architecture with CSS Custom Properties)
- Vanilla JavaScript (ES6 Modules)
- Responsive Design
- i18n-js for Internationalization

### Backend
- Laravel 12
- PHP 8.2+
- Laravel Sanctum (Authentication)
- RESTful API Architecture

### External APIs
- Islamic Prayer Times API
- Qibla Direction API
- Quran API
- Geoapify Maps API
- Weather API

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve frontend only

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
