from django.apps import AppConfig

class TempoApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tempo_api'
    
    def ready(self):
        # Import des signaux si vous en avez
        # import tempo_api.signals
        pass