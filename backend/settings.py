"""
Django settings for backend project - Tempo Air Quality
Optimisé pour production et sécurité.
"""

from pathlib import Path
import os
import sys
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

# ---------------------------------------------------------
# BASE CONFIGURATION
# ---------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Sécurité
SECRET_KEY = os.getenv("SECRET_KEY", "insecure-placeholder-key")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# ---------------------------------------------------------
# APPLICATIONS DJANGO
# ---------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",  # PostGIS support
    "rest_framework",
    "corsheaders",
    "django_filters",
    "drf_yasg",
    "tempo_api",  # ton app principale
]

# ---------------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

# ---------------------------------------------------------
# TEMPLATES
# ---------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ---------------------------------------------------------
# DATABASE CONFIGURATION
# ---------------------------------------------------------
if "test" in sys.argv or "pytest" in sys.argv:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }
    DEBUG = False
    PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": os.getenv("DB_NAME", "nasa_tempo_db"),
            "USER": os.getenv("DB_USER", "nasa_user"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }

# ---------------------------------------------------------
# AUTHENTIFICATION / SÉCURITÉ
# ---------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------
# INTERNATIONALISATION
# ---------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ---------------------------------------------------------
# DJANGO REST FRAMEWORK
# ---------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "rest_framework.filters.SearchFilter",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "1000/hour",
        "burst": "60/minute",
    },
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ---------------------------------------------------------
# API EXTERNES
# ---------------------------------------------------------
NASA_API_KEY = os.getenv("NASA_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
TEMPO_API_BASE_URL = os.getenv("TEMPO_API_BASE_URL", "https://tempo-api.nasa.gov")

# ---------------------------------------------------------
# LOGGING
# ---------------------------------------------------------
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "{levelname} {asctime} {module} {message}", "style": "{"},
        "simple": {"format": "{levelname} {message}", "style": "{"},
    },
    "handlers": {
        "console": {"level": "INFO", "class": "logging.StreamHandler", "formatter": "simple"},
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": os.path.join(LOG_DIR, "nasa_tempo.log"),
            "formatter": "verbose",
        },
    },
    "loggers": {
        "tempo_api": {"handlers": ["console", "file"], "level": "INFO", "propagate": True},
        "django": {"handlers": ["console"], "level": "INFO", "propagate": True},
    },
}

# ---------------------------------------------------------
# CACHES (Redis)
# ---------------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://127.0.0.1:6379/1"),
    }
}

# ---------------------------------------------------------
# CELERY CONFIG
# ---------------------------------------------------------
CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"
CELERY_BEAT_SCHEDULE = {
    "fetch-weather-every-hour": {
        "task": "tempo_api.tasks.fetch_and_store_weather_data",
        "schedule": 3600.0,
    },
    "fetch-tempo-data-every-6-hours": {
        "task": "tempo_api.tasks.fetch_and_store_tempo_data",
        "schedule": 21600.0,
    },
    "generate-predictions-daily": {
        "task": "tempo_api.tasks.generate_daily_predictions",
        "schedule": 86400.0,
    },
}

# ---------------------------------------------------------
# TESTS
# ---------------------------------------------------------
TEST_RUNNER = "django.test.runner.DiscoverRunner"
if "test" in sys.argv:
    LOGGING["handlers"]["file"]["level"] = "CRITICAL"
    import warnings
    warnings.filterwarnings("ignore", category=RuntimeWarning)

# ---------------------------------------------------------
# DEFAULTS
# ---------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
