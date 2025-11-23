# 1) Use official PHP image with required extensions
FROM php:8.2-fpm

# 2) Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# 3) Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4) Set working directory
WORKDIR /var/www

# 5) Copy Laravel backend
COPY backend/ /var/www/

# 6) Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# 7) Permissions for Laravel storage/cache
RUN chmod -R 777 storage bootstrap/cache

# 8) Expose Laravel port
EXPOSE 8000

# 9) Auto-run migrations then start Laravel server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000
