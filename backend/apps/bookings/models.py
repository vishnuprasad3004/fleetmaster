from django.db import models

from apps.common.models import StateOffice, TimeStampedModel
from apps.drivers.models import Driver
from apps.vehicles.models import Vehicle


class BookingStatus(models.TextChoices):
    PLANNED = "PLANNED", "Planned"
    IN_TRANSIT = "IN_TRANSIT", "In Transit"
    COMPLETED = "COMPLETED", "Completed"
    CANCELED = "CANCELED", "Canceled"


class Booking(TimeStampedModel):
    state_office = models.ForeignKey(StateOffice, on_delete=models.PROTECT, related_name="bookings")
    booking_code = models.CharField(max_length=32, unique=True)

    origin = models.CharField(max_length=256)
    destination = models.CharField(max_length=256)
    route_metadata = models.JSONField(default=dict, blank=True)

    load_metadata = models.JSONField(default=dict, blank=True)

    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name="bookings")
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT, related_name="bookings")

    scheduled_start_at = models.DateTimeField()
    scheduled_end_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=16, choices=BookingStatus.choices, default=BookingStatus.PLANNED)

    ai_training_payload = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["state_office", "status", "scheduled_start_at"]),
        ]
