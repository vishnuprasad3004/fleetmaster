from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.api.permissions import StateScopedObjectPermission
from apps.api.scoping import filter_by_state_office

from .models import Alert
from .serializers import AlertSerializer


class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated, StateScopedObjectPermission]

    def get_queryset(self):
        qs = Alert.objects.select_related("vehicle", "driver", "state_office").all().order_by("-created_at")
        return filter_by_state_office(qs, self.request.user, field_name="state_office")

    @action(detail=True, methods=["post"], url_path="resolve")
    def resolve(self, request, pk=None):
        if not (getattr(request.user, "is_owner", False) or getattr(request.user, "is_state_manager", False)):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Only Owner/State Manager can resolve alerts")
        alert = self.get_object()
        alert.is_resolved = True
        alert.resolved_at = timezone.now()
        alert.save(update_fields=["is_resolved", "resolved_at", "updated_at"])
        return Response(AlertSerializer(alert).data)
