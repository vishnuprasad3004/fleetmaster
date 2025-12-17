from rest_framework import serializers

from .models import StateOffice


class StateOfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateOffice
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
