from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.alerts.models import Alert
from apps.alerts.tasks import dispatch_alert_notifications


@receiver(post_save, sender=Alert)
def on_alert_created(sender, instance: Alert, created: bool, **kwargs) -> None:
    # System-only alerts are created by background jobs. This hook triggers notifications.
    if not created:
        return
    dispatch_alert_notifications.delay(instance.id)
