from django.urls import path
from notifications.views.admin import (
    AdminNotificationListAPIView,
    AdminNotificationRetrieveUpdateAPIView,
)

app_name = "admin"

urlpatterns = [
    path(
        "notifications/",
        AdminNotificationListAPIView.as_view(),
        name="notification_list",
    ),
    path(
        "notifications/<int:pk>/",
        AdminNotificationRetrieveUpdateAPIView.as_view(),
        name="notification_retrieve_update",
    ),
]
