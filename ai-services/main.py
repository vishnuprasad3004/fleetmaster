from fastapi import FastAPI
 
from mock_models import AnomalyModel, DriverRiskModel, MaintenanceModel, VehicleHealthModel
from schemas import (
    AnomalyDetectionRequest,
    AnomalyDetectionResponse,
    DriverRiskRequest,
    DriverRiskResponse,
    MaintenanceRequest,
    MaintenanceResponse,
    VehicleHealthRequest,
    VehicleHealthResponse,
)
 
app = FastAPI(title="FleetMaster AI Services", version="0.1.0")
 
 
@app.on_event("startup")
def load_models() -> None:
    app.state.vehicle_health_model = VehicleHealthModel()
    app.state.maintenance_model = MaintenanceModel()
    app.state.driver_risk_model = DriverRiskModel()
    app.state.anomaly_model = AnomalyModel()
 
 
@app.get("/health")
def health():
    return {"status": "ok"}
 
 
@app.post("/predict/vehicle-health", response_model=VehicleHealthResponse)
def predict_vehicle_health(payload: VehicleHealthRequest):
    model: VehicleHealthModel = app.state.vehicle_health_model
    pred = model.predict(payload.features)
    return VehicleHealthResponse(vehicle_id=payload.vehicle_id, **pred)
 
 
@app.post("/predict/maintenance", response_model=MaintenanceResponse)
def predict_maintenance(payload: MaintenanceRequest):
    model: MaintenanceModel = app.state.maintenance_model
    pred = model.predict(payload.features)
    return MaintenanceResponse(vehicle_id=payload.vehicle_id, **pred)
 
 
@app.post("/predict/driver-risk", response_model=DriverRiskResponse)
def predict_driver_risk(payload: DriverRiskRequest):
    model: DriverRiskModel = app.state.driver_risk_model
    pred = model.predict(payload.features)
    return DriverRiskResponse(driver_id=payload.driver_id, **pred)
 
 
@app.post("/detect/anomaly", response_model=AnomalyDetectionResponse)
def detect_anomaly(payload: AnomalyDetectionRequest):
    model: AnomalyModel = app.state.anomaly_model
    pred = model.predict(payload.telemetry_points)
    return AnomalyDetectionResponse(vehicle_id=payload.vehicle_id, **pred)
