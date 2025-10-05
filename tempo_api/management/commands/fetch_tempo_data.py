# backend/tempo_api/management/commands/fetch_tempo_data.py
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from tempo_api.services.nasa_tempo_client import TempoDataService

class Command(BaseCommand):
    help = 'Fetch real-time data from NASA TEMPO satellite'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--cities',
            nargs='+',
            help='List of cities to fetch data for (format: "Paris,48.8566,2.3522")'
        )
        parser.add_argument(
            '--auto',
            action='store_true',
            help='Fetch data for predefined major cities'
        )
    
    def handle(self, *args, **options):
        service = TempoDataService()
        
        if options['cities']:
            locations = self._parse_cities(options['cities'])
        elif options['auto']:
            locations = self._get_major_cities()
        else:
            self.stdout.write(
                self.style.ERROR('Specify --cities or --auto')
            )
            return
        
        self.stdout.write(
            self.style.SUCCESS(f'Fetching TEMPO data for {len(locations)} locations...')
        )
        
        results = service.fetch_data_for_multiple_locations(locations)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully fetched {len(results)} data points')
        )
    
    def _parse_cities(self, cities_list):
        locations = []
        for city_str in cities_list:
            try:
                name, lat, lon = city_str.split(',')
                locations.append((float(lat), float(lon)))
            except ValueError:
                self.stdout.write(
                    self.style.ERROR(f'Invalid city format: {city_str}')
                )
        return locations
    
    def _get_major_cities(self):
        """Retourne les coordonnées des grandes villes"""
        return [
            (48.8566, 2.3522),   # Paris
            (40.7128, -74.0060), # New York
            (51.5074, -0.1278),  # London
            (35.6762, 139.6503), # Tokyo
            (37.7749, -122.4194) # San Francisco
        ]