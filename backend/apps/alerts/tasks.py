import hashlib
import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.db import models
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import UserRole
from apps.alerts.models import Alert, AlertSeverity, AlertType
from apps.drivers.models import Driver
from apps.telemetry.models import VehicleTelemetry
from apps.integrations.orchestrator import AIOrchestrator
from apps.vehicles.models import Vehicle, VehicleDocument, VehicleDocumentType

logger = logging.getLogger(__name__)


def _find_state_manager(state_office_id: int):
    from django.contrib.auth import get_user_model

    User = get_user_model()
    return (
        User.objects.filter(role=UserRole.STATE_MANAGER, state_office_id=state_office_id, is_active=True)
        .order_by("id")
        .first()
    )


def _dedup_key(parts: list[str]) -> str:
    raw = ":".join(parts)
    # Keep stable length for indexing.
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 5})
def dispatch_alert_notifications(self, alert_id: int) -> None:
    """Notification hook called on alert creation.

    This is intentionally minimal and extensible.
    """

    alert = Alert.objects.select_related("state_office", "assignee").filter(id=alert_id).first()
    if not alert:
        return

    logger.info(
        "Dispatching notifications for alert=%s type=%s severity=%s state=%s",
        alert.id,
        alert.alert_type,
        alert.severity,
        alert.state_office_id,
    )

    # Stubs: integrate email/push providers later.
    # Email: alert.assignee.email
    # Push: device tokens
    # Dashboard: websocket / in-app queue


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 5})
def daily_document_expiry_scan(self) -> dict:
    """Runs daily to generate document expiry alerts.

    Idempotency is enforced using Alert.dedup_key unique per state.
    """

    today = timezone.now().date()
    near_expiry_days = 30
    near_date = today + timedelta(days=near_expiry_days)

    qs = VehicleDocument.objects.select_related("vehicle", "vehicle__state_office").filter(expiry_date__isnull=False)

    created = 0
    updated = 0

    for doc in qs.iterator(chunk_size=500):
        if doc.expiry_date is None:
            continue

        if doc.doc_type not in {
            VehicleDocumentType.FC,
            VehicleDocumentType.FITNESS,
            VehicleDocumentType.INSURANCE,
            VehicleDocumentType.PERMIT,
            VehicleDocumentType.POLLUTION,
        }:
            continue

        severity = None
        if doc.expiry_date < today:
            severity = AlertSeverity.CRITICAL
        elif doc.expiry_date <= near_date:
            severity = AlertSeverity.HIGH
        else:
            continue

        state_id = doc.vehicle.state_office_id
        assignee = _find_state_manager(state_id)

        dedup = _dedup_key([
            "DOC_EXPIRY",
            doc.doc_type,
            str(doc.vehicle_id),
            str(doc.id),
            str(doc.expiry_date),
        ])

        title = f"{doc.doc_type} expiry for {doc.vehicle.registration_number}"
        message = f"Document expires on {doc.expiry_date}."

        with transaction.atomic():
            obj, was_created = Alert.objects.update_or_create(
                state_office_id=state_id,
                dedup_key=dedup,
                defaults={
                    "assignee": assignee,
                    "alert_type": AlertType.DOCUMENT_EXPIRY,
                    "severity": severity,
                    "title": title,
                    "message": message,
                    "vehicle_id": doc.vehicle_id,
                    "driver_id": None,
                    "context": {
                        "document_id": doc.id,
                        "document_type": doc.doc_type,
                        "expiry_date": str(doc.expiry_date),
                    },
                    "is_resolved": False,
                    "resolved_at": None,
                },
            )

        if was_created:
            created += 1
        else:
            updated += 1

    return {"created": created, "updated": updated}


