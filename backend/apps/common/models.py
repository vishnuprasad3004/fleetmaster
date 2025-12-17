from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class StateOffice(TimeStampedModel):
    code = models.CharField(max_length=16, unique=True)
    name = models.CharField(max_length=128)

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"
