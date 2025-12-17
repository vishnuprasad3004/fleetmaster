from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Driver",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("full_name", models.CharField(max_length=128)),
                ("phone", models.CharField(blank=True, max_length=32)),
                ("license_number", models.CharField(max_length=64, unique=True)),
                ("license_expiry_date", models.DateField(blank=True, null=True)),
                ("is_available", models.BooleanField(default=True)),
                ("risk_score", models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ("last_risk_score_at", models.DateTimeField(blank=True, null=True)),
                ("maintenance_prediction", models.JSONField(blank=True, default=dict)),
                ("anomaly_flags", models.JSONField(blank=True, default=dict)),
                (
                    "state_office",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="drivers",
                        to="common.stateoffice",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DriverHealthReport",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("fatigue_score", models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ("notes", models.TextField(blank=True)),
                ("reported_at", models.DateTimeField()),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="health_reports",
                        to="drivers.driver",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DriverAssignment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("vehicle_id", models.BigIntegerField(blank=True, null=True)),
                ("started_at", models.DateTimeField()),
                ("ended_at", models.DateTimeField(blank=True, null=True)),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assignments",
                        to="drivers.driver",
                    ),
                ),
            ],
        ),
    ]
