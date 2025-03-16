from django.db import models

from base.models import BaseModel
from django.contrib.auth import get_user_model

from base.type_choices import NotificationTypeOption, NotificationEventTypeOption

# Create your models here.
User = get_user_model()


class Notification(BaseModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    event_type = models.CharField(
        max_length=30, choices=NotificationEventTypeOption.choices
    )
    data = models.JSONField()
    is_read = models.BooleanField(default=False)
    n_type = models.CharField(max_length=30, choices=NotificationTypeOption.choices)

    def __str__(self):
        return str(self.pk)


class FCMToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT)
    token = models.CharField(max_length=255)

    def __str__(self):
        return str(self.pk)
