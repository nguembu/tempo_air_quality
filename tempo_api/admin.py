# backend/tempo_api/admin.py

from django.contrib import admin
from .models import (
    UserProfile,
    WeatherData,
    TempoSatelliteData,
    AirQualityMeasurement,
    Prediction,
    Alert
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'alert_threshold']
    search_fields = ['user__username', 'city']

@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'get_latitude', 'get_longitude', 'temperature', 'humidity']
    list_filter = ['timestamp']
    search_fields = ['temperature']

    def get_latitude(self, obj):
        return f"{obj.location.y:.4f}" if obj.location else "N/A"
    get_latitude.short_description = 'Latitude'

    def get_longitude(self, obj):
        return f"{obj.location.x:.4f}" if obj.location else "N/A"
    get_longitude.short_description = 'Longitude'

@admin.register(TempoSatelliteData)
class TempoSatelliteDataAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'get_latitude', 'get_longitude', 'no2', 'o3', 'so2']
    list_filter = ['timestamp']

    def get_latitude(self, obj):
        return f"{obj.location.y:.4f}" if obj.location else "N/A"
    get_latitude.short_description = 'Latitude'

    def get_longitude(self, obj):
        return f"{obj.location.x:.4f}" if obj.location else "N/A"
    get_longitude.short_description = 'Longitude'

@admin.register(AirQualityMeasurement)
class AirQualityMeasurementAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'get_latitude', 'get_longitude', 'aqi', 'get_aqi_level_display', 'pm25']
    list_filter = ['timestamp', 'aqi_level']

    def get_latitude(self, obj):
        return f"{obj.location.y:.4f}" if obj.location else "N/A"
    get_latitude.short_description = 'Latitude'

    def get_longitude(self, obj):
        return f"{obj.location.x:.4f}" if obj.location else "N/A"
    get_longitude.short_description = 'Longitude'

    def get_aqi_level_display(self, obj):
        return obj.get_aqi_level_display() if obj.aqi_level else "N/A"
    get_aqi_level_display.short_description = 'Niveau AQI'

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    # Configuration minimale pour éviter les erreurs
    list_display = ['id', '__str__']  # Utilisez des champs/méthodes qui existent
    list_filter = []  # Vide temporairement

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'aqi_value', 'alert_level', 'timestamp', 'is_read']
    list_filter = ['alert_level', 'is_read', 'timestamp']
    search_fields = ['user__user__username']