def _telemetry_summary(vehicle_id: int) -> dict:
    since = timezone.now() - timedelta(hours=24)
    points = VehicleTelemetry.objects.filter(vehicle_id=vehicle_id, timestamp__gte=since)

    cnt = points.count()
    if cnt == 0:
        return {"count": 0}

    # Lightweight aggregates for AI features.
    agg = points.aggregate(
        avg_speed=models.Avg("speed"),
        max_speed=models.Max("speed"),
        total_idle=models.Sum("idle_time"),
        max_engine_hours=models.Max("engine_hours"),
    )
    return {"count": cnt, **{k: (v if v is not None else 0) for k, v in agg.items()}}


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 5})
def periodic_ai_recalculation(self) -> dict:
    """Recalculate vehicle health and driver risk by calling the AI microservice.

    - Updates AI-managed fields (health_score/risk_score/maintenance_prediction/anomaly_flags)
    - Creates alerts when thresholds are breached
    """

    vehicles = Vehicle.objects.select_related("state_office").all().order_by("id")
    drivers = Driver.objects.select_related("state_office").all().order_by("id")

    updated_vehicles = 0
    updated_drivers = 0
    alerts_created = 0

    orchestrator = AIOrchestrator()

    for v in vehicles.iterator(chunk_size=200):
        summary = {"count": 0}
        try:
            summary = _telemetry_summary(v.id)
        except Exception:
            pass

        result = orchestrator.predict_vehicle_health(
            vehicle_id=v.id,
            state_office_id=v.state_office_id,
            features=summary,
        )
        if not result.ok:
            logger.warning("AI vehicle-health call failed vehicle=%s err=%s", v.id, result.error)
            continue

        payload = result.payload
        health = float(payload.get("health_score", 100.0))
        maintenance_pred = payload.get("maintenance_prediction", {})
        anomaly_flags = payload.get("anomaly_flags", {})

        Vehicle.objects.filter(id=v.id).update(
            health_score=health,
            last_health_score_at=timezone.now(),
            maintenance_prediction=maintenance_pred,
            anomaly_flags=anomaly_flags,
        )
        updated_vehicles += 1

        if health < 40:
            dedup = _dedup_key(["VEH_HEALTH", str(v.id), timezone.now().date().isoformat()])
            assignee = _find_state_manager(v.state_office_id)
            try:
                Alert.objects.get_or_create(
                    state_office_id=v.state_office_id,
                    dedup_key=dedup,
                    defaults={
                        "assignee": assignee,
                        "alert_type": AlertType.VEHICLE_HEALTH,
                        "severity": AlertSeverity.CRITICAL,
                        "title": f"Vehicle health critical: {v.registration_number}",
                        "message": f"AI health score is {health}",
                        "vehicle_id": v.id,
                        "context": {"health_score": health},
                    },
                )
                alerts_created += 1
            except Exception:
                # If dedup already exists, ignore.
                pass

    for d in drivers.iterator(chunk_size=200):
        result = orchestrator.predict_driver_risk(driver_id=d.id, state_office_id=d.state_office_id, features={})
        if not result.ok:
            logger.warning("AI driver-risk call failed driver=%s err=%s", d.id, result.error)
            continue

        payload = result.payload
        risk = float(payload.get("risk_score", 0.0))
        maintenance_pred = payload.get("maintenance_prediction", {})
        anomaly_flags = payload.get("anomaly_flags", {})

        Driver.objects.filter(id=d.id).update(
            risk_score=risk,
            last_risk_score_at=timezone.now(),
            maintenance_prediction=maintenance_pred,
            anomaly_flags=anomaly_flags,
        )
        updated_drivers += 1

        if risk > 80:
            dedup = _dedup_key(["DRIVER_RISK", str(d.id), timezone.now().date().isoformat()])
            assignee = _find_state_manager(d.state_office_id)
            try:
                Alert.objects.get_or_create(
                    state_office_id=d.state_office_id,
                    dedup_key=dedup,
                    defaults={
                        "assignee": assignee,
                        "alert_type": AlertType.DRIVER_RISK,
                        "severity": AlertSeverity.CRITICAL,
                        "title": f"Driver risk critical: {d.full_name}",
                        "message": f"AI risk score is {risk}",
                        "driver_id": d.id,
                        "context": {"risk_score": risk},
                    },
                )
                alerts_created += 1
            except Exception:
                pass

    return {
        "updated_vehicles": updated_vehicles,
        "updated_drivers": updated_drivers,
        "alerts_created": alerts_created,
    }
