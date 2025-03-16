from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,
)
from rest_framework.views import APIView
from base.helpers.constants import OtpScopeOption
from base.helpers.decorators import exception_handler
from base.permissions import HostUserHasObjectAccess, IsHostUser
from base.type_choices import NotificationEventTypeOption, NotificationTypeOption
from notifications.models import Notification
from notifications.utils import create_notification, send_notification
from otp.service import OtpService
from payments.filters import HostPaymentFilter
from payments.models import HostPayMethod, HostPayment, HostPaymentItem
from payments.serializers import (
    HostPayMethodSerializer,
    HostPaymentItemSerializer,
    HostPaymentSerializer,
)


class HostPayMethodListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsHostUser)
    serializer_class = HostPayMethodSerializer
    http_method_names = ["get", "post"]
    swagger_tags = ["Host Payments"]

    def get_queryset(self):
        return HostPayMethod.objects.filter(
            host_id=self.request.user.id,
        ).order_by("-created_at")

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=request.user.username,
            scope=OtpScopeOption.PAYMENT_METHOD,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )

        request.data["host"] = request.user.id
        serializer = HostPayMethodSerializer(data=request.data)

        event_type = NotificationEventTypeOption.PAYMENT_METHOD
        host_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": "",
                "message": "Congratulations ! Your payment method is added successfully",
                "link": f"/host-dashboard/payouts",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=request.user.id,
        )

        if serializer.is_valid(raise_exception=True):
            if serializer.validated_data.get("is_default", False):
                HostPayMethod.objects.filter(host_id=request.user.id).update(
                    is_default=False
                )

            serializer.save()
            Notification.objects.create(**host_notification)

            OtpService.delete_otp(
                username=request.user.username, scope=OtpScopeOption.PAYMENT_METHOD
            )

            send_notification(notification_data=[host_notification])

            return Response(serializer.data, status=status.HTTP_201_CREATED)


class HostPayMethodRetrieveUpdateAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsHostUser, HostUserHasObjectAccess)
    queryset = HostPayMethod.objects.filter()
    serializer_class = HostPayMethodSerializer
    removeable_keys = (
        "host",
        "m_type",
    )
    swagger_tags = ["Host Payments"]

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=request.user.username,
            scope=OtpScopeOption.PAYMENT_METHOD,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )

        instance = self.get_object()
        serializer = HostPayMethodSerializer(
            instance,
            data=request.data,
            partial=True,
            exclude_fields=self.removeable_keys,
        )
        if serializer.is_valid(raise_exception=True):
            if serializer.validated_data.get("is_default", False):
                HostPayMethod.objects.filter(host_id=request.user.id).update(
                    is_default=False
                )
            serializer.save()
            OtpService.delete_otp(
                username=request.user.username, scope=OtpScopeOption.PAYMENT_METHOD
            )
            return Response({"message": "Updated"}, status=status.HTTP_200_OK)

    @method_decorator(exception_handler)
    def delete(self, request, *args, **kwargs):
        if HostPayment.objects.filter(pay_method_id=kwargs.get("pk")).exists():
            return Response(
                {"message": "This pay method is already used for payments"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        HostPayMethod.objects.filter(id=kwargs.get("pk")).delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)


class HostPaymentListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsHostUser)
    serializer_class = HostPaymentSerializer
    filterset_class = HostPaymentFilter
    search_fields = ("invoice_no",)
    http_method_names = ["get"]
    swagger_tags = ["Host Payments"]

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["r_method_fields"] = ["host", "pay_method"]
        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        return (
            HostPayment.objects.filter(host_id=self.request.user.id)
            .select_related("host", "pay_method")
            .order_by("-created_at")
        )


class HostPaymentDetailAPIView(APIView):
    permission_classes = (IsAuthenticated, IsHostUser, HostUserHasObjectAccess)
    swagger_tags = ["Host Payments"]

    def get(self, request, *args, **kwargs):
        invoice_no = kwargs.get("invoice_no")
        instance = HostPayment.objects.get(invoice_no=invoice_no)

        self.check_object_permissions(request, instance)

        host_payment_items = HostPaymentItem.objects.filter(host_payment_id=instance.id)
        host_payment_item_data = HostPaymentItemSerializer(
            host_payment_items, many=True
        ).data

        return Response(host_payment_item_data, status=status.HTTP_200_OK)
