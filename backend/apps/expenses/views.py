from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.api.permissions import FleetManagerReadOnly, StateScopedObjectPermission
from apps.api.scoping import filter_by_state_office

from .models import FuelLog
from .serializers import FuelLogSerializer


class FuelLogViewSet(viewsets.ModelViewSet):
    serializer_class = FuelLogSerializer
    permission_classes = [IsAuthenticated, FleetManagerReadOnly, StateScopedObjectPermission]

    def get_queryset(self):
        qs = FuelLog.objects.select_related("vehicle", "state_office").all().order_by("-filled_at")
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
        if vehicle and vehicle.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state fuel log creation is forbidden")
        serializer.save(state_office_id=state_id)

    def perform_update(self, serializer):
        if getattr(self.request.user, "is_owner", False):
            serializer.save()
            return
        state_id = getattr(self.request.user, "state_office_id", None)
        if state_id is None:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("state_office is required")
        vehicle = serializer.validated_data.get("vehicle", getattr(serializer.instance, "vehicle", None))
        if vehicle and vehicle.state_office_id != state_id:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Cross-state fuel log update is forbidden")
        serializer.save(state_office_id=state_id)
