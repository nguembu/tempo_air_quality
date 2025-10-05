from django.test import TestCase
from django.contrib.gis.geos import Point
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import json

from tempo_api.models import (
    WeatherData, TempoSatelliteData, AirQualityMeasurement, 
    Prediction, Alert, UserProfile
)
from tempo_api.views import AirQualityMeasurementViewSet


class WeatherDataViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Créer des données de test
        self.weather_data = WeatherData.objects.create(
            location=Point(2.3522, 48.8566),  # Paris
            temperature=22.5,
            humidity=65.0,
            wind_speed=15.0,
            pressure=1013.25
        )

    def test_list_weather_data(self):
        """Test la liste des données météo"""
        response = self.client.get('/api/weather/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_weather_by_timestamp(self):
        """Test le filtrage par timestamp"""
        url = f'/api/weather/?timestamp={self.weather_data.timestamp.date()}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_weather_by_temperature(self):
        """Test la recherche par température"""
        response = self.client.get('/api/weather/?search=22.5')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TempoSatelliteDataViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.tempo_data = TempoSatelliteData.objects.create(
            location=Point(2.3522, 48.8566),
            no2=15.5,
            o3=45.2,
            so2=8.3
        )

    def test_list_tempo_data(self):
        """Test la liste des données satellite"""
        response = self.client.get('/api/tempo/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_tempo_by_pollutants(self):
        """Test la recherche par polluants"""
        response = self.client.get('/api/tempo/?search=15.5')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AirQualityMeasurementViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5,
            pm25=25.3,
            no2=12.1,
            o3=35.4,
            aqi_level=1  # Modéré
        )

    def test_list_air_quality_data(self):
        """Test la liste des mesures de qualité d'air"""
        response = self.client.get('/api/airquality/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertTrue(len(response.data['results']) <= 20)

    def test_air_quality_data_structure(self):
        """Test la structure des données retournées"""
        response = self.client.get('/api/airquality/')
        data = response.data['results'][0]
        
        self.assertIn('id', data)
        self.assertIn('aqi', data)
        self.assertIn('pm25', data)
        self.assertIn('latitude', data)
        self.assertIn('longitude', data)

    def test_air_quality_fallback_mode(self):
        """Test le mode fallback en cas d'erreur"""
        # Simuler une erreur en modifiant temporairement la méthode
        original_method = AirQualityMeasurementViewSet.list
        def mock_list(*args, **kwargs):
            raise Exception("Test error")
        
        AirQualityMeasurementViewSet.list = mock_list
        response = self.client.get('/api/airquality/')
        AirQualityMeasurementViewSet.list = original_method
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'simple_mode')


class PredictionViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5
        )
        self.prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            model_version='v1.0',
            predicted_for=timezone.now() + timedelta(hours=24)
        )

    def test_list_predictions(self):
        """Test la liste des prédictions"""
        response = self.client.get('/api/predictions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_predictions_by_model_version(self):
        """Test le filtrage par version de modèle"""
        response = self.client.get('/api/predictions/?model_version=v1.0')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AlertViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.user_profile = UserProfile.objects.create(user=self.user, city='Paris')
        
        self.alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Alerte qualité air mauvaise'
        )

    def test_list_alerts(self):
        """Test la liste des alertes"""
        response = self.client.get('/api/alerts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

    def test_alert_data_structure(self):
        """Test la structure des données d'alerte"""
        response = self.client.get('/api/alerts/')
        if response.data['alerts']:
            alert_data = response.data['alerts'][0]
            self.assertIn('id', alert_data)
            self.assertIn('aqi_value', alert_data)
            self.assertIn('alert_level', alert_data)
            self.assertIn('timestamp', alert_data)


class CurrentAirQualityAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),  # Paris
            aqi=65.5,
            pm25=20.1,
            no2=10.5,
            o3=30.2,
            aqi_level=1
        )

    def test_current_air_quality_with_coordinates(self):
        """Test la qualité d'air actuelle avec coordonnées"""
        response = self.client.get('/api/current-aqi/?lat=48.8566&lon=2.3522')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('average_aqi', response.data)
        self.assertIn('closest_measurement', response.data)

    def test_current_air_quality_without_coordinates(self):
        """Test la qualité d'air actuelle sans coordonnées"""
        response = self.client.get('/api/current-aqi/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_current_air_quality_invalid_coordinates(self):
        """Test avec coordonnées invalides"""
        response = self.client.get('/api/current-aqi/?lat=invalid&lon=invalid')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_current_air_quality_no_data(self):
        """Test quand aucune donnée n'est disponible"""
        # Supprimer toutes les données
        AirQualityMeasurement.objects.all().delete()
        response = self.client.get('/api/current-aqi/?lat=40.7128&lon=-74.0060')  # New York
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CheckAirQualityAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=145.7,
            pm25=28.8,
            no2=15.2,
            o3=45.1,
            aqi_level=2  # Mauvais
        )

    def test_check_air_quality_success(self):
        """Test la vérification de qualité d'air"""
        data = {
            'latitude': 48.8566,
            'longitude': 2.3522
        }
        response = self.client.post('/api/check-aqi/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('measurement', response.data)
        self.assertIn('alert', response.data)  # Doit avoir une alerte car AQI > 100

    def test_check_air_quality_missing_coordinates(self):
        """Test avec coordonnées manquantes"""
        response = self.client.post('/api/check-aqi/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_air_quality_invalid_coordinates(self):
        """Test avec coordonnées invalides"""
        data = {
            'latitude': 'invalid',
            'longitude': 'invalid'
        }
        response = self.client.post('/api/check-aqi/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_air_quality_no_measurements(self):
        """Test quand aucune mesure n'est trouvée"""
        AirQualityMeasurement.objects.all().delete()
        data = {
            'latitude': 40.7128,  # New York
            'longitude': -74.0060
        }
        response = self.client.post('/api/check-aqi/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class HealthCheckAPITests(APITestCase):
    def test_health_check(self):
        """Test le endpoint de santé"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertIn('database', response.data)
        self.assertIn('cache', response.data)
        self.assertIn('timestamp', response.data)


class ApiDocumentationTests(APITestCase):
    def test_api_documentation(self):
        """Test la documentation de l'API"""
        response = self.client.get('/api/docs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('endpoints', response.data)
        self.assertIn('name', response.data)
        self.assertEqual(response.data['name'], '🌍 NASA TEMPO Air Quality API')


class PredicViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.aq_measurement = AirQualityMeasurement.objects.create(
            location=Point(2.3522, 48.8566),
            aqi=75.5
        )
        self.prediction = Prediction.objects.create(
            measurement=self.aq_measurement,
            predicted_aqi=80.2,
            model_version='v1.0',
            predicted_for=timezone.now() + timedelta(hours=24)
        )

    def test_predic_view_success(self):
        """Test le endpoint predic en GET"""
        response = self.client.get('/api/predic/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertTrue(len(response.data['predictions']) <= 15)

    def test_predic_view_structure(self):
        """Test la structure des données de prédiction"""
        response = self.client.get('/api/predic/')
        if response.data['predictions']:
            pred_data = response.data['predictions'][0]
            self.assertIn('id', pred_data)
            self.assertIn('predicted_aqi', pred_data)
            self.assertIn('model_version', pred_data)
            self.assertIn('created_at', pred_data)


class TaskStatusViewTests(APITestCase):
    def test_task_status_view(self):
        """Test le endpoint de statut de tâche"""
        response = self.client.get('/api/task/test-task-id/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('task_id', response.data)
        self.assertIn('status', response.data)


class DebugEndpointsTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password')
        self.user_profile = UserProfile.objects.create(user=self.user)
        self.alert = Alert.objects.create(
            user=self.user_profile,
            aqi_value=150.5,
            alert_level='unhealthy',
            message='Test alert'
        )

    def test_debug_alerts(self):
        """Test le endpoint de debug des alertes"""
        response = self.client.get('/api/debug-alerts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['database_accessible'])

    def test_alerts_simple(self):
        """Test le endpoint simplifié des alertes"""
        response = self.client.get('/api/alerts-simple/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'simple_mode')

    def test_test_airquality_simple(self):
        """Test le endpoint simplifié airquality"""
        response = self.client.get('/api/test-airquality-simple/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')