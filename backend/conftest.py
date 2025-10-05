# tempo_air_quality/conftest.py
import os
import django
from django.conf import settings

# Configure Django pour pytest
def pytest_configure():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    
    # Vérifier si Django est déjà configuré
    if not settings.configured:
        django.setup()