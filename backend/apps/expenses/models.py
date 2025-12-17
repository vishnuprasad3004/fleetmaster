from django.db import models

from apps.common.models import StateOffice, TimeStampedModel
from apps.vehicles.models import Vehicle


class FuelLog(TimeStampedModel):
    state_office = models.ForeignKey(StateOffice, on_delete=models.PROTECT, related_name="fuel_logs")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name="fuel_logs")

    filled_at = models.DateTimeField()
    liters = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    odometer_km = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["state_office", "filled_at"]),
        ]
