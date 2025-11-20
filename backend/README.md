# Saudi Tourism Website - Backend API

This is the backend API for the Saudi Tourism Website, built with Laravel 12.

## Overview

The backend provides RESTful APIs to support the frontend application with features including:

- User authentication and authorization
- Tourism destination data management
- Prayer times and Islamic guide APIs
- Trip planning and itinerary management
- User profile and preferences

## Technology Stack

- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL/PostgreSQL (configurable)

## Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL or PostgreSQL database
- Node.js and npm (for asset compilation)

## Installation

1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Configure your database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=saudi_tourism
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. Run database migrations:
   ```bash
   php artisan migrate
   ```

5. (Optional) Seed the database:
   ```bash
   php artisan db:seed
   ```

## Development

Start the development server:

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

For full development environment with hot-reload:

```bash
composer dev
```

This will start the Laravel server, queue worker, logging, and Vite for asset compilation.

## Testing

Run the test suite:

```bash
php artisan test
```

## API Documentation

API endpoints will be documented here as they are developed.

## Project Structure

```
backend/
├── app/              # Application code
│   ├── Http/        # Controllers and middleware
│   ├── Models/      # Eloquent models
│   └── Providers/   # Service providers
├── config/          # Configuration files
├── database/        # Migrations and seeders
├── routes/          # API routes
└── tests/           # Test files
```

## License

This project is part of the Saudi Tourism Website and is licensed under the MIT license.
