# Saudi Tourism Website - Copilot Instructions

## Project Overview

This is a comprehensive tourism website for Saudi Arabia featuring Islamic guides, prayer times, Qibla direction, historical information, and tourism destinations. The project uses a modern frontend with vanilla JavaScript and is structured to integrate with a Laravel backend.

## Project Architecture

### Frontend (`/frontend`)
- **Technology Stack**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Architecture**: Modular component-based structure
- **Key Features**:
  - Islamic Guide and Prayer Times
  - Qibla Direction Finder
  - Quran Reader
  - Historical Timeline
  - Tourism Destinations
  - Dark/Light Theme Support
  - Responsive Design

### Backend (`/backend`)
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: MySQL/PostgreSQL (future)
- **Purpose**: API endpoints and backend services (planned integration)

## Coding Standards & Practices

### JavaScript
- Use ES6+ features and module syntax (`import`/`export`)
- Follow modular architecture - keep components in separate files
- Use descriptive variable names (camelCase for variables, PascalCase for classes)
- Add JSDoc comments for complex functions
- Avoid global variables - use modules
- Handle errors gracefully with try-catch blocks

### CSS
- Follow modular CSS architecture
- Use CSS custom properties (variables) for theming
- Maintain responsive design principles
- Support both light and dark themes
- Use semantic class names
- Keep styles scoped to their components

### PHP/Laravel
- Follow Laravel coding standards and best practices
- Use PSR-12 coding style
- Utilize Laravel's built-in features (Eloquent, Blade, etc.)
- Write clean, testable code
- Use type hints and return types
- Follow RESTful API conventions

### HTML
- Use semantic HTML5 elements
- Ensure accessibility (ARIA labels, alt attributes)
- Maintain proper document structure
- Support internationalization where applicable

## File Organization

### Frontend Structure
```
frontend/
├── pages/          # HTML pages for different sections
├── scripts/        # JavaScript modules
├── styles/         # CSS modules
├── assets/         # Images and media files
└── config.js       # Configuration settings
```

### Backend Structure
```
backend/
├── app/            # Application code (Models, Controllers, etc.)
├── routes/         # API and web routes
├── database/       # Migrations and seeders
├── tests/          # Unit and feature tests
└── public/         # Public assets
```

## API Integration Guidelines

- When adding API endpoints, use Laravel's resource controllers
- Follow RESTful naming conventions
- Implement proper error handling and validation
- Use Laravel Sanctum for API authentication
- Return consistent JSON responses

## Islamic Features

When working with Islamic features:
- Use reliable Islamic APIs (prayer times, Qibla direction)
- Respect Islamic content and ensure accuracy
- Consider timezone handling for prayer times
- Implement proper Arabic text support (RTL when needed)

## Development Workflow

### Running the Project

**Frontend Development:**
```bash
cd frontend
python -m http.server 8000
# Visit http://localhost:8000/pages/
```

**Backend Development:**
```bash
cd backend
composer install
php artisan serve
```

**Build Process:**
```bash
npm run build
```

### Testing
- Write tests for new features
- Run tests before committing: `npm test` or `php artisan test`
- Ensure all tests pass before creating pull requests

## Best Practices

### Code Quality
- Keep functions small and focused (single responsibility)
- Avoid code duplication - create reusable components
- Use meaningful variable and function names
- Comment complex logic, not obvious code
- Handle edge cases and errors gracefully

### Performance
- Optimize images and assets
- Minimize DOM manipulations
- Use lazy loading for heavy resources
- Cache API responses where appropriate
- Minimize HTTP requests

### Security
- Sanitize user inputs
- Validate data on both frontend and backend
- Use HTTPS for API calls
- Never commit sensitive data (API keys, passwords)
- Follow OWASP security guidelines

### Accessibility
- Ensure keyboard navigation works
- Add proper ARIA labels
- Maintain good color contrast
- Support screen readers
- Test with accessibility tools

## Dependencies

### Frontend
- i18n-js: For internationalization support
- No heavy frameworks - vanilla JavaScript preferred

### Backend
- Laravel Framework 12
- Laravel Sanctum for authentication
- Laravel Tinker for debugging

## Common Tasks

### Adding a New Page
1. Create HTML file in `frontend/pages/`
2. Create corresponding JS module in `frontend/scripts/`
3. Create CSS module in `frontend/styles/`
4. Update navigation if needed
5. Test responsive design and theme support

### Adding an API Endpoint
1. Create route in `backend/routes/api.php`
2. Create controller with `php artisan make:controller`
3. Implement controller logic
4. Add validation
5. Write tests
6. Document the endpoint

### Updating Styles
1. Check if CSS variable already exists
2. Update the appropriate CSS module file
3. Test in both light and dark themes
4. Verify responsive behavior

## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Islamic APIs Documentation](relevant API docs)

## Notes for Contributors

- The project is in active development
- Backend integration is planned but not fully implemented
- Focus on modular, maintainable code
- Respect the existing architecture and patterns
- When in doubt, ask for clarification

## Future Enhancements

- Complete backend API integration
- User authentication system
- Personalized recommendations
- Multi-language support enhancement
- Progressive Web App (PWA) features
- Database integration for dynamic content
