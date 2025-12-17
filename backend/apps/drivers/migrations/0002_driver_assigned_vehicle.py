from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("drivers", "0001_initial"),
        ("vehicles", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="driver",
            name="assigned_vehicle",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_drivers",
                to="vehicles.vehicle",
            ),
        ),
    ]
