import logging
import os
import time
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class HFResult:
    ok: bool
    payload: object
    error: str = ""


class HuggingFaceClient:
    """Hugging Face Inference API client.

    - Reads API key from env only.
    - Adds timeouts, retries, and safe fallbacks.
    - This module does not perform any calls at import time.
    """

    DEFAULT_TIMEOUT_SECONDS = 15

    MODEL_ALERT_EXPLAINER = "google/flan-t5-base"
    MODEL_CHATBOT = "meta-llama/Meta-Llama-3-8B-Instruct"
    MODEL_SUMMARIZER = "facebook/bart-large-cnn"
    MODEL_EMBEDDINGS = "sentence-transformers/all-MiniLM-L6-v2"

    def __init__(self, timeout_seconds: int | None = None, retries: int = 3):
        self.api_key = os.getenv("HUGGINGFACE_API_KEY", "")
        self.timeout_seconds = timeout_seconds or self.DEFAULT_TIMEOUT_SECONDS
        self.retries = retries
        self._session = requests.Session()

    def _headers(self) -> dict:
        if not self.api_key:
            return {}
        return {"Authorization": f"Bearer {self.api_key}"}

    def _post(self, model_id: str, payload: dict) -> HFResult:
        if not self.api_key:
            return HFResult(ok=False, payload={}, error="Missing HUGGINGFACE_API_KEY")

        url = f"https://api-inference.huggingface.co/models/{model_id}"
        last_err = ""
        for attempt in range(1, self.retries + 1):
            try:
                resp = self._session.post(url, headers=self._headers(), json=payload, timeout=self.timeout_seconds)
                resp.raise_for_status()
                return HFResult(ok=True, payload=resp.json())
            except Exception as exc:
                last_err = str(exc)
                logger.warning("HF call failed model=%s attempt=%s/%s err=%s", model_id, attempt, self.retries, exc)
                time.sleep(min(2 ** attempt, 8))

        return HFResult(ok=False, payload={}, error=last_err)

    def explain_alert(self, alert_text: str) -> str:
        """Explain alert text using FLAN-T5.

        Example usage:
            client = HuggingFaceClient()
            explanation = client.explain_alert("Vehicle health critical: score=35")
        """

        prompt = (
            "Explain the following fleet alert in simple terms and suggest next steps.\n\n"
            f"Alert: {alert_text}\n"
        )

        result = self._post(self.MODEL_ALERT_EXPLAINER, {"inputs": prompt})
        if not result.ok:
            return "Alert explanation unavailable."

        data = result.payload
        if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
            return str(data[0]["generated_text"])
        if isinstance(data, dict) and "generated_text" in data:
            return str(data["generated_text"])
        return str(data)

    def summarize_report(self, text: str) -> str:
        """Summarize report text using BART.

        Example usage:
            summary = HuggingFaceClient().summarize_report(long_text)
        """

        result = self._post(self.MODEL_SUMMARIZER, {"inputs": text})
        if not result.ok:
            return "Summary unavailable."

        data = result.payload
        if isinstance(data, list) and data and isinstance(data[0], dict) and "summary_text" in data[0]:
            return str(data[0]["summary_text"])
        if isinstance(data, dict) and "summary_text" in data:
            return str(data["summary_text"])
        return str(data)

    def fleet_chat(self, prompt: str, context: dict) -> str:
        """Fleet chatbot using LLaMA-3 Instruct.

        Example usage:
            reply = HuggingFaceClient().fleet_chat(
                "Where are my highest risk drivers?",
                {"state_office": "KA", "time_window": "7d"},
            )
        """

        rendered = (
            "You are a fleet assistant. Use the provided context to answer.\n\n"
            f"Context: {context}\n"
            f"User: {prompt}\n"
            "Assistant:"
        )
        result = self._post(self.MODEL_CHATBOT, {"inputs": rendered})
        if not result.ok:
            return "Chatbot unavailable."

        data = result.payload
        if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
            return str(data[0]["generated_text"])
        if isinstance(data, dict) and "generated_text" in data:
            return str(data["generated_text"])
        return str(data)

    def embed_text(self, text: str) -> list[float]:
        """Embed a single text using MiniLM.

        Example usage:
            vec = HuggingFaceClient().embed_text("vehicle health alert")
        """

        result = self._post(self.MODEL_EMBEDDINGS, {"inputs": text})
        if not result.ok:
            return [0.0] * 384

        data = result.payload
        if isinstance(data, list) and data and all(isinstance(x, (int, float)) for x in data):
            return [float(x) for x in data]

        # Some deployments may return a nested list.
        if (
            isinstance(data, list)
            and data
            and isinstance(data[0], list)
            and data[0]
            and all(isinstance(x, (int, float)) for x in data[0])
        ):
            return [float(x) for x in data[0]]

        return [0.0] * 384
