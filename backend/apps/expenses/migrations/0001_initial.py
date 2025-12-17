from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("common", "0001_initial"),
        ("vehicles", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="FuelLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("filled_at", models.DateTimeField()),
                ("liters", models.DecimalField(decimal_places=2, max_digits=10)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("odometer_km", models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "state_office",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="fuel_logs",
                        to="common.stateoffice",
                    ),
                ),
                (
                    "vehicle",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="fuel_logs",
                        to="vehicles.vehicle",
                    ),
                ),
            ],
            options={
                "indexes": [models.Index(fields=["state_office", "filled_at"], name="expenses_fu_state_o_1e2dc8_idx")],
            },
        ),
    ]
