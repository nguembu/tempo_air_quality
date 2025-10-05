from django.test import TestCase
from django.contrib.gis.geos import Point
from django.contrib.auth.models import User

from tempo_api.models import (
    UserProfile, WeatherData, TempoSatelliteData, 
    AirQualityMeasurement, Alert
)
from tempo_api.serializers import (
    UserProfileSerializer, WeatherDataSerializer,
    TempoSatelliteDataSerializer, AirQualityMeasurementSerializer,
    AlertSerializer
)


class UserProfileSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            city='Paris',
            location=Point(2.3522, 48.8566),
            alert_threshold=120.0
        )

    def test_user_profile_serializer(self):
        """Test la sérialisation d'un profil utilisateur"""
        serializer = UserProfileSerializer(self.profile)
        data = serializer.data
        
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertEqual(data['city'], 'Paris')
        self.assertEqual(data['alert_threshold'], 120.0)


class WeatherDataSerializerTests(TestCase):
    def setUp(self):
        self.weather_data = WeatherData.objects.create(
            location=Point(2.3522, 48.8566),
            temperature=22.5,
            humidity=65.0,
            wind_speed=15.0,
            pressure=1013.25
        )

    def test_weather_data_serializer(self):
        """Test la sérialisation des données météo"""
        serializer = WeatherDataSerializer(self.weather_data)
        data = serializer.data
        
        self.assertEqual(data['temperature'], 22.5)
        self.assertEqual(data['humidity'], 65.0)
        self.assertEqual(data['latitude'], 48.8566)
        self.assertEqual(data['longitude'], 2.3522)


class TempoSatelliteDataSerializerTests(TestCase):
    def setUp(self):
        self.tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566),
            no2=15.5,
            o3=45.2,
            so2=8.3
        )

    def test_tempo_data_serializer(self):
        """Test la sérialisation des données satellite"""
        serializer = TempoSatelliteDataSerializer(self.tempo_data)
        data = serializer.data
        
        self.assertEqual(data['no2'], 15.5)
        self.assertEqual(data['o3'], 45.2)
        self.assertEqual(data['so2'], 8.3)
        self.assertEqual(data['latitude'], 48.8566)
        self.assertEqual(data['longitude'], 2.3522)


class AirQualityMeasurementSerializerTests(TestCase):
    def setUp(self):
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5,
            pm25=25.3,
            no2=12.1,
            o3=35.4,
            aqi_level=1
        )

    def test_air_quality_serializer(self):
        """Test la sérialisation des mesures de qualité d'air"""
        serializer = AirQualityMeasurementSerializer(self.aq_measurement)
        data = serializer.data
        
        self.assertEqual(data['aqi'], 75.5)
        self.assertEqual(data['pm25'], 25.3)
        self.assertEqual(data['aqi_level'], 1)
        self.assertEqual(data['aqi_level_display'], 'Modéré')
        self.assertEqual(data['latitude'], 48.8566)
        self.assertEqual(data['longitude'], 2.3522)


class AlertSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.user_profile = UserProfile.objects.create(user=self.user)
        self.alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Qualité de l air mauvaise'
        )

    def test_alert_serializer(self):
        """Test la sérialisation des alertes"""
        serializer = AlertSerializer(self.alert)
        data = serializer.data
        
        self.assertEqual(data['aqi_value'], 150.5)
        self.assertEqual(data['alert_level'], 'unhealthy')
        self.assertIn('username', data)