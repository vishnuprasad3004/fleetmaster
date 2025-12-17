from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.api.permissions import StateScopedObjectPermission
from apps.api.scoping import filter_by_state_office

from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, StateScopedObjectPermission]

    def get_queryset(self):
        qs = Booking.objects.select_related("vehicle", "driver", "state_office").all().order_by("-scheduled_start_at")
        return filter_by_state_office(qs, self.request.user, field_name="state_office")

    def perform_create(self, serializer):
        if getattr(self.request.user, "is_owner", False):
            serializer.save()
            return
        state_id = getattr(self.request.user, "state_office_id", None)
        if state_id is None:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("state_office is required")

        vehicle = serializer.validated_data.get("vehicle")
        driver = serializer.validated_data.get("driver")
        if vehicle and vehicle.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state vehicle assignment is forbidden")
        if driver and driver.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state driver assignment is forbidden")

        serializer.save(state_office_id=state_id)

    def perform_destroy(self, instance):
        # Booking policy (Fleet Manager): may not delete bookings.
        if getattr(self.request.user, "is_fleet_manager", False):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Fleet managers cannot delete bookings")
        return super().perform_destroy(instance)

    def perform_update(self, serializer):
        if getattr(self.request.user, "is_owner", False):
            serializer.save()
            return
        state_id = getattr(self.request.user, "state_office_id", None)
        if state_id is None:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("state_office is required")

        vehicle = serializer.validated_data.get("vehicle", getattr(serializer.instance, "vehicle", None))
        driver = serializer.validated_data.get("driver", getattr(serializer.instance, "driver", None))
        if vehicle and vehicle.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state vehicle assignment is forbidden")
        if driver and driver.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state driver assignment is forbidden")

        serializer.save(state_office_id=state_id)
