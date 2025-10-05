#!/bin/bash

echo "🚀 Déploiement NASA Tempo API sur Render..."
echo "============================================"

# Couleurs pour le output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de logging
log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "manage.py" ] || [ ! -f "requirements.txt" ]; then
    log_error "Vous devez être dans la racine du projet Django"
    exit 1
fi

log_info "Vérification des prérequis..."

# Vérifier les fichiers nécessaires
REQUIRED_FILES=("Dockerfile" "render.yaml" ".env.production")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Fichier manquant: $file"
        exit 1
    fi
done

log_info "Tous les fichiers de configuration sont présents"

# Vérification optionnelle de Docker (mais pas obligatoire)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    log_info "Docker et Docker Compose détectés - test local possible"
    
    # Construction de l'image
    log_info "Construction de l'image Docker..."
    docker build -t nasa-tempo-api .
    
    if [ $? -eq 0 ]; then
        log_info "Image Docker construite avec succès"
        
        # Test local optionnel
        read -p "Voulez-vous tester localement avec Docker Compose? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Lancement des tests locaux..."
            docker-compose -f docker-compose.prod.yml down > /dev/null 2>&1
            docker-compose -f docker-compose.prod.yml up -d
            
            log_info "Attente du démarrage des services..."
            sleep 15
            
            # Vérification de la santé de l'API
            log_info "Vérification de la santé de l'API..."
            HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health/ || echo "000")
            
            if [ "$HEALTH_RESPONSE" = "200" ]; then
                log_info "✅ API en bonne santé (HTTP $HEALTH_RESPONSE)"
            else
                log_warning "⚠️  API répond avec HTTP $HEALTH_RESPONSE"
            fi
            
            # Arrêt des services de test
            log_info "Nettoyage des services de test..."
            docker-compose -f docker-compose.prod.yml down
        fi
    fi
else
    log_warning "Docker non installé - déploiement direct sur Render possible"
    log_info "Vous pouvez déployer directement sur Render sans test local"
fi

# Instructions pour Render
echo ""
echo "🎯 DÉPLOIEMENT SUR RENDER"
echo "=========================="
echo ""
echo "📋 PRÉREQUIS:"
echo "   • Compte Render (https://render.com)"
echo "   • Repository GitHub de votre projet"
echo ""
echo "🚀 ÉTAPES:"
echo "   1. Allez sur https://render.com"
echo "   2. Créez un compte ou connectez-vous"
echo "   3. Cliquez sur 'New +' → 'Web Service'"
echo "   4. Connectez votre repository GitHub"
echo "   5. Sélectionnez ce projet (tempo_air_quality)"
echo "   6. Render détectera automatiquement le fichier render.yaml"
echo ""
echo "⚙️  CONFIGURATION RENDER:"
echo "   • Nom du service: nasa-tempo-api"
echo "   • Plan: Free"
echo "   • Build Command: (automatique via Dockerfile)"
echo "   • Start Command: (automatique via Dockerfile)"
echo ""
echo "🔐 VARIABLES D'ENVIRONNEMENT (à configurer dans Render dashboard):"
echo "   DEBUG=0"
echo "   SECRET_KEY=vl*!l+17p8xg@^s8kd0cq5ug2ogylivy#93k=gi^#aw1p^_ys1"
echo "   ALLOWED_HOSTS=.onrender.com,.render.com,localhost,127.0.0.1"
echo "   DATABASE_URL=(Render fournira automatiquement)"
echo "   CELERY_BROKER_URL=(Render fournira automatiquement)"
echo ""
echo "🌐 VOTRE API SERA DISPONIBLE SUR:"
echo "   https://nasa-tempo-api.onrender.com"
echo ""
echo "📚 DOCUMENTATION:"
echo "   • Render Django: https://render.com/docs/deploy-django"
echo "   • Docker sur Render: https://render.com/docs/docker"
echo ""

# Vérification finale des fichiers
echo "📁 FICHIERS DE CONFIGURATION VÉRIFIÉS:"
for file in "Dockerfile" "render.yaml" ".env.production" "requirements.txt"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (MANQUANT)"
    fi
done

echo ""
log_info "Votre projet est prêt pour le déploiement sur Render!"
echo ""
echo "💡 CONSEIL: Déployez d'abord sans Docker pour tester, puis installez Docker"
echo "   pour le développement local si nécessaire."