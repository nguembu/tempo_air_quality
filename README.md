# 🌎 Tempo Air Quality

**Tempo Air Quality** est une plateforme de suivi **en temps réel de la qualité de l’air** dans les villes du monde.  
Elle combine les **données météorologiques**, les **capteurs IoT** et l’analyse environnementale pour fournir des indicateurs fiables, accessibles et visuellement attractifs sur l’état de l’air et les conditions atmosphériques locales.

---

## 🛰️ Mission & Objectif – NASA Space Apps Challenge

Ce projet s’inscrit dans la thématique **“Open Science for the Planet”** du **NASA International Space Apps Challenge**.  
**Tempo Air Quality** vise à :

- Promouvoir la **science ouverte** et la **démocratisation des données environnementales**.  
- Fournir des outils de **visualisation en temps réel** pour sensibiliser le public à la pollution atmosphérique.  
- Aider les chercheurs, décideurs et citoyens à **analyser les tendances climatiques locales et globales**.  
- Exploiter les **données ouvertes de la NASA**, de **NOAA**, et des **API météorologiques publiques** pour la surveillance continue de la qualité de l’air.

---

## ⚙️ Stack Technologique

| Couche | Technologie |
|--------|--------------|
| **Backend API** | Django REST Framework (Python 3.11) |
| **Base de données** | PostgreSQL |
| **Frontend** | React.js + TypeScript + Tailwind CSS |
| **Conteneurisation** | Docker & Docker Compose |
| **Gestion des filtres et des données** | Django Filters + Pandas |
| **Sécurité & Authentification** | JWT (SimpleJWT) |
| **Déploiement** | Docker Compose (production / staging) |
| **Tests & Monitoring** | pytest + Django test client |

---

## 📁 Structure du Projet

```
tempo_air_quality/
├── backend/
│   ├── tempo_api/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🧠 Fonctionnement du Système

1. **Collecte des données** :  
   Les capteurs IoT et les API externes (NASA, OpenWeather, AirNow) envoient des données sur la température, l’humidité, le CO₂, le NO₂, les PM2.5, etc.

2. **Traitement & Stockage** :  
   Le backend Django reçoit, nettoie et stocke les données dans la base PostgreSQL.

3. **Analyse & Agrégation** :  
   Des scripts Python calculent les moyennes, les pics et les tendances sur différentes périodes (jour, semaine, mois).

4. **Visualisation dynamique** :  
   Le frontend React.js affiche les graphiques, cartes et indices AQI en temps réel grâce à des requêtes API REST.

5. **Alertes & Recommandations** :  
   Le système peut notifier les utilisateurs lorsque les seuils de pollution sont dépassés.

---

## 🧩 Installation Locale

### 🔧 Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL
- npm ou yarn
- Git

### Étapes d’installation

#### 1️⃣ Cloner le dépôt
```bash
git clone https://github.com/ton-compte/tempo_air_quality.git
cd tempo_air_quality
```

#### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Linux/Mac)
pip install -r requirements.txt
```

Créer le fichier `.env` dans `backend/` :
```env
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/tempo_air_quality
ALLOWED_HOSTS=*
NASA_API_KEY=your_nasa_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

Appliquer les migrations :
```bash
python manage.py migrate
python manage.py runserver
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Accéder à :  
👉 Frontend : `http://localhost:5173`  
👉 Backend API : `http://localhost:8000/api/`

---

## 🐳 Installation via Docker

### 🔧 Prérequis
- Docker
- Docker Compose

### Lancer en mode production :
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Vérifier le statut :
```bash
docker ps
```

Arrêter les conteneurs :
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 📊 Endpoints Principaux de l’API

| Endpoint | Méthode | Description |
|-----------|----------|--------------|
| `/api/stations/` | GET | Liste les stations de mesure |
| `/api/airdata/` | GET | Données de qualité de l’air en temps réel |
| `/api/airdata/stats/` | GET | Statistiques agrégées |
| `/api/users/register/` | POST | Inscription utilisateur |
| `/api/users/login/` | POST | Authentification JWT |

---

## 🧪 Tests

Exécuter tous les tests backend :
```bash
pytest
```

---

## 👥 Équipe de Développement

| Nom | Rôle | Spécialité |
|------|------|-------------|
| **Jaures Nguembu** |  Développeur Backend,Tests, CI/CD |
| **Morel Tchaptche** | Développeur Frontend|
| **Steve Ndjeumou** | Data engineer |


---

## 🚀 Perspectives Futures

- Intégration de capteurs physiques IoT réels via MQTT.
- Utilisation du machine learning pour prédire les variations de la qualité de l’air.
- Ajout d’une carte interactive mondiale avec niveaux AQI.
- Dashboard d’administration avancé avec alertes configurables.

---

## 💡 Licence

Ce projet est distribué sous la licence **MIT** — open source et librement réutilisable pour la recherche et l’éducation.

---

## 🌍 Liens utiles

- [NASA Space Apps Challenge](https://www.spaceappschallenge.org/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React + TypeScript](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAQ API](https://docs.openaq.org/)

---

## 🏁 Citation

> “Open data is not just information — it’s empowerment.”  
> — *NASA Space Apps 2025 Team*
