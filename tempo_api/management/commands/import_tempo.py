# tempo_api/management/commands/import_tempo.py
import os
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from tempo_api.models import TempoSatelliteData
import earthaccess
import xarray as xr
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = "Télécharge des granules TEMPO depuis Earthdata et les insère en base."

    def add_arguments(self, parser):
        parser.add_argument("--start", required=False, help="YYYY-MM-DD", default=None)
        parser.add_argument("--end", required=False, help="YYYY-MM-DD", default=None)
        parser.add_argument("--short-name", required=False, default="TEMPO", help="short_name du dataset dans le CMR")

    def handle(self, *args, **options):
        start = options['start']
        end = options['end']
        short_name = options['short_name']

        # 1) login (earthaccess gère EDL)
        # earthaccess.login() lira EDL_USERNAME / EDL_PASSWORD de l'environnement si non fournis
        earthaccess.login()

        # 2) rechercher la collection TEMPO (ou utiliser le concept_id si tu l'as)
        datasets = earthaccess.search_datasets(short_name=short_name, count=10)
        if len(datasets) == 0:
            self.stdout.write(self.style.ERROR("Aucune collection trouvée pour " + short_name))
            return
        collection = datasets[0]
        collection_id = collection['concept_id']
        self.stdout.write(f"Collection trouvée: {collection.get('title')} ({collection_id})")

        # 3) définir période par défaut = aujourd'hui -1 jour
        if not start:
            start = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
        if not end:
            end = datetime.utcnow().strftime("%Y-%m-%d")

        # 4) chercher les granules
        granules = earthaccess.search_data(collection_concept_id=collection_id, temporal=(start, end), count=100)
        self.stdout.write(f"{len(granules)} granules trouvés")

        # 5) télécharger / ouvrir et extraire variables pertinentes
        downloads = earthaccess.download(granules, local_path="/tmp/tempo_downloads")
        for local_file in downloads:
            self.stdout.write("Traitement: " + str(local_file))
            try:
                ds = xr.open_dataset(local_file, engine="netcdf4")  # ou engine approprié
                # Inspecte ds variables: print(ds)
                # Exemple: si ds contient 'nitrogendioxide_column_number_density' (NO2)
                if 'nitrogendioxide_column_number_density' in ds.variables:
                    no2 = ds['nitrogendioxide_column_number_density'].values
                else:
                    no2 = None

                # Exemple simplifié: extraire centre géographique du produit
                if 'latitude' in ds.coords and 'longitude' in ds.coords:
                    lat = float(ds['latitude'].mean().values)
                    lon = float(ds['longitude'].mean().values)
                    pt = Point(lon, lat, srid=4326)
                else:
                    pt = None

                # Enregistrer dans la BD (prendre des agrégations si nécessaire)
                TempoSatelliteData.objects.create(
                    timestamp = getattr(ds, 'time', None) or datetime.utcnow(),
                    location = pt,
                    no2 = float(no2.mean()) if (no2 is not None) else None,
                    o3 = None, # pareille : extraire si présent
                    co = None,
                    so2 = None,
                    source_url = local_file,
                    data_quality = 1.0
                )
            except Exception as e:
                self.stderr.write(f"Erreur traitement {local_file}: {e}")
