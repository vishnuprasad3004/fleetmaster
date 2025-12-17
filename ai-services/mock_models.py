from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class VehicleHealthModel:
    # In production: load XGBoost model here.
    def predict(self, features: dict[str, Any]) -> dict[str, Any]:
        avg_speed = float(features.get("avg_speed", 0) or 0)
        max_speed = float(features.get("max_speed", 0) or 0)
        total_idle = float(features.get("total_idle_time", 0) or 0)

        penalty = 0.0
        penalty += min(max_speed / 2.0, 40.0)
        penalty += min(avg_speed / 3.0, 25.0)
        penalty += min(total_idle / 120.0, 20.0)

        health = max(0.0, min(100.0, 100.0 - penalty))
        return {
            "health_score": health,
            "maintenance_prediction": {"priority": "HIGH" if health < 50 else "NORMAL"},
            "anomaly_flags": {"speeding": max_speed > 100},
        }


@dataclass
class MaintenanceModel:
    # In production: load LSTM model here.
    def predict(self, features: dict[str, Any]) -> dict[str, Any]:
        max_engine_hours = float(features.get("max_engine_hours", 0) or 0)
        next_service_days = int(max(1, 180 - (max_engine_hours // 5)))
        return {
            "next_service_km": None,
            "next_service_days": next_service_days,
            "confidence": 0.55,
            "factors": {"max_engine_hours": max_engine_hours},
        }


@dataclass
class DriverRiskModel:
    # In production: load RandomForest model here.
    def predict(self, features: dict[str, Any]) -> dict[str, Any]:
        harsh_braking = float(features.get("harsh_braking", 0) or 0)
        speeding_events = float(features.get("speeding_events", 0) or 0)

        score = min(100.0, harsh_braking * 10.0 + speeding_events * 7.5)
        return {
            "risk_score": score,
            "maintenance_prediction": {},
            "anomaly_flags": {"unsafe": score > 70},
        }


@dataclass
class AnomalyModel:
    # In production: load IsolationForest model here.
    def predict(self, telemetry_points: list[dict[str, Any]]) -> dict[str, Any]:
        if not telemetry_points:
            return {"is_anomalous": False, "anomaly_score": 0.0, "flags": {}}

        speeds = [float(p.get("speed", 0) or 0) for p in telemetry_points]
        max_speed = max(speeds) if speeds else 0.0
        anomaly_score = 0.9 if max_speed > 120 else 0.2

        return {
            "is_anomalous": anomaly_score > 0.75,
            "anomaly_score": anomaly_score,
            "flags": {"max_speed": max_speed},
        }
