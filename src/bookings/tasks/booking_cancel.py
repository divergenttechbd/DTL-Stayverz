from datetime import datetime
from django.conf import settings
from bson import DBRef
from celery import shared_task
from celery.utils.log import get_task_logger
from base.helpers.utils import format_date
from base.mongo.connection import connect_mongo

from base.type_choices import NotificationEventTypeOption, NotificationTypeOption
from bookings.models import Booking
from notifications.models import Notification
from notifications.utils import create_notification, send_notification


logger = get_task_logger(__name__)


@shared_task(name="myproject.payments.booking_cancelled_process")
def booking_cancelled_process(booking_id: str) -> None:
    booking = Booking.objects.get(id=booking_id)

    guest = booking.guest
    host = booking.host

    with connect_mongo() as collections:
        listing = booking.listing
        mongo_from_user_id = collections["User"].find_one({"username": guest.username})
        mongo_to_user_id = collections["User"].find_one({"username": host.username})
        booking_data = {
            "check_in": str(booking.check_in),
            "check_out": str(booking.check_out),
            "total_guest_count": booking.guest_count,
            "adult": booking.adult_count,
            "children": booking.children_count,
            "infant": booking.infant_count,
        }

        if not mongo_from_user_id or not mongo_to_user_id:
            return

        room_name = f"{guest.username}:{host.username}"
        chat_room = collections["ChatRoom"].find_one({"name": room_name}) or None

        if not chat_room:
            print("This case should not happened")
        else:
            chat_room_id = chat_room["_id"]

        content = f"Your booking cancelled successfully"
        collections["Message"].insert_one(
            {
                "chat_room": DBRef("ChatRoom", chat_room_id),
                "user": DBRef("User", mongo_from_user_id["_id"]),
                "m_type": "system",
                "content": content,
                "is_read": False,
                "meta": {
                    "listing": None,
                    "booking": {
                        "id": booking.id,
                        "invoice_no": booking.invoice_no,
                        "reservation_code": booking.reservation_code,
                    },
                },
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }
        )

        collections["ChatRoom"].update_one(
            {"_id": chat_room_id},
            {
                "$set": {
                    "latest_message": {
                        "content": content,
                        "created_at": datetime.now(),
                        "user": {
                            "username": mongo_from_user_id["username"],
                            "full_name": mongo_from_user_id["full_name"],
                            "image": mongo_from_user_id["image"],
                            "user_id": mongo_from_user_id["user_id"],
                        },
                        "m_type": "system",
                    },
                    "status": "cancelled",
                    "booking_data": booking_data,
                    "listing": {"name": listing.title, "id": listing.id},
                    "updated_at": datetime.now(),
                }
            },
        )

        event_type = NotificationEventTypeOption.BOOKING_CANCELLED
        host_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": str(booking.listing.unique_id),
                "message": "A guest cancelled your property just now",
                "link": f"/host-dashboard/inbox?conversation_id={booking.chat_room_id}",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=booking.host_id,
        )

        guest_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": str(booking.listing.unique_id),
                "message": "You’ve successfully cancelled your booking",
                "link": f"/messages?conversation_id={booking.chat_room_id}",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=booking.guest_id,
        )

        admin_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": str(booking.listing.unique_id),
                "message": "A booking has been cancelled",
                "link": f"/chat?id={booking.chat_room_id}",
            },
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
        )

        notification_data = [
            host_notification,
            guest_notification,
            admin_notification,
        ]
        Notification.objects.bulk_create(
            [Notification(**item) for item in notification_data]
        )
        booking.chat_room_id = chat_room_id
        booking.save()

        send_notification(notification_data=notification_data)
