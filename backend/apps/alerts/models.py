from django.db import models

from apps.common.models import StateOffice, TimeStampedModel
from apps.drivers.models import Driver
from apps.vehicles.models import Vehicle


class AlertType(models.TextChoices):
    DOCUMENT_EXPIRY = "DOCUMENT_EXPIRY", "Document Expiry"
    VEHICLE_HEALTH = "VEHICLE_HEALTH", "Vehicle Health"
    GPS_ANOMALY = "GPS_ANOMALY", "GPS Anomaly"
    DRIVER_RISK = "DRIVER_RISK", "Driver Risk"


class AlertSeverity(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class Alert(TimeStampedModel):
    state_office = models.ForeignKey(StateOffice, on_delete=models.PROTECT, related_name="alerts")
    assignee = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_alerts",
    )
    alert_type = models.CharField(max_length=32, choices=AlertType.choices)
    severity = models.CharField(max_length=16, choices=AlertSeverity.choices, default=AlertSeverity.MEDIUM)

    # Used by background jobs to ensure idempotent (audit-safe) alert generation.
    # Example: "DOC_EXPIRY:INSURANCE:VEHICLE:123".
    dedup_key = models.CharField(max_length=255, blank=True, db_index=True)

    title = models.CharField(max_length=256)
    message = models.TextField(blank=True)
    context = models.JSONField(default=dict, blank=True)

    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name="alerts")
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name="alerts")

    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["state_office", "alert_type", "severity", "is_resolved"]),
            models.Index(fields=["state_office", "dedup_key"]),
        ]
        constraints = [
            models.UniqueConstraint(fields=["state_office", "dedup_key"], name="uniq_alert_state_dedup_key"),
        ]
