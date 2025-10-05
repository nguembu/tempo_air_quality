#!/bin/bash
set -e

echo "🚀 Starting Tempo Air Quality backend..."

# Appliquer les migrations
echo "➡️ Applying database migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "➡️ Collecting static files..."
python manage.py collectstatic --noinput

# Lancer le serveur gunicorn
echo "➡️ Starting Gunicorn..."
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 3 \
    --timeout 120 \
    --log-level info
