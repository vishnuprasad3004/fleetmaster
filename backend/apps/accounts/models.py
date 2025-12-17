from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

from apps.common.models import StateOffice, TimeStampedModel


class UserRole(models.TextChoices):
    OWNER = "OWNER", "Owner"
    STATE_MANAGER = "STATE_MANAGER", "State Manager"
    FLEET_MANAGER = "FLEET_MANAGER", "Fleet Manager"


class User(AbstractUser, TimeStampedModel):
    role = models.CharField(max_length=32, choices=UserRole.choices, default=UserRole.FLEET_MANAGER)
    state_office = models.ForeignKey(
        StateOffice,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users",
        help_text="Null for OWNER; required for state-scoped roles.",
    )

    def clean(self) -> None:
        super().clean()
        if self.role != UserRole.OWNER and self.state_office_id is None:
            raise ValidationError({"state_office": "Required for non-owner roles"})

    @property
    def is_owner(self) -> bool:
        return self.role == UserRole.OWNER

    @property
    def is_state_manager(self) -> bool:
        return self.role == UserRole.STATE_MANAGER

    @property
    def is_fleet_manager(self) -> bool:
        return self.role == UserRole.FLEET_MANAGER
