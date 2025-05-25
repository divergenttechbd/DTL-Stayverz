# notifications/task.py

from celery import shared_task
from django.utils import timezone
from datetime import timedelta, datetime, time  # Added datetime, time

# Your models
from bookings.models import Booking
from base.type_choices import BookingStatusOption, NotificationEventTypeOption, NotificationTypeOption
from .models import Notification  # Your Notification model for in-app

# Your utility functions
from .utils import create_notification, send_notification as send_channels_notification  # Renamed for clarity
from .push_service import send_native_push_notification  # The new service

# Django settings for USE_TZ
from django.conf import settings


@shared_task(name="send_pre_arrival_notification_task")
def send_pre_arrival_notification_task(booking_id):
    try:
        booking = Booking.objects.select_related('host', 'guest', 'listing').get(pk=booking_id)

        now_date = timezone.now().date()
        is_due = booking.check_in == (now_date + timedelta(days=1))  # Check-in is tomorrow

        if booking.status == BookingStatusOption.CONFIRMED and is_due:
            host_id = booking.host_id
            guest_full_name = booking.guest.get_full_name() if hasattr(booking.guest,
                                                                       'get_full_name') else booking.guest.username

            # 1. Create In-App Notification
            in_app_notif_data = create_notification(
                event_type=NotificationEventTypeOption.PRE_ARRIVAL,
                n_type=NotificationTypeOption.USER_NOTIFICATION,
                data={
                    "message": f"Guest {guest_full_name} for '{booking.listing.title}' arrives tomorrow ({booking.check_in.strftime('%d %b')}).",
                    "link": f"/host/bookings/{booking.invoice_no}/",  #
                    "booking_id": str(booking.id)
                },
                user_id=host_id
            )
            Notification.objects.create(**in_app_notif_data)
            # Send via Django Channels (your existing system)
            send_channels_notification([in_app_notif_data])

            # 2. Send Native Push Notification
            push_title = "Guest Arrival Reminder"
            push_body = f"{guest_full_name} ({booking.listing.title}) arrives tomorrow!"
            push_data_payload = {
                "type": "pre_arrival",
                "booking_id": str(booking.id),
                "invoice_no": booking.invoice_no,
            }
            send_native_push_notification(user_id=host_id, title=push_title, body=push_body, data=push_data_payload)

            print(
                f"Task: Pre-arrival notifications (in-app & push) sent for booking ID {booking_id} to host ID {host_id}")
        else:
            print(
                f"Task: Pre-arrival for booking ID {booking_id} skipped. Due: {is_due}, Status: {booking.status}, Check-in: {booking.check_in}")

    except Booking.DoesNotExist:
        print(f"Task: Booking ID {booking_id} not found for pre-arrival notification.")
    except Exception as e:
        print(f"Task: Error in send_pre_arrival_notification_task for booking ID {booking_id}: {e}")


@shared_task(name="send_post_booking_notification_task")
def send_post_booking_notification_task(booking_id):
    try:
        booking = Booking.objects.select_related('host', 'guest', 'listing').get(pk=booking_id)
        guest_full_name = booking.guest.get_full_name() if hasattr(booking.guest,
                                                                   'get_full_name') else booking.guest.username

        # Ensure booking has actually ended
        if booking.check_out < timezone.now().date() and \
            (
                booking.status == BookingStatusOption.CONFIRMED or booking.status == BookingStatusOption.COMPLETED):  # Or your "ended" status

            guest_id = booking.guest_id
            host_id = booking.host_id

            # --- For Guest ---
            guest_in_app_data = create_notification(
                event_type=NotificationEventTypeOption.POST_BOOKING_GUEST,  # Define this
                n_type=NotificationTypeOption.USER_NOTIFICATION,
                data={
                    "message": f"Hope you enjoyed your stay at '{booking.listing.title}'! Please leave a review.",
                    "link": f"/bookings/{booking.invoice_no}/review/",  # Example link
                    "booking_id": str(booking.id)
                },
                user_id=guest_id
            )
            Notification.objects.create(**guest_in_app_data)
            send_channels_notification([guest_in_app_data])

            guest_push_title = "Stay Ended - Share Your Feedback!"
            guest_push_body = f"Your stay at '{booking.listing.title}' has ended. We'd love your review!"
            guest_push_data = {"type": "post_booking_feedback", "booking_id": str(booking.id)}
            send_native_push_notification(user_id=guest_id, title=guest_push_title, body=guest_push_body,
                                          data=guest_push_data)
            print(f"Task: Post-booking notifications sent to guest ID {guest_id} for booking {booking_id}")

            # --- For Host ---
            host_in_app_data = create_notification(
                event_type=NotificationEventTypeOption.POST_BOOKING_HOST,  # Define this
                n_type=NotificationTypeOption.USER_NOTIFICATION,
                data={
                    "message": f"Booking for '{booking.listing.title}' by {guest_full_name} has ended. You can review your guest.",
                    "link": f"/host/bookings/{booking.invoice_no}/review-guest/",  # Example link
                    "booking_id": str(booking.id)
                },
                user_id=host_id
            )
            Notification.objects.create(**host_in_app_data)
            send_channels_notification([host_in_app_data])

            host_push_title = "Booking Concluded"
            host_push_body = f"The booking by {guest_full_name} at '{booking.listing.title}' has ended."
            host_push_data = {"type": "post_booking_review_guest", "booking_id": str(booking.id)}
            send_native_push_notification(user_id=host_id, title=host_push_title, body=host_push_body,
                                          data=host_push_data)
            print(f"Task: Post-booking notifications sent to host ID {host_id} for booking {booking_id}")


        else:
            print(
                f"Task: Post-booking for booking ID {booking_id} skipped. Check-out: {booking.check_out}, Status: {booking.status}")

    except Booking.DoesNotExist:
        print(f"Task: Booking ID {booking_id} not found for post-booking notification.")
    except Exception as e:
        print(f"Task: Error in send_post_booking_notification_task for booking ID {booking_id}: {e}")



@shared_task(name="check_and_send_post_booking_notifications_periodic")
def check_and_send_post_booking_notifications_periodic():
    yesterday = timezone.now().date() - timedelta(days=1)
    ended_bookings = Booking.objects.filter(
        check_out=yesterday,
        status__in=[BookingStatusOption.CONFIRMED]

    ).only('id')

    print(
        f"Periodic Task: Found {ended_bookings.count()} bookings that ended on {yesterday} to check for post-booking notifications.")
    for booking in ended_bookings:
        send_post_booking_notification_task.delay(booking.id)
