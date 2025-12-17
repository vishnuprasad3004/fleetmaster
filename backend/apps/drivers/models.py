from django.db import models

from apps.common.models import StateOffice, TimeStampedModel


class Driver(TimeStampedModel):
    state_office = models.ForeignKey(StateOffice, on_delete=models.PROTECT, related_name="drivers")
    full_name = models.CharField(max_length=128)
    phone = models.CharField(max_length=32, blank=True)
    license_number = models.CharField(max_length=64, unique=True)
    license_expiry_date = models.DateField(null=True, blank=True)

    is_available = models.BooleanField(default=True)
    assigned_vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_drivers",
    )

    risk_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    last_risk_score_at = models.DateTimeField(null=True, blank=True)

    maintenance_prediction = models.JSONField(default=dict, blank=True)
    anomaly_flags = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return self.full_name


class DriverHealthReport(TimeStampedModel):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="health_reports")
    fatigue_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    notes = models.TextField(blank=True)
    reported_at = models.DateTimeField()


class DriverAssignment(TimeStampedModel):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="assignments")
    vehicle_id = models.BigIntegerField(null=True, blank=True)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
