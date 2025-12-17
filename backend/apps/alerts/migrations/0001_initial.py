from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("common", "0001_initial"),
        ("accounts", "0001_initial"),
        ("vehicles", "0001_initial"),
        ("drivers", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Alert",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "alert_type",
                    models.CharField(
                        choices=[
                            ("DOCUMENT_EXPIRY", "Document Expiry"),
                            ("VEHICLE_HEALTH", "Vehicle Health"),
                            ("GPS_ANOMALY", "GPS Anomaly"),
                            ("DRIVER_RISK", "Driver Risk"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "severity",
                    models.CharField(
                        choices=[("LOW", "Low"), ("MEDIUM", "Medium"), ("HIGH", "High"), ("CRITICAL", "Critical")],
                        default="MEDIUM",
                        max_length=16,
                    ),
                ),
                ("dedup_key", models.CharField(blank=True, db_index=True, max_length=255)),
                ("title", models.CharField(max_length=256)),
                ("message", models.TextField(blank=True)),
                ("context", models.JSONField(blank=True, default=dict)),
                ("is_resolved", models.BooleanField(default=False)),
                ("resolved_at", models.DateTimeField(blank=True, null=True)),
                (
                    "assignee",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="assigned_alerts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "driver",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="alerts",
                        to="drivers.driver",
                    ),
                ),
                (
                    "state_office",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="alerts",
                        to="common.stateoffice",
                    ),
                ),
                (
                    "vehicle",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="alerts",
                        to="vehicles.vehicle",
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["state_office", "alert_type", "severity", "is_resolved"],
                        name="alerts_al_state_o_b2a76c_idx",
                    ),
                    models.Index(fields=["state_office", "dedup_key"], name="alerts_al_state_o_086061_idx"),
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="alert",
            constraint=models.UniqueConstraint(fields=("state_office", "dedup_key"), name="uniq_alert_state_dedup_key"),
        ),
    ]
