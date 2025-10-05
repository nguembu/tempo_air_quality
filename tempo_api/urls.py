# backend/tempo_api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# ==============================
# 🔹 ROUTER PRINCIPAL
# ==============================
router = DefaultRouter()
router.register(r'weather', views.WeatherDataViewSet, basename='weather')
router.register(r'tempo', views.TempoSatelliteDataViewSet, basename='tempo')
router.register(r'airquality', views.AirQualityMeasurementViewSet, basename='airquality')
router.register(r'predictions', views.PredictionViewSet, basename='predictions')
router.register(r'alerts', views.AlertViewSet, basename='alerts')

# ==============================
# 🔹 URLS PERSONNALISÉES
# ==============================
urlpatterns = [
    # Routes automatiques du router
    path('', include(router.urls)),

    # Endpoints personnalisés
    path('current-aqi/', views.current_air_quality, name='current-aqi'),
    path('check-aqi/', views.check_air_quality, name='check-aqi'),
    path('health/', views.health_check, name='health-check'),
    path('docs/', views.api_documentation, name='api-docs'),
    
    # 🔥 CORRECTION : Endpoint exact pour vos tests
    path('predic/', views.predic_view, name='predic-direct'),
    
    # Endpoints existants pour les prédictions
    path('predict/', views.PredictionView.as_view(), name='predict'),
    path('task/<str:task_id>/', views.TaskStatusView.as_view(), name='task-status'),
    path('debug-alerts/', views.debug_alerts, name='debug-alerts'),
    path('alerts-simple/', views.alerts_simple, name='alerts-simple'),
    path('test-airquality/', views.test_airquality_simple, name='test-airquality'),
]