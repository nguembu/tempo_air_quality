# backend/tempo_api/tests/test_api_endpoints.py
import pytest
import json
from django.urls import reverse

@pytest.mark.django_db
class TestTempoAPIEndpoints:
    def test_tempo_list_endpoint(self, api_client, sample_tempo_data):
        """Test endpoint liste TEMPO"""
        url = reverse('tempo-list')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['no2'] == 2.5

    def test_tempo_detail_endpoint(self, api_client, sample_tempo_data):
        """Test endpoint détail TEMPO"""
        url = reverse('tempo-detail', args=[sample_tempo_data.id])
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.data['no2'] == 2.5
        assert response.data['o3'] == 300.0

    def test_tempo_create_endpoint(self, authenticated_client):
        """Test création données TEMPO via API"""
        url = reverse('tempo-list')
        data = {
            'location': 'POINT(2.3522 48.8566)',
            'no2': 4.0,
            'o3': 400.0,
            'so2': 1.5,
            'co': 150.0,
            'data_quality': 0.92
        }
        response = authenticated_client.post(url, data, format='json')
        
        assert response.status_code == 201
        assert response.data['no2'] == 4.0

@pytest.mark.django_db
class TestAirQualityAPIEndpoints:
    def test_airquality_list_endpoint(self, api_client, sample_aqi_measurement):
        """Test endpoint liste AQI"""
        url = reverse('airquality-list')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['aqi'] == 75.0

    def test_airquality_stats_endpoint(self, api_client, sample_aqi_measurement):
        """Test endpoint statistiques AQI"""
        url = reverse('airquality-stats')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert 'statistics' in response.data
        assert 'aqi_distribution' in response.data

    def test_airquality_recent_endpoint(self, api_client, sample_aqi_measurement):
        """Test endpoint données récentes"""
        url = reverse('airquality-recent')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert isinstance(response.data, list)

@pytest.mark.django_db
class TestCustomAPIEndpoints:
    def test_current_aqi_endpoint(self, api_client, sample_aqi_measurement):
        """Test endpoint qualité air actuelle"""
        url = reverse('current-aqi')
        response = api_client.get(url, {'lat': 48.8566, 'lon': 2.3522})
        
        assert response.status_code == 200
        assert 'average_aqi' in response.data
        assert 'closest_measurement' in response.data

    def test_current_aqi_endpoint_no_location(self, api_client, sample_aqi_measurement):
        """Test endpoint qualité air sans localisation"""
        url = reverse('current-aqi')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert 'average_aqi' in response.data

    def test_check_aqi_endpoint(self, api_client, sample_aqi_measurement):
        """Test endpoint vérification AQI"""
        url = reverse('check-aqi')
        data = {
            'latitude': 48.8566,
            'longitude': 2.3522
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == 200
        assert 'measurement' in response.data
        assert 'pollutants' in response.data

    def test_check_aqi_endpoint_missing_coords(self, api_client):
        """Test endpoint vérification AQI sans coordonnées"""
        url = reverse('check-aqi')
        response = api_client.post(url, {}, format='json')
        
        assert response.status_code == 400
        assert 'error' in response.data

    def test_health_check_endpoint(self, api_client):
        """Test endpoint santé"""
        url = reverse('health-check')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.data['status'] == 'healthy'
        assert 'database' in response.data

    def test_api_documentation_endpoint(self, api_client):
        """Test endpoint documentation"""
        url = reverse('api-docs')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert 'endpoints' in response.data
        assert 'name' in response.data