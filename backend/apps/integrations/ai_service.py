import logging
import time
from dataclasses import dataclass

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AIServiceResult:
    ok: bool
    payload: dict
    error: str = ""


class AIServiceClient:
    """HTTP client for internal AI microservice.

    Celery tasks must call this layer instead of making direct HTTP calls.
    """

    def __init__(self, base_url: str | None = None, timeout_seconds: int = 10, retries: int = 3):
        self.base_url = (base_url or getattr(settings, "AI_SERVICES_BASE_URL", "http://localhost:9000")).rstrip("/")
        self.timeout_seconds = timeout_seconds
        self.retries = retries
        self._session = requests.Session()

    def _post(self, path: str, json: dict) -> AIServiceResult:
        url = f"{self.base_url}{path}"
        last_err = ""
        for attempt in range(1, self.retries + 1):
            try:
                resp = self._session.post(url, json=json, timeout=self.timeout_seconds)
                resp.raise_for_status()
                return AIServiceResult(ok=True, payload=resp.json())
            except Exception as exc:
                last_err = str(exc)
                logger.warning("AI service call failed url=%s attempt=%s/%s err=%s", url, attempt, self.retries, exc)
                time.sleep(min(2 ** attempt, 8))
        return AIServiceResult(ok=False, payload={}, error=last_err)

    def predict_vehicle_health(self, payload: dict) -> AIServiceResult:
        return self._post("/predict/vehicle-health", payload)

    def predict_driver_risk(self, payload: dict) -> AIServiceResult:
        return self._post("/predict/driver-risk", payload)

    def predict_maintenance(self, payload: dict) -> AIServiceResult:
        return self._post("/predict/maintenance", payload)

    def detect_anomaly(self, payload: dict) -> AIServiceResult:
        return self._post("/detect/anomaly", payload)
