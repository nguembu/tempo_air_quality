# backend/tempo_api/serializers.py - VERSION CORRIGÉE
from rest_framework import serializers
from .models import *

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'city', 'alert_threshold']
        # Supprimez 'location' si non essentiel

class WeatherDataSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    
    class Meta:
        model = WeatherData
        fields = [
            'id', 'timestamp', 'latitude', 'longitude',
            'temperature', 'humidity', 'wind_speed', 'pressure'
        ]
    
    def get_latitude(self, obj):
        return obj.location.y if obj.location else None
    
    def get_longitude(self, obj):
        return obj.location.x if obj.location else None

class TempoSatelliteDataSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    
    class Meta:
        model = TempoSatelliteData
        fields = [
            'id', 'timestamp', 'latitude', 'longitude',
            'no2', 'o3', 'so2', 'co'
        ]
    
    def get_latitude(self, obj):
        return obj.location.y if obj.location else None
    
    def get_longitude(self, obj):
        return obj.location.x if obj.location else None
# VÉRIFIEZ votre serializer actuel - IL DOIT ÊTRE :
class AirQualityMeasurementSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    aqi_level_display = serializers.CharField(source='get_aqi_level_display', read_only=True)
    
    class Meta:
        model = AirQualityMeasurement
        fields = [
            'id', 'timestamp', 'latitude', 'longitude', 
            'aqi', 'aqi_level', 'aqi_level_display',
            'pm25', 'no2', 'o3', 'so2'
        ]  # ✅ CHAMPS EXPLICITES SEULEMENT
    
    def get_latitude(self, obj):
        return obj.location.y if obj.location else None
    
    def get_longitude(self, obj):
        return obj.location.x if obj.location else None
    

class PredictionSerializer(serializers.ModelSerializer):
    measurement_id = serializers.IntegerField(source='measurement.id', read_only=True)
    
    class Meta:
        model = Prediction
        fields = [
            'id', 'predicted_aqi', 'model_version', 
            'predicted_for', 'created_at', 'measurement_id'
        ]
# tempo_api/serializers.py - CORRECTION CRITIQUE
class AlertSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Alert
        fields = ['id', 'username', 'aqi_value', 'alert_level', 
                 'message', 'timestamp', 'is_read']
    
    def get_username(self, obj):
        """Méthode ultra-sécurisée"""
        try:
            # Vérifications en cascade pour éviter toute erreur
            if hasattr(obj, 'user') and obj.user:
                if hasattr(obj.user, 'user') and obj.user.user:
                    if hasattr(obj.user.user, 'username'):
                        return obj.user.user.username
            return "Unknown"
        except Exception:
            return "Unknown"
