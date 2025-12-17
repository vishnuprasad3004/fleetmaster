import logging
from dataclasses import dataclass

from django.conf import settings

from apps.integrations.ai_service import AIServiceClient
from apps.integrations.huggingface_client import HuggingFaceClient

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class OrchestratorResult:
    ok: bool
    payload: dict
    error: str = ""


class AIOrchestrator:
    """Centralized AI orchestration layer.

    - Django owns orchestration only.
    - All external AI calls go through here.
    - Celery tasks call this layer (never call FastAPI/HF directly).
    """

    def __init__(self):
        self.ai_service = AIServiceClient(
            base_url=getattr(settings, "AI_SERVICES_BASE_URL", "http://localhost:9000"),
            timeout_seconds=10,
            retries=3,
        )
        self.hf = HuggingFaceClient(timeout_seconds=15, retries=3)

    def predict_vehicle_health(self, *, vehicle_id: int, state_office_id: int, features: dict | None = None) -> OrchestratorResult:
        payload = {"vehicle_id": vehicle_id, "state_office_id": state_office_id, "features": features or {}}
        res = self.ai_service.predict_vehicle_health(payload)
        return OrchestratorResult(ok=res.ok, payload=res.payload, error=res.error)

    def predict_driver_risk(self, *, driver_id: int, state_office_id: int, features: dict | None = None) -> OrchestratorResult:
        payload = {"driver_id": driver_id, "state_office_id": state_office_id, "features": features or {}}
        res = self.ai_service.predict_driver_risk(payload)
        return OrchestratorResult(ok=res.ok, payload=res.payload, error=res.error)

    def predict_maintenance(self, *, vehicle_id: int, state_office_id: int, features: dict | None = None) -> OrchestratorResult:
        payload = {"vehicle_id": vehicle_id, "state_office_id": state_office_id, "features": features or {}}
        res = self.ai_service.predict_maintenance(payload)
        return OrchestratorResult(ok=res.ok, payload=res.payload, error=res.error)

    def detect_anomaly(self, *, vehicle_id: int, state_office_id: int, telemetry_points: list[dict] | None = None) -> OrchestratorResult:
        payload = {
            "vehicle_id": vehicle_id,
            "state_office_id": state_office_id,
            "telemetry_points": telemetry_points or [],
        }
        res = self.ai_service.detect_anomaly(payload)
        return OrchestratorResult(ok=res.ok, payload=res.payload, error=res.error)

    def explain_alert(self, *, alert_text: str) -> str:
        return self.hf.explain_alert(alert_text)

    def summarize_report(self, *, text: str) -> str:
        return self.hf.summarize_report(text)

    def fleet_chat(self, *, prompt: str, context: dict) -> str:
        return self.hf.fleet_chat(prompt, context)

    def embed_text(self, *, text: str) -> list[float]:
        return self.hf.embed_text(text)
