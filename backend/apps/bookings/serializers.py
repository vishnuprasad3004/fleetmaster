from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        actor = getattr(request, "user", None)

        # Booking policy (Fleet Manager):
        # - CAN create bookings
        # - CAN update status/vehicle/driver/schedule
        # - CANNOT modify route/client/financial fields (enforced by whitelist)
        if (
            self.instance is not None
            and actor is not None
            and getattr(actor, "is_authenticated", False)
            and getattr(actor, "is_fleet_manager", False)
        ):
            allowed = {"status", "vehicle", "driver", "scheduled_start_at", "scheduled_end_at"}
            attempted = set(attrs.keys())
            disallowed = attempted - allowed
            if disallowed:
                raise PermissionDenied(f"Fleet managers may only update: {sorted(allowed)}")

        return attrs
