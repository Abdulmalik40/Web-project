#!/bin/bash
set -e

cd /var/www/Web-project

echo "==============================="
echo "[deploy] starting deployment..."
echo "==============================="

# 1) Ensure we are on main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "[deploy] Currently on '$CURRENT_BRANCH', switching to main..."
  git checkout main
fi

# 2) Fetch latest from origin
echo "[deploy] fetching origin..."
git fetch origin main

# 3) Create backup branch from current main BEFORE reset
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="backup-${TIMESTAMP}"

echo "[deploy] creating backup branch '$BACKUP_BRANCH'..."
git branch "$BACKUP_BRANCH"
echo "[deploy] pushing backup branch to origin..."
git push origin "$BACKUP_BRANCH"

# 4) Reset local main to origin/main
echo "[deploy] resetting local main to origin/main..."
git reset --hard origin/main

# 5) Laravel maintenance
echo "[deploy] running Laravel maintenance..."
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force || echo "[deploy] migrate failed or nothing to migrate (continuing)"

# 6) Restart services (we are root -> no sudo needed)
echo "[deploy] restarting services..."
systemctl restart php8.3-fpm
systemctl reload nginx

echo "==============================="
echo "[deploy] deployment finished!"
echo "==============================="
