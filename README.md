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
│   frontend/
├── ├── banner.png
├── eslint.config.js
├── .gitignore
├── index.html
├── LICENSE.md
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── favicon.png
│   └── images
│       ├── brand
│       │   ├── brand-01.svg
│       │   ├── brand-02.svg
│       │   ├── brand-03.svg
│       │   ├── brand-04.svg
│       │   ├── brand-05.svg
│       │   ├── brand-06.svg
│       │   ├── brand-07.svg
│       │   ├── brand-08.svg
│       │   ├── brand-09.svg
│       │   ├── brand-10.svg
│       │   ├── brand-11.svg
│       │   ├── brand-12.svg
│       │   ├── brand-13.svg
│       │   ├── brand-14.svg
│       │   └── brand-15.svg
│       ├── cards
│       │   ├── card-01.jpg
│       │   ├── card-01.png
│       │   ├── card-02.jpg
│       │   ├── card-02.png
│       │   ├── card-03.jpg
│       │   └── card-03.png
│       ├── carousel
│       │   ├── carousel-01.png
│       │   ├── carousel-02.png
│       │   ├── carousel-03.png
│       │   └── carousel-04.png
│       ├── chat
│       │   └── chat.jpg
│       ├── country
│       │   ├── country-01.svg
│       │   ├── country-02.svg
│       │   ├── country-03.svg
│       │   ├── country-04.svg
│       │   ├── country-05.svg
│       │   ├── country-06.svg
│       │   ├── country-07.svg
│       │   └── country-08.svg
│       ├── error
│       │   ├── 404-dark.svg
│       │   ├── 404.svg
│       │   ├── 500-dark.svg
│       │   ├── 500.svg
│       │   ├── 503-dark.svg
│       │   ├── 503.svg
│       │   ├── maintenance-dark.svg
│       │   ├── maintenance.svg
│       │   ├── success-dark.svg
│       │   └── success.svg
│       ├── favicon.ico
│       ├── grid-image
│       │   ├── image-01.png
│       │   ├── image-02.png
│       │   ├── image-03.png
│       │   ├── image-04.png
│       │   ├── image-05.png
│       │   └── image-06.png
│       ├── icons
│       │   ├── file-image-dark.svg
│       │   ├── file-image.svg
│       │   ├── file-pdf-dark.svg
│       │   ├── file-pdf.svg
│       │   ├── file-video-dark.svg
│       │   └── file-video.svg
│       ├── logo
│       │   ├── auth-logo.svg
│       │   ├── logo-dark.svg
│       │   ├── logo-icon.svg
│       │   └── logo.svg
│       ├── product
│       │   ├── product-01.jpg
│       │   ├── product-02.jpg
│       │   ├── product-03.jpg
│       │   ├── product-04.jpg
│       │   └── product-05.jpg
│       ├── shape
│       │   └── grid-01.svg
│       ├── task
│       │   ├── google-drive.svg
│       │   ├── pdf.svg
│       │   ├── task.jpg
│       │   └── task.png
│       ├── user
│       │   ├── owner.jpg
│       │   ├── user-01.jpg
│       │   ├── user-02.jpg
│       │   ├── user-03.jpg
│       │   ├── user-04.jpg
│       │   ├── user-05.jpg
│       │   ├── user-06.jpg
│       │   ├── user-07.jpg
│       │   ├── user-08.jpg
│       │   ├── user-09.jpg
│       │   ├── user-10.jpg
│       │   ├── user-11.jpg
│       │   ├── user-12.jpg
│       │   ├── user-13.jpg
│       │   ├── user-14.jpg
│       │   ├── user-15.jpg
│       │   ├── user-16.jpg
│       │   ├── user-17.jpg
│       │   ├── user-18.jpg
│       │   ├── user-19.jpg
│       │   ├── user-20.jpg
│       │   ├── user-21.jpg
│       │   ├── user-22.jpg
│       │   ├── user-23.jpg
│       │   ├── user-24.jpg
│       │   ├── user-25.jpg
│       │   ├── user-26.jpg
│       │   ├── user-27.jpg
│       │   ├── user-28.jpg
│       │   ├── user-29.jpg
│       │   ├── user-30.jpg
│       │   ├── user-31.jpg
│       │   ├── user-32.jpg
│       │   ├── user-33.jpg
│       │   ├── user-34.jpg
│       │   ├── user-35.jpg
│       │   ├── user-36.jpg
│       │   └── user-37.jpg
│       └── video-thumb
│           ├── thumb-16.png
│           └── youtube-icon-84.svg
├── README.md
├── src
│   ├── api
│   │   ├── airQualityAlert.ts
│   │   ├── airQualityApi.ts
│   │   ├── airQualityForecast.ts
│   │   ├── satelliteObservation.ts
│   │   └── weather.ts
│   ├── App.tsx
│   ├── components
│   │   ├── common
│   │   │   ├── ChartTab.tsx
│   │   │   ├── ComponentCard.tsx
│   │   │   ├── GridShape.tsx
│   │   │   ├── PageBreadCrumb.tsx
│   │   │   ├── PageMeta.tsx
│   │   │   ├── ScrollToTop.tsx
│   │   │   ├── ThemeToggleButton.tsx
│   │   │   └── ThemeTogglerTwo.tsx
│   │   ├── form
│   │   │   ├── date-picker.tsx
│   │   │   ├── form-elements
│   │   │   │   ├── CheckboxComponents.tsx
│   │   │   │   ├── DefaultInputs.tsx
│   │   │   │   ├── DropZone.tsx
│   │   │   │   ├── FileInputExample.tsx
│   │   │   │   ├── InputGroup.tsx
│   │   │   │   ├── InputStates.tsx
│   │   │   │   ├── RadioButtons.tsx
│   │   │   │   ├── SelectInputs.tsx
│   │   │   │   ├── TextAreaInput.tsx
│   │   │   │   └── ToggleSwitch.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── group-input
│   │   │   │   └── PhoneInput.tsx
│   │   │   ├── input
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── FileInput.tsx
│   │   │   │   ├── InputField.tsx
│   │   │   │   ├── RadioSm.tsx
│   │   │   │   ├── Radio.tsx
│   │   │   │   └── TextArea.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── MultiSelect.tsx
│   │   │   ├── Select.tsx
│   │   │   └── switch
│   │   │       └── Switch.tsx
│   │   ├── header
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   └── UserDropdown.tsx
│   │   ├── modules
│   │   │   ├── AirQualityAlerts.tsx
│   │   │   ├── AirQualityForecast.tsx
│   │   │   ├── AQIChart.tsx
│   │   │   ├── CurrentAirQuality.tsx
│   │   │   ├── TEMPOSatelliteObservations.tsx
│   │   │   └── WeatherOverview.tsx
│   │   ├── tables
│   │   │   └── BasicTables
│   │   │       └── BasicTableOne.tsx
│   │   └── ui
│   │       ├── alert
│   │       │   └── Alert.tsx
│   │       ├── avatar
│   │       │   └── Avatar.tsx
│   │       ├── badge
│   │       │   └── Badge.tsx
│   │       ├── button
│   │       │   └── Button.tsx
│   │       ├── dropdown
│   │       │   ├── DropdownItem.tsx
│   │       │   └── Dropdown.tsx
│   │       ├── images
│   │       │   ├── ResponsiveImage.tsx
│   │       │   ├── ThreeColumnImageGrid.tsx
│   │       │   └── TwoColumnImageGrid.tsx
│   │       ├── modal
│   │       │   └── index.tsx
│   │       ├── table
│   │       │   └── index.tsx
│   │       └── videos
│   │           ├── AspectRatioVideo.tsx
│   │           ├── FourIsToThree.tsx
│   │           ├── OneIsToOne.tsx
│   │           ├── SixteenIsToNine.tsx
│   │           └── TwentyOneIsToNine.tsx
│   ├── context
│   │   ├── SidebarContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks
│   │   ├── useGoBack.ts
│   │   └── useModal.ts
│   ├── icons
│   │   ├── alert-hexa.svg
│   │   ├── alert.svg
│   │   ├── angle-down.svg
│   │   ├── angle-left.svg
│   │   ├── angle-right.svg
│   │   ├── angle-up.svg
│   │   ├── arrow-down.svg
│   │   ├── arrow-right.svg
│   │   ├── arrow-up.svg
│   │   ├── audio.svg
│   │   ├── bolt.svg
│   │   ├── box-cube.svg
│   │   ├── box-line.svg
│   │   ├── box.svg
│   │   ├── calendar.svg
│   │   ├── calender-line.svg
│   │   ├── chat.svg
│   │   ├── check-circle.svg
│   │   ├── check-line.svg
│   │   ├── chevron-down.svg
│   │   ├── chevron-left.svg
│   │   ├── chevron-up.svg
│   │   ├── close-line.svg
│   │   ├── close.svg
│   │   ├── copy.svg
│   │   ├── docs.svg
│   │   ├── dollar-line.svg
│   │   ├── download.svg
│   │   ├── envelope.svg
│   │   ├── eye-close.svg
│   │   ├── eye.svg
│   │   ├── file.svg
│   │   ├── folder.svg
│   │   ├── grid.svg
│   │   ├── group.svg
│   │   ├── horizontal-dots.svg
│   │   ├── index.ts
│   │   ├── info-error.svg
│   │   ├── info-hexa.svg
│   │   ├── info.svg
│   │   ├── list.svg
│   │   ├── lock.svg
│   │   ├── mail-line.svg
│   │   ├── moredot.svg
│   │   ├── page.svg
│   │   ├── paper-plane.svg
│   │   ├── pencil.svg
│   │   ├── pie-chart.svg
│   │   ├── plug-in.svg
│   │   ├── plus.svg
│   │   ├── shooting-star.svg
│   │   ├── table.svg
│   │   ├── task-icon.svg
│   │   ├── time.svg
│   │   ├── trash.svg
│   │   ├── user-circle.svg
│   │   ├── user-line.svg
│   │   └── videos.svg
│   ├── index.css
│   ├── layout
│   │   ├── AppHeader.tsx
│   │   └── AppLayout.tsx
│   ├── main.tsx
│   ├── pages
│   │   ├── Blank.tsx
│   │   ├── Dashboard
│   │   │   └── Home.tsx
│   │   └── OtherPage
│   │       └── NotFound.tsx
│   ├── svg.d.ts
│   ├── utils
│   │   └── Intl.DateTimeFormat.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
|
|
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
git clone https://github.com/nguembu/tempo_air_quality
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
