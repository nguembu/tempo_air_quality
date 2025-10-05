# backend/tempo_api/tests/conftest.py
import pytest
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_client(api_client):
    user = User.objects.create_user(username='testuser', password='testpass123')
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def sample_location():
    return Point(2.3522, 48.8566, srid=4326)