# 1) Use official PHP image with necessary extensions
FROM php:8.2-fpm

# 2) Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# 3) Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4) Set working directory inside container
WORKDIR /var/www

# 5) Copy backend folder only (Laravel)
COPY backend/ /var/www/

# 6) Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# 7) Storage permissions for Laravel
RUN chmod -R 777 storage bootstrap/cache

# 8) Expose port 8000
EXPOSE 8000

# 9) Run Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
