# backend/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="🌍 NASA TEMPO Air Quality API",
        default_version='v1',
        description="""
        API pour la surveillance de la qualité de l'air basée sur les données 
        satellites **NASA TEMPO** et les mesures locales.
        """,
        terms_of_service="https://www.nasa.gov",
        contact=openapi.Contact(email="jauresnguembu@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ ton API principale
    path('api/', include('tempo_api.urls')),

    # 📘 Documentation interactive
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),

    # 🌐 Swagger UI (interface web)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

    # 📗 Redoc (autre style de doc)
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
