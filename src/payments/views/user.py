from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.db import IntegrityError
from django.http import HttpResponsePermanentRedirect
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.generics import CreateAPIView, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.serializers import UserSerializer

from accounts.tasks.users import send_sms
from base.helpers.decorators import exception_handler
from base.helpers.utils import identifier_builder
from base.type_choices import (
    BookingStatusOption,
    OnlinePaymentMethodOption,
    OnlinePaymentStatusOption,
    PaymentStatusOption,
)
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from listings.models import Listing, ListingCalendar
from payments.models import OnlinePayment
from payments.serializers import OnlinePaymentSerializer
from payments.tasks.booking import booking_confirmed_process
from payments.views.service import (
    sslcommerz_payment_create,
    sslcommerz_payment_validation,
)


class UserSSLCommerzOrderPaymentView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = OnlinePaymentSerializer
    swagger_tags = ["Payments"]

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        booking = get_object_or_404(Booking, invoice_no=request.data["booking"])

        print(booking)
        if booking.guest_payment_status == PaymentStatusOption.PAID:
            return Response(
                {"message": "Payment already done for the booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        transaction_number = identifier_builder(
            table_name="payments_onlinepayment", prefix="PGDBK"
        )
        reservation_code = identifier_builder(
            table_name="bookings_booking", prefix="RES"
        )
        request.data["payment_method"] = OnlinePaymentMethodOption.SSL_COMMERZ
        request.data["user"] = booking.guest_id
        request.data["amount"] = booking.total_price
        request.data["status"] = OnlinePaymentStatusOption.INITIATED
        request.data["transaction_number"] = transaction_number
        request.data["created_by"] = request.user.id
        request.data["booking"] = booking.id

        sslcommerz_data = {
            "ipn_url": f"{settings.BACKEND_BASE_URL}/payments/user/booking/sslcommerz/ipn/",
            "value_a": booking.id,
            "value_b": request.user.username,
            "num_of_item": 1,
            "product_name": "a,b",
            "product_category": "Deliverable",
            "product_profile": "physical-goods",
            "total_amount": booking.total_price,
            "tran_id": transaction_number,
            "success_url": f"{settings.BACKEND_BASE_URL}/payments/user/booking/success/{booking.invoice_no}/",
            "fail_url": f"{settings.BACKEND_BASE_URL}/payments/user/booking/fail/{booking.invoice_no}/",
            "cancel_url": f"{settings.BACKEND_BASE_URL}/payments/user/booking/cancel/{booking.invoice_no}/",
        }

        response = sslcommerz_payment_create(
            data=sslcommerz_data, customer=request.user
        )
        if not response:
            return Response(
                {"message": "Error response from SSlCommerz"},
                status=status.HTTP_417_EXPECTATION_FAILED,
            )
        res_data = {
            "payment_gateway_url": response["GatewayPageURL"],
            "logo": response["storeLogo"],
            # "store_name": response["store_name"],
        }
        try:
            # super(UserSSLCommerzOrderPaymentView, self).create(request, *args, **kwargs)
            serializer = OnlinePaymentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            with transaction.atomic():
                serializer.save()
                booking.pgw_transaction_number = transaction_number
                booking.reservation_code = reservation_code
                booking.save()
            return Response(res_data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {"message": "Error initializing SSLCommerz payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CustomerSSLCommerzIPNView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            if (
                not request.data.get("tran_id")
                or not request.data.get("value_a")
                or not request.data.get("value_b")
            ):
                return Response(
                    {"message": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST
                )
            online_payment = OnlinePayment.objects.get(
                transaction_number=request.data["tran_id"],
                status=OnlinePaymentStatusOption.INITIATED,
            )
            online_payment.has_hit_ipn = True
            booking = online_payment.booking

            if not request.data.get("status") == "VALID":
                online_payment.status = OnlinePaymentStatusOption.CANCELLED
                online_payment.meta = self.request.data
                online_payment.save()
                return Response(
                    {"message": "Payment is invalid"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            params = {
                "val_id": request.data.get("val_id"),
            }
            response = sslcommerz_payment_validation(query_params=params)
            if not response:
                return Response(
                    {"message": "No response from SSLCommerz validation API"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            online_payment.meta = {
                "ipn_response": self.request.data,
                "validation_response": response,
            }

            with transaction.atomic():
                if response.get("risk_level") == "0":
                    online_payment.status = OnlinePaymentStatusOption.COMPLETED

                    booking.guest_payment_status = PaymentStatusOption.PAID
                    booking.status = BookingStatusOption.CONFIRMED
                    booking.paid_amount = online_payment.amount

                    Listing.objects.filter(id=booking.listing_id).update(
                        total_booking_count=F("total_booking_count") + 1
                    )

                    booking_data = {
                        "user": UserSerializer(
                            booking.guest,
                            fields=[
                                "id",
                                "full_name",
                                "image",
                                "u_type",
                                "phone_number",
                                "email",
                            ],
                        ).data,
                        "booking": BookingSerializer(
                            booking, fields=["id", "invoice_no", "reservation_code"]
                        ).data,
                    }

                    for entry in booking.calendar_info:
                        start_date = entry["start_date"]
                        end_date = entry["end_date"]

                        defaults = {
                            "base_price": entry["base_price"],
                            "custom_price": entry["price"],
                            "is_blocked": entry["is_blocked"],
                            "is_booked": entry["is_booked"],
                            "booking_data": booking_data,
                        }

                        obj, created = ListingCalendar.objects.update_or_create(
                            listing_id=entry["listing_id"],
                            start_date=start_date,
                            end_date=end_date,
                            defaults=defaults,
                        )

                        # if not created:
                        #     for key, value in defaults.items():
                        #         setattr(obj, key, value)
                        #     obj.save()

                        entry["id"] = obj.id

                    booking.save()

                    host = booking.host
                    host.total_sell_amount = (
                        host.total_sell_amount + booking.paid_amount
                    )
                    host.save()
                    online_payment.save()

                send_sms(
                    username=booking.guest.phone_number,
                    message="Congratulations ! You’ve successfully completed your booking",
                )
                send_sms(
                    username=host.phone_number,
                    message="Congratulations ! A guest booked your property just now",
                )
                booking_confirmed_process.delay(booking_id=booking.id)  # delay

            return Response(
                {"message": "Payment request received"}, status=status.HTTP_201_CREATED
            )
        except OnlinePayment.DoesNotExist:
            return Response(
                {"message": "Invalid payment attempted", "data": request.data},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaymentRedirectAPIView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        return HttpResponsePermanentRedirect(
            f"{settings.FRONTEND_BASE_URL}/checkout/{kwargs.get('status')}/{kwargs.get('invoice_no')}"
        )
