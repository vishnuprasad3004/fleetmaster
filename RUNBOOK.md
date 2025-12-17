# FleetMaster Pro — Runbook

This runbook is **documentation-only** and does not require services to be running to exist in the repo.

## One-command startup (Docker)
```bash
docker compose up --build
```

## Database migrations
```bash
docker compose run --rm backend python manage.py makemigrations
docker compose run --rm backend python manage.py migrate
```

## TimescaleDB hypertable verification
```bash
docker compose exec db psql -U fleetmaster -d fleetmaster \
  -c "SELECT hypertable_name FROM timescaledb_information.hypertables;"
```
Expected: `vehicle_telemetry`

## Owner bootstrap
```bash
docker compose run --rm backend python manage.py bootstrap_owner
```
Environment overrides:
- `BOOTSTRAP_OWNER_USERNAME`
- `BOOTSTRAP_OWNER_PASSWORD`
- `BOOTSTRAP_OWNER_EMAIL`

## Celery + Beat
```bash
docker compose up --build celery celery-beat
```

## AI Services
```bash
docker compose up --build ai-services
```

## Demo checklist
- Start stack
- Run migrations
- Bootstrap owner
- Create State Office(s)
- Create State Manager + Fleet Manager users
- Create Vehicles, Drivers, Bookings
- Upload documents with expiry dates and wait for 02:00 (or trigger task manually)
- Trigger AI recalculation task manually:
  - `python manage.py shell` then `from apps.alerts.tasks import periodic_ai_recalculation; periodic_ai_recalculation.delay()`
- Confirm Alerts are created and visible via read-only Alerts API
