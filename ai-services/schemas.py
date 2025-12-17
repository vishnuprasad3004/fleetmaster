from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class VehicleHealthRequest(BaseModel):
    vehicle_id: int = Field(..., ge=1)
    state_office_id: int = Field(..., ge=1)
    features: dict[str, Any] = Field(default_factory=dict)


class VehicleHealthResponse(BaseModel):
    vehicle_id: int
    health_score: float = Field(..., ge=0, le=100)
    maintenance_prediction: dict[str, Any] = Field(default_factory=dict)
    anomaly_flags: dict[str, Any] = Field(default_factory=dict)


class MaintenanceRequest(BaseModel):
    vehicle_id: int = Field(..., ge=1)
    state_office_id: int = Field(..., ge=1)
    features: dict[str, Any] = Field(default_factory=dict)


class MaintenanceResponse(BaseModel):
    vehicle_id: int
    next_service_km: float | None = None
    next_service_days: int | None = None
    confidence: float = Field(0.5, ge=0, le=1)
    factors: dict[str, Any] = Field(default_factory=dict)


class DriverRiskRequest(BaseModel):
    driver_id: int = Field(..., ge=1)
    state_office_id: int = Field(..., ge=1)
    features: dict[str, Any] = Field(default_factory=dict)


class DriverRiskResponse(BaseModel):
    driver_id: int
    risk_score: float = Field(..., ge=0, le=100)
    maintenance_prediction: dict[str, Any] = Field(default_factory=dict)
    anomaly_flags: dict[str, Any] = Field(default_factory=dict)


class AnomalyDetectionRequest(BaseModel):
    vehicle_id: int = Field(..., ge=1)
    state_office_id: int = Field(..., ge=1)
    telemetry_points: list[dict[str, Any]] = Field(default_factory=list)


class AnomalyDetectionResponse(BaseModel):
    vehicle_id: int
    is_anomalous: bool
    anomaly_score: float = Field(..., ge=0, le=1)
    flags: dict[str, Any] = Field(default_factory=dict)
