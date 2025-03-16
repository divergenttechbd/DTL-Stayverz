from datetime import datetime, timedelta
from django.db import transaction
from django.conf import settings
from django.db.models import F
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, views
from rest_framework.response import Response
from accounts.tasks.users import send_sms
from base.helpers.decorators import exception_handler
from base.permissions import (
    HostUserHasObjectAccess,
    IsGuestUser,
)
from base.type_choices import (
    BookingStatusOption,
    NotificationEventTypeOption,
    NotificationTypeOption,
    ServiceChargeTypeOption,
    UserTypeOption,
)
from base.mongo.connection import connect_mongo
from bookings.filters import UserBookingFilter
from bookings.models import Booking, ListingBookingReview
from bookings.serializers import BookingReviewSerializer, BookingSerializer
from bookings.tasks.booking_cancel import booking_cancelled_process
from bookings.views.service import BookingReviewProcess, GuestBookingProcess
from configurations.models import ServiceCharge
from listings.models import Listing, ListingCalendar
from notifications.models import Notification
from notifications.utils import create_notification, send_notification


class GuestBookingListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    serializer_class = BookingSerializer
    filterset_class = UserBookingFilter
    http_method_names = ["get", "post"]
    swagger_tags = ["Gust Bookings"]

    def get_queryset(self):
        return (
            Booking.objects.exclude(status=BookingStatusOption.INITIATED)
            .filter(
                guest_id=self.request.user.id,
            )
            .select_related("listing", "host")
            .order_by("-created_at")
        )

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["rw_method_fields"] = ["listing"]
        kwargs["r_method_fields"] = ["host"]
        return self.serializer_class(*args, **kwargs)

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        processed_data = GuestBookingProcess()(request.data, request.user)

        if processed_data["status"] != 200:
            return Response(
                {"message": processed_data["message"]}, status=processed_data["status"]
            )

        serializer = self.serializer_class(data=processed_data["data"])
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GuestBookingRetrieveAPIView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    swagger_tags = ["Gust Bookings"]

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        booking = Booking.objects.select_related("listing", "host").get(
            invoice_no=kwargs.get("invoice_no"),
            guest_id=request.user.id,
            # status=BookingStatusOption.CONFIRMED,
        )

        result = {}
        data = BookingSerializer(
            booking,
            many=False,
            r_method_fields=["listing", "host"],
            fields=[
                "id",
                "invoice_no",
                "reservation_code",
                "check_in",
                "check_out",
                "night_count",
                "guest_service_charge",
                "price",
                "total_price",
                "paid_amount",
                "price_info",
                "guest_review_done",
                "status",
                "guest_count",
                "adult_count",
                "children_count",
                "infant_count",
            ],
        ).data

        result["booking_data"] = data
        result["review_data"] = None

        if booking.guest_review_done and request.GET.get("is_review"):
            guest_booking_review = ListingBookingReview.objects.filter(
                booking_id=booking.id, review_by_id=request.user.id
            ).first()
            if guest_booking_review:
                result["review_data"] = {
                    "review": guest_booking_review.review,
                    "rating": guest_booking_review.rating,
                    "image": request.user.image,
                    "full_name": request.user.get_full_name(),
                    "created_at": str(guest_booking_review.created_at),
                }
        with connect_mongo() as collections:
            room_name = f"{request.user.username}:{booking.host.username}"
            chat_room = collections["ChatRoom"].find_one({"name": room_name}) or {}
            result["chat_room"] = str(chat_room.get("_id"))
        return Response(result, status=status.HTTP_200_OK)


