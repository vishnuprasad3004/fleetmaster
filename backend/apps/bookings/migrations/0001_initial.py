from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("common", "0001_initial"),
        ("vehicles", "0001_initial"),
        ("drivers", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Booking",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("booking_code", models.CharField(max_length=32, unique=True)),
                ("origin", models.CharField(max_length=256)),
                ("destination", models.CharField(max_length=256)),
                ("route_metadata", models.JSONField(blank=True, default=dict)),
                ("load_metadata", models.JSONField(blank=True, default=dict)),
                ("scheduled_start_at", models.DateTimeField()),
                ("scheduled_end_at", models.DateTimeField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PLANNED", "Planned"),
                            ("IN_TRANSIT", "In Transit"),
                            ("COMPLETED", "Completed"),
                            ("CANCELED", "Canceled"),
                        ],
                        default="PLANNED",
                        max_length=16,
                    ),
                ),
                ("ai_training_payload", models.JSONField(blank=True, default=dict)),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bookings",
                        to="drivers.driver",
                    ),
                ),
                (
                    "state_office",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bookings",
                        to="common.stateoffice",
                    ),
                ),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bookings",
                        to="vehicles.vehicle",
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["state_office", "status", "scheduled_start_at"],
                        name="bookings_bo_state_o_d7f8da_idx",
                    )
                ],
            },
        ),
    ]
