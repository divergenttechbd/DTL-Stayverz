from django.urls import path
from notifications.views.user import (
    UserNotificationListAPIView,
    UserNotificationRetrieveUpdateAPIView,
    save_fcm_token,
)

app_name = "user"

urlpatterns = [
    path(
        "notifications/",
        UserNotificationListAPIView.as_view(),
        name="notification_list",
    ),
    path(
        "notifications/<int:pk>/",
        UserNotificationRetrieveUpdateAPIView.as_view(),
        name="notification_retrieve_update",
    ),
    path("fcm-tokens/", save_fcm_token, name="save_fcm_token"),
]
