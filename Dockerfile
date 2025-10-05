# ---- Étape 1 : Build ----
FROM python:3.11-slim AS builder

# Installer dépendances système (GDAL, psycopg2, etc.)
RUN apt-get update && apt-get install -y \
    gdal-bin libgdal-dev gcc python3-dev curl \
    && rm -rf /var/lib/apt/lists/*

# Configurer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# ---- Étape 2 : Runtime ----
FROM python:3.11-slim

# Créer un utilisateur non root
RUN useradd -m appuser

# Installer dépendances runtime minimales
RUN apt-get update && apt-get install -y gdal-bin curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers depuis la phase de build
COPY --from=builder /usr/local /usr/local
COPY . .

# Copier le script d’entrée
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Variables d'environnement par défaut
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings
ENV PORT=8000

# Healthcheck (Render ignore souvent mais utile localement)
HEALTHCHECK CMD curl -f http://localhost:${PORT:-8000}/api/health/ || exit 1

# Utilisateur non-root
USER appuser

# Lancement de l’application
ENTRYPOINT ["/entrypoint.sh"]
