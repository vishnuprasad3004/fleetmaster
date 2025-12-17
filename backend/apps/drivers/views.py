from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.api.permissions import StateScopedObjectPermission
from apps.api.scoping import filter_by_state_office

from .models import Driver
from .serializers import DriverSerializer


class DriverViewSet(viewsets.ModelViewSet):
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated, StateScopedObjectPermission]

    def get_queryset(self):
        qs = Driver.objects.all().order_by("-updated_at")
        return filter_by_state_office(qs, self.request.user, field_name="state_office")

    def perform_create(self, serializer):
        if getattr(self.request.user, "is_fleet_manager", False):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Fleet managers cannot create drivers")
        if getattr(self.request.user, "is_owner", False):
            serializer.save()
            return
        if getattr(self.request.user, "state_office_id", None) is None:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("state_office is required")
        serializer.save(state_office_id=self.request.user.state_office_id)

    def perform_update(self, serializer):
        if getattr(self.request.user, "is_owner", False):
            serializer.save()
            return
        serializer.save(state_office_id=self.request.user.state_office_id)

    def perform_destroy(self, instance):
        if getattr(self.request.user, "is_fleet_manager", False):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Fleet managers cannot delete drivers")
        return super().perform_destroy(instance)
