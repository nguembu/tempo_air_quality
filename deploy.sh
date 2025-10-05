#!/bin/bash

echo "🚀 Déploiement NASA Tempo API..."
echo "================================"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Vérifier que Render CLI est installé
if ! command -v render &> /dev/null; then
    echo "📥 Installation de Render CLI..."
    curl -s https://render.com/downloads/render-cli/install.sh | bash
fi

# Construction de l'image
echo "🔨 Construction de l'image Docker..."
docker build -t nasa-tempo-api .

# Test local
echo "🧪 Test local..."
docker-compose -f docker-compose.prod.yml up -d
sleep 10

# Vérification
echo "🔍 Vérification..."
curl -f http://localhost:8000/api/health/ && echo "✅ API en bonne santé"

# Déploiement sur Render
echo "🌐 Déploiement sur Render..."
render deploy

echo "🎉 Déploiement terminé!"
echo "📊 Vérifiez votre application sur: https://nasa-tempo-api.onrender.com"