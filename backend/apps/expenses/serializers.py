from rest_framework import serializers

from .models import FuelLog


class FuelLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelLog
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
