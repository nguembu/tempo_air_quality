from django.test import TestCase
from django.contrib.gis.geos import Point
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone

from tempo_api.models import (
    UserProfile, WeatherData, TempoSatelliteData, 
    AirQualityMeasurement, Prediction, Alert
)


class UserProfileModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_user_profile(self):
        """Test la création d'un profil utilisateur"""
        profile = UserProfile.objects.create(
            user=self.user,
            city='Paris',
            location=Point(2.3522, 48.8566),
            alert_threshold=120.0
        )
        
        self.assertEqual(profile.user.username, 'testuser')
        self.assertEqual(profile.city, 'Paris')
        self.assertEqual(profile.alert_threshold, 120.0)
        self.assertIsNotNone(profile.location)

    def test_user_profile_string_representation(self):
        """Test la représentation en string du profil"""
        profile = UserProfile.objects.create(user=self.user)
        self.assertEqual(str(profile), 'testuser')

    def test_user_profile_default_alert_threshold(self):
        """Test la valeur par défaut du seuil d'alerte"""
        profile = UserProfile.objects.create(user=self.user)
        self.assertEqual(profile.alert_threshold, 100.0)


class WeatherDataModelTests(TestCase):
    def test_create_weather_data(self):
        """Test la création de données météo"""
        weather_data = WeatherData.objects.create(
            location=Point(2.3522, 48.8566),
            temperature=22.5,
            humidity=65.0,
            wind_speed=15.0,
            pressure=1013.25
        )
        
        self.assertEqual(weather_data.temperature, 22.5)
        self.assertEqual(weather_data.humidity, 65.0)
        self.assertEqual(weather_data.wind_speed, 15.0)
        self.assertEqual(weather_data.pressure, 1013.25)
        self.assertIsNotNone(weather_data.timestamp)

    def test_weather_data_indexes(self):
        """Test que les indexes sont bien définis"""
        indexes = WeatherData._meta.indexes
        self.assertTrue(any('timestamp' in str(idx) for idx in indexes))


class TempoSatelliteDataModelTests(TestCase):
    def test_create_tempo_satellite_data(self):
        """Test la création de données satellite TEMPO"""
        tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566),
            no2=15.5,
            o3=45.2,
            so2=8.3,
            co=0.5,
            source_url='https://example.com/data',
            data_quality=0.95
        )
        
        self.assertEqual(tempo_data.no2, 15.5)
        self.assertEqual(tempo_data.o3, 45.2)
        self.assertEqual(tempo_data.so2, 8.3)
        self.assertEqual(tempo_data.co, 0.5)
        self.assertEqual(tempo_data.data_quality, 0.95)
        self.assertIsNotNone(tempo_data.timestamp)

    def test_tempo_data_null_fields(self):
        """Test que les champs optionnels peuvent être nuls"""
        tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566)
        )
        
        self.assertIsNone(tempo_data.no2)
        self.assertIsNone(tempo_data.o3)
        self.assertIsNone(tempo_data.so2)
        self.assertIsNone(tempo_data.co)


class AirQualityMeasurementModelTests(TestCase):
    def setUp(self):
        self.weather_data = WeatherData.objects.create(
            location=Point(2.3522, 48.8566),
            temperature=22.5,
            humidity=65.0,
            wind_speed=15.0,
            pressure=1013.25
        )
        
        self.tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566),
            no2=15.5,
            o3=45.2
        )

    def test_create_air_quality_measurement(self):
        """Test la création d'une mesure de qualité d'air"""
        aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            no2=12.1,
            o3=35.4,
            pm25=25.3,
            aqi=75.5,
            aqi_level=1,  # Modéré
            weather=self.weather_data,
            tempo_data=self.tempo_data
        )
        
        self.assertEqual(aq_measurement.aqi, 75.5)
        self.assertEqual(aq_measurement.pm25, 25.3)
        self.assertEqual(aq_measurement.aqi_level, 1)
        self.assertEqual(aq_measurement.get_aqi_level_display(), 'Modéré')
        self.assertIsNotNone(aq_measurement.timestamp)

    def test_aqi_level_choices(self):
        """Test les choix disponibles pour aqi_level"""
        aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=150.0,
            aqi_level=2  # Mauvais
        )
        
        self.assertEqual(aq_measurement.get_aqi_level_display(), 'Mauvais')

    def test_air_quality_measurement_without_relations(self):
        """Test la création sans relations weather et tempo_data"""
        aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=65.5
        )
        
        self.assertIsNone(aq_measurement.weather)
        self.assertIsNone(aq_measurement.tempo_data)


