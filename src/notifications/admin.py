from django.contrib import admin
from notifications.models import Notification, FCMToken

# Register your models here.
admin.site.register(
    [
        Notification,
        FCMToken,
    ]
)