class GuestBookingReviewAPIView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    swagger_tags = ["Gust Bookings"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        rating = request.data["rating"]
        review = request.data["review"]
        booking_review_process = BookingReviewProcess()
        booking_review_data = booking_review_process.validate_booking_review_data(
            data=request.data.copy(),
            invoice_no=kwargs.get("invoice_no"),
            user=request.user,
        )

        if booking_review_data.get("status") != 200:
            return Response(
                {"message": booking_review_data.get("message")},
                status=booking_review_data.get("status"),
            )

        booking_obj = booking_review_data.get("booking_obj")

        event_type = NotificationEventTypeOption.REVIEW
        host_notification = create_notification(
            event_type=event_type,
            data={
                # "identifier": str(booking_review.id),
                "message": f"Surprise ! You’ve got a new review from {booking_obj.host.get_full_name()}",
                "link": f"/profile",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=booking_obj.host.id,
        )
        guest_notification = create_notification(
            event_type=event_type,
            data={
                # "identifier": str(booking_review.id),
                "message": f"Congratulation! Your review has been placed successfully.",
                "link": f"/profile",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=request.user.id,
        )

        admin_notification = create_notification(
            event_type=event_type,
            data={
                # "identifier": str(booking_review.id),
                "message": f"A new review has been placed from {request.user.get_full_name()}",
                "link": f"/reviews",
            },
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
        )

        notification_data = [
            host_notification,
            guest_notification,
            admin_notification,
        ]

        with transaction.atomic():
            booking_review = ListingBookingReview.objects.create(
                **booking_review_data.get("review_data")
            )
            booking_review_process.update_ratings(booking_review.listing, rating)
            booking_review_process.update_ratings(booking_obj.host, rating)

            for i in range(0, 3):
                notification_data[i]["data"]["identifier"] = str(booking_review.id)

            if request.user.u_type == UserTypeOption.GUEST:
                booking_obj.guest_review_done = True
            else:
                booking_obj.host_review_done = True
            booking_obj.save()

            Notification.objects.bulk_create(
                [Notification(**item) for item in notification_data]
            )

        send_notification(notification_data=notification_data)

        return Response({"message": "Review created"}, status=status.HTTP_201_CREATED)


class GuestBookingReviewRetrieveAPIView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    swagger_tags = ["Gust Bookings"]

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        booking_review = ListingBookingReview.objects.get(
            id=kwargs.get("pk"), review_by_id=request.user.id
        )

        if not booking_review.is_host_review or not booking_review.is_guest_review:
            return Response(
                {"message": "You can not see the review yet"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = BookingReviewSerializer(booking_review, many=False), data
        return Response(data, status=status.HTTP_200_OK)


class GuestBookingCancelAPIView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser, HostUserHasObjectAccess)
    swagger_tags = ["Gust Bookings"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        invoice_no = kwargs.get("invoice_no")
        cancellation_reason = request.data["cancellation_reason"]

        current_date = datetime.now().date()
        booking = Booking.objects.get(
            invoice_no=invoice_no,
            guest_id=request.user.id,
            status=BookingStatusOption.CONFIRMED,
        )

        if booking.check_in < current_date:
            return Response(
                {"message": "Booking can only be cancelled before check in date"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        listing = booking.listing

        listing_calendar_ids = [
            d.get("id") for d in booking.calendar_info if d.get("id")
        ]

        cancellation_policy = listing.cancellation_policy
        cancellation_deadline = cancellation_policy.get("cancellation_deadline")
        refund_percentage = cancellation_policy.get("refund_percentage")
        days_before_check_in = booking.check_in - timedelta(days=cancellation_deadline)

        if refund_percentage != 0 and current_date <= days_before_check_in:
            host_service_charge = ServiceCharge.objects.filter(
                sc_type=ServiceChargeTypeOption.HOST_CHARGE
            ).first()
            host_service_charge_value = (
                host_service_charge.value / 100
                if host_service_charge.calculation_type == "percentage"
                else host_service_charge.value
            )

            refund_amount = (refund_percentage / 100) * booking.price
            host_service_charge_amount = round(
                host_service_charge_value * refund_amount
            )

            host_pay_out = refund_amount - host_service_charge_amount
            booking.host_pay_out = host_pay_out
            booking.host_service_charge = host_service_charge_amount
            booking.refund_amount = refund_amount
            booking.is_refunded = True

        booking.status = BookingStatusOption.CANCELLED
        booking.cancellation_reason = cancellation_reason

        with transaction.atomic():
            booking.save()
            if len(listing_calendar_ids) > 0:
                ListingCalendar.objects.filter(id__in=listing_calendar_ids).delete()

        send_sms(
            username=booking.guest.phone_number,
            message="You’ve successfully cancelled your booking",
        )
        send_sms(
            username=booking.host.phone_number,
            message="A guest cancelled booking just now",
        )

        booking_cancelled_process.delay(booking_id=booking.id)  # delay

        return Response(
            {"message": "Booking cancellation done"}, status=status.HTTP_200_OK
        )
