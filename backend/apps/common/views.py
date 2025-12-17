from rest_framework import viewsets

from apps.api.permissions import OwnerWriteOtherwiseRead

from .models import StateOffice
from .serializers import StateOfficeSerializer


class StateOfficeViewSet(viewsets.ModelViewSet):
    queryset = StateOffice.objects.all().order_by("code")
    serializer_class = StateOfficeSerializer
    permission_classes = [OwnerWriteOtherwiseRead]
