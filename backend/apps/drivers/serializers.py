from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from .models import Driver, DriverHealthReport


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "updated_at",
            "risk_score",
            "last_risk_score_at",
            "maintenance_prediction",
            "anomaly_flags",
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        actor = getattr(request, "user", None)

        # Cross-state assignment protection (defense-in-depth).
        if actor is not None and getattr(actor, "is_authenticated", False) and not getattr(actor, "is_owner", False):
            actor_state_id = getattr(actor, "state_office_id", None)
            if actor_state_id is None:
                raise PermissionDenied("state_office is required")
            assigned_vehicle = attrs.get("assigned_vehicle")
            if assigned_vehicle is not None and getattr(assigned_vehicle, "state_office_id", None) != actor_state_id:
                raise PermissionDenied("Cross-state vehicle assignment is forbidden")
        if actor is not None and getattr(actor, "is_authenticated", False) and getattr(actor, "is_fleet_manager", False):
            allowed = {"is_available", "assigned_vehicle"}
            attempted = set(attrs.keys())
            disallowed = attempted - allowed
            if disallowed:
                raise PermissionDenied(f"Fleet managers may only update: {sorted(allowed)}")
        return attrs


class DriverHealthReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverHealthReport
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
