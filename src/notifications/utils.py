from base.type_choices import NotificationEventTypeOption, NotificationTypeOption
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_notification(notification_data: list):
    for item in notification_data:
        channel_layer = get_channel_layer()
        if item.get("user_id"):
            unread_notifications_count = Notification.objects.filter(
                user_id=item.get("user_id"), is_read=False
            ).count()
        else:
            unread_notifications_count = Notification.objects.filter(
                n_type=NotificationTypeOption.ADMIN_NOTIFICATION, is_read=False
            ).count()
        async_to_sync(channel_layer.group_send)(
            f"{item.get('user_id', 'admin')}_notify",
            {
                "type": "notifications",
                "message": item["data"]["message"],
                "count": unread_notifications_count,
            },
        )


def create_notification(
    event_type: NotificationEventTypeOption,
    n_type: NotificationTypeOption,
    data: dict,
    user_id: str | None = None,
) -> dict:
    data = {
        "event_type": event_type,
        "data": data,
        "n_type": n_type,
    }
    if user_id:
        data["user_id"] = user_id

    return data
