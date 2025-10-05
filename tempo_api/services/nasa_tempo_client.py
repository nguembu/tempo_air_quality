# backend/tempo_api/services/nasa_tempo_client.py
import requests
import logging
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.gis.geos import Point

# Configuration du logger sécurisée
logger = logging.getLogger('tempo_api')

class NASATempoClient:
    def __init__(self):
        self.base_url = getattr(settings, 'TEMPO_API_BASE_URL', 'https://tempo-api.nasa.gov')
        self.api_key = getattr(settings, 'NASA_API_KEY', '')
        self.session = requests.Session()
        
        # Headers communs
        self.session.headers.update({
            'User-Agent': 'NASA-TEMPO-AirQuality-App/1.0',
            'Accept': 'application/json'
        })

    def get_real_time_data(self, lat, lon, bbox=None, product_type='L2'):
        """
        Récupère les données TEMPO en temps réel
        """
        try:
            # Si pas de clé API, utiliser les données mockées
            if not self.api_key:
                logger.warning("NASA API key not set, using mock data")
                return self._get_mock_tempo_data(lat, lon)
            
            # Paramètres de la requête
            params = {
                'lat': lat,
                'lon': lon,
                'product': product_type,
                'api_key': self.api_key,
                'format': 'json'
            }
            
            if bbox:
                params['bbox'] = ','.join(map(str, bbox))
            
            # Endpoint TEMPO
            endpoint = f"{self.base_url}/api/v1/data"
            
            logger.info(f"Fetching TEMPO data for coordinates: {lat}, {lon}")
            response = self.session.get(endpoint, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            processed_data = self._process_tempo_data(data, lat, lon)
            
            return processed_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching TEMPO data: {str(e)}")
            return self._get_mock_tempo_data(lat, lon)
        except Exception as e:
            logger.error(f"Unexpected error in TEMPO client: {str(e)}")
            return None

    def _process_tempo_data(self, raw_data, lat, lon):
        """
        Traite les données brutes de TEMPO pour les normaliser
        """
        try:
            processed_data = {
                'timestamp': timezone.now(),
                'location': Point(lon, lat, srid=4326),
                'no2': raw_data.get('no2_tropospheric_column', None),
                'o3': raw_data.get('o3_total_column', None),
                'so2': raw_data.get('so2_total_column', None),
                'co': raw_data.get('co_total_column', None),
                'data_quality': raw_data.get('quality_flag', 1.0),
                'source_url': raw_data.get('granule_url', ''),
                'raw_data': raw_data
            }
            
            # Nettoyer les valeurs None
            processed_data = {k: v for k, v in processed_data.items() if v is not None}
            
            return processed_data
            
        except Exception as e:
            logger.error(f"Error processing TEMPO data: {str(e)}")
            return self._get_mock_tempo_data(lat, lon)

    def _get_mock_tempo_data(self, lat, lon):
        """
        Génère des données mockées pour le développement
        """
        import random
        
        mock_data = {
            'timestamp': timezone.now(),
            'location': Point(lon, lat, srid=4326),
            'no2': round(random.uniform(0.1, 5.0), 3),
            'o3': round(random.uniform(200, 400), 1),
            'so2': round(random.uniform(0.1, 2.0), 3),
            'co': round(random.uniform(50, 150), 1),
            'data_quality': round(random.uniform(0.8, 1.0), 2),
            'source_url': 'https://tempo.si.edu/granule/mock_data',
            'is_mock': True
        }
        
        logger.info(f"Using mock TEMPO data for development")
        return mock_data

class TempoDataService:
    def __init__(self):
        self.client = NASATempoClient()
    
    def fetch_and_store_tempo_data(self, latitude, longitude):
        """
        Récupère et stocke les données TEMPO dans la base de données
        """
        from ..models import TempoSatelliteData
        
        try:
            # Récupérer les données
            tempo_data = self.client.get_real_time_data(latitude, longitude)
            
            if tempo_data:
                # Créer l'objet en base de données
                satellite_data = TempoSatelliteData.objects.create(
                    location=tempo_data['location'],
                    no2=tempo_data.get('no2'),
                    o3=tempo_data.get('o3'),
                    so2=tempo_data.get('so2'),
                    co=tempo_data.get('co'),
                    source_url=tempo_data.get('source_url', ''),
                    data_quality=tempo_data.get('data_quality', 1.0)
                )
                
                logger.info(f"Stored TEMPO data with ID: {satellite_data.id}")
                return satellite_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error in fetch_and_store_tempo_data: {str(e)}")
            return None
    
    def fetch_data_for_multiple_locations(self, locations):
        """
        Récupère les données TEMPO pour plusieurs localisations
        """
        results = []
        for lat, lon in locations:
            data = self.fetch_and_store_tempo_data(lat, lon)
            if data:
                results.append(data)
        
        return results