class PredictionModelTests(TestCase):
    def setUp(self):
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5
        )

    def test_create_prediction(self):
        """Test la création d'une prédiction"""
        future_time = timezone.now() + timedelta(hours=24)
        prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            model_version='v1.0',
            predicted_for=future_time
        )
        
        self.assertEqual(prediction.predicted_aqi, 80.2)
        self.assertEqual(prediction.model_version, 'v1.0')
        self.assertEqual(prediction.measurement, self.aq_measurement)
        self.assertIsNotNone(prediction.created_at)

    def test_prediction_string_representation(self):
        """Test la représentation en string d'une prédiction"""
        prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            model_version='v1.0',
            predicted_for=timezone.now() + timedelta(hours=24)
        )
        
        expected_str = f"Prediction {prediction.id} for AQI 80.2"
        self.assertEqual(str(prediction), expected_str)

    def test_prediction_default_model_version(self):
        """Test la version de modèle par défaut"""
        prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            predicted_for=timezone.now() + timedelta(hours=24)
        )
        
        self.assertEqual(prediction.model_version, 'v1.0')


class AlertModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.user_profile = UserProfile.objects.create(user=self.user)

    def test_create_alert(self):
        """Test la création d'une alerte"""
        alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Qualité de l air mauvaise'
        )
        
        self.assertEqual(alert.aqi_value, 150.5)
        self.assertEqual(alert.alert_level, 'unhealthy')
        self.assertEqual(alert.get_alert_level_display(), 'Mauvaise')
        self.assertFalse(alert.is_read)
        self.assertIsNotNone(alert.timestamp)

    def test_alert_level_choices(self):
        """Test les choix disponibles pour alert_level"""
        alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=250.0,
            alert_level='hazardous',
            message='Qualité de l air dangereuse'
        )
        
        self.assertEqual(alert.get_alert_level_display(), 'Dangereuse')

    def test_alert_default_is_read(self):
        """Test la valeur par défaut de is_read"""
        alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Test alert'
        )
        
        self.assertFalse(alert.is_read)


class ModelRelationsTests(TestCase):
    """Tests pour les relations entre modèles"""
    
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.user_profile = UserProfile.objects.create(user=self.user)
        
        self.weather_data = WeatherData.objects.create(
            location=Point(2.3522, 48.8566),
            temperature=22.5,
            humidity=65.0
        )
        
        self.tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566),
            no2=15.5
        )
        
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5,
            weather=self.weather_data,
            tempo_data=self.tempo_data
        )

    def test_weather_data_measurements_relation(self):
        """Test la relation WeatherData -> AirQualityMeasurement"""
        measurements = self.weather_data.measurements.all()
        self.assertEqual(measurements.count(), 1)
        self.assertEqual(measurements.first(), self.aq_measurement)

    def test_tempo_data_measurements_relation(self):
        """Test la relation TempoSatelliteData -> AirQualityMeasurement"""
        measurements = self.tempo_data.measurements.all()
        self.assertEqual(measurements.count(), 1)
        self.assertEqual(measurements.first(), self.aq_measurement)

    def test_user_profile_alerts_relation(self):
        """Test la relation UserProfile -> Alert"""
        alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Test alert'
        )
        
        alerts = self.user_profile.alerts.all()
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first(), alert)

    def test_air_quality_predictions_relation(self):
        """Test la relation AirQualityMeasurement -> Prediction"""
        prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            model_version='v1.0',
            predicted_for=timezone.now() + timedelta(hours=24)
        )
        
        predictions = self.aq_measurement.predictions.all()
        self.assertEqual(predictions.count(), 1)
        self.assertEqual(predictions.first(), prediction)