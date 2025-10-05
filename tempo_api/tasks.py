from celery import shared_task
from .models import Prediction
import time
import random

@shared_task
def long_prediction_task(city):
    """
    Simule une prédiction de qualité de l’air pour une ville donnée.
    """
    time.sleep(5)  # Simulation du calcul long

    # Génération aléatoire de données
    prediction_result = {
        "city": city,
        "predicted_aqi": random.randint(10, 200),
        "status": random.choice(["Good", "Moderate", "Unhealthy"]),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }

    # Enregistrement du résultat
    prediction = Prediction.objects.create(
        city=city,
        result=prediction_result,
        status="completed"
    )
    return prediction_result
