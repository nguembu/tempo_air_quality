# backend/tempo_api/models.py
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100, null=True, blank=True)
    location = gis_models.PointField(null=True, blank=True, srid=4326)
    alert_threshold = models.FloatField(default=100.0)

    def __str__(self):
        return self.user.username

class WeatherData(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    location = gis_models.PointField(srid=4326)
    temperature = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    pressure = models.FloatField()

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),
        ]

class TempoSatelliteData(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    location = gis_models.PointField(srid=4326)
    no2 = models.FloatField(null=True, blank=True)
    o3 = models.FloatField(null=True, blank=True)
    so2 = models.FloatField(null=True, blank=True)
    co = models.FloatField(null=True, blank=True)
    source_url = models.URLField(null=True, blank=True)
    data_quality = models.FloatField(default=1.0)

class AirQualityMeasurement(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    location = gis_models.PointField(srid=4326)
    no2 = models.FloatField(null=True, blank=True)
    o3 = models.FloatField(null=True, blank=True)
    pm25 = models.FloatField(null=True, blank=True)
    aqi = models.FloatField(null=True, blank=True)
    
    AQI_LEVELS = [
        (0, 'Bon'),
        (1, 'Modéré'),
        (2, 'Mauvais'),
        (3, 'Très mauvais'),
        (4, 'Dangereux')
    ]
    aqi_level = models.IntegerField(choices=AQI_LEVELS, null=True)
    
    weather = models.ForeignKey(
        WeatherData, on_delete=models.SET_NULL, null=True, related_name="measurements"
    )
    tempo_data = models.ForeignKey(
        TempoSatelliteData, on_delete=models.SET_NULL, null=True, related_name="measurements"
    )

class Prediction(models.Model):
    # Ces champs doivent correspondre à ceux utilisés dans l'admin
    measurement = models.ForeignKey(
        'AirQualityMeasurement', 
        on_delete=models.CASCADE,
        related_name='predictions'
    )
    predicted_aqi = models.FloatField()
    model_version = models.CharField(max_length=50, default='v1.0')
    predicted_for = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction {self.id} for AQI {self.predicted_aqi}"
    
class Alert(models.Model):
    ALERT_LEVELS = [
        ('moderate', 'Modérée'),
        ('unhealthy', 'Mauvaise'),
        ('hazardous', 'Dangereuse'),
    ]
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="alerts")
    aqi_value = models.FloatField()
    alert_level = models.CharField(max_length=20, choices=ALERT_LEVELS)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)