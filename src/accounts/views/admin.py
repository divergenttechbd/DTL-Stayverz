from datetime import datetime
import io
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.conf import settings
from django.db import transaction
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.utils.decorators import method_decorator
import pytz
from drf_yasg.utils import swagger_auto_schema
from rest_framework.renderers import JSONRenderer

from accounts.models import UserDTL
from base.cache.redis_cache import get_cache
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from accounts.fields import ADMIN_STAFF_FIELD_LIST

from accounts.filters import UserFilter
from accounts.serializers import (
    HostGuestUserSerializer,
    StatusUpdateSerializer,
    UserProfileSerializer,
    UserSerializer, UserIdentityVerificationSerializer, UserDTLSerializer,
)
from base.helpers.decorators import exception_handler
from base.helpers.mongo_query import create_user
from base.helpers.utils import entries_to_remove, field_name_to_label
from base.permissions import IsStaff, IsSuperUser
from base.type_choices import (
    BookingStatusOption,
    NotificationEventTypeOption,
    NotificationTypeOption,
    UserRoleOption,
    UserStatusOption,
    UserTypeOption,
)
from bookings.models import Booking
from notifications.models import FCMToken, Notification
from notifications.tasks.notification import (
    send_fcm_notification,
    send_fcm_notification_without_task,
)
from notifications.utils import create_notification, send_notification
from django.http import HttpResponse
import xlsxwriter
from io import BytesIO

User = get_user_model()


def UserDTLetail(request, pk):
    print('--------------------')
    dtl = UserDTL.objects.get(id=pk)
    print(dtl.name)
    ser = UserDTLSerializer(dtl)
    print(ser.data)
    data = JSONRenderer().render(ser.data)
    print(data)
    return HttpResponse(data, content_type='application/json')


class AdminStaffListCreateApiView(ListCreateAPIView):
    permission_classes = (IsStaff,)
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_staff=True).order_by("-id")
    filterset_class = UserFilter
    swagger_tags = ["Admin Users"]

    def get_serializer(self, *args, **kwargs):
        kwargs["fields"] = ADMIN_STAFF_FIELD_LIST
        return self.serializer_class(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)
        response.data["user_status_count"] = list(
            User.objects.filter(is_staff=True)
            .values("status")
            .annotate(status_count=Count("status"))
            .order_by("status")
        )

        return response

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        if User.objects.filter(email=request.data["email"]).exists():
            return Response(
                {"message": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(phone_number=request.data["phone_number"]).exists():
            return Response(
                {"message": "Phone number already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.data["is_active"] = True
        request.data["is_staff"] = True
        request.data["u_type"] = UserTypeOption.SYSTEM
        request.data["is_superuser"] = (
            request.data["role"] == UserRoleOption.SUPER_ADMIN
        )
        request.data["username"] = request.data["email"]
        request.data["password"] = make_password(request.data["password"])
        request.data["wishlist_listings"] = []
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        create_user(serializer.data)
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
        # return super(AdminStaffListCreateApiView, self).create(request, *args, **kwargs)


class AdminStaffRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_staff=True)
    filterset_class = UserFilter
    swagger_tags = ["Admin Users"]
    removeable_keys = ("username", "password", "u_type")

    def get_serializer(self, *args, **kwargs):
        kwargs["fields"] = ADMIN_STAFF_FIELD_LIST
        return self.serializer_class(*args, **kwargs)

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.data.get("email") and (
            User.objects.filter(email=request.data["email"])
            .exclude(id=instance.id)
            .exists()
        ):
            return Response(
                {"message": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data.get("phone_number") and (
            User.objects.filter(phone_number=request.data["phone_number"])
            .exclude(id=instance.id)
            .exists()
        ):
            return Response(
                {"message": "Phone number already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.id == instance.id:
            return Response(
                {"message": "You can not update your self"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # if instance.is_superuser and request.data.get("status") != "active":
        #     return Response(
        #         {"message": "Super user status can not be restricted"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )

        updated_request_data = entries_to_remove(
            self.request.data, self.removeable_keys
        )
        request.data.update(updated_request_data)

        user_status = request.data.get("status", instance.status)
        request.data["status"] = user_status
        request.data["is_active"] = user_status == UserStatusOption.ACTIVE
        return super().patch(request, *args, **kwargs)


class AdminUserListApiView(ListAPIView):
    permission_classes = (IsStaff,)
    serializer_class = HostGuestUserSerializer
    queryset = User.objects.filter(is_staff=False).order_by("-created_at")
    filterset_class = UserFilter
    search_fields = (
        "email",
        "phone_number",
        "first_name",
        "last_name",
    )
    swagger_tags = ["Admin Users"]

    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)

        if request.GET.get("report_download") == "true":
            queryset = self.filter_queryset(self.get_queryset()).values(
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "u_type",
                "identity_verification_status",
                "date_joined",
            )
            headers = headers = [
                "first_name",
                "last_name",
                "email",
                "phone_number",
                "u_type",
                "identity_verification_status",
                "date_joined",
            ]
            output = BytesIO()
            workbook = xlsxwriter.Workbook(output, {"in_memory": True})
            worksheet = workbook.add_worksheet("Data")
            for col_num, header in enumerate(headers):
                worksheet.write(0, col_num, header)
            for row_num, row_data in enumerate(queryset, 1):
                for col_num, header in enumerate(headers):
                    cell_value = row_data[header]
                    if isinstance(cell_value, (dict, list)):
                        cell_value = str(
                            cell_value
                        )  # Convert dicts and lists to strings
                    if isinstance(cell_value, datetime):
                        cell_value = str(
                            cell_value.astimezone(pytz.timezone("Asia/Dhaka")).strftime(
                                "%Y-%m-%d"
                            )
                        )  # str(cell_value).split("T")[0]
                    worksheet.write(row_num, col_num, cell_value)
            workbook.close()
            output.seek(0)
            response = HttpResponse(
                output.read(),
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            response["Content-Disposition"] = 'attachment; filename="data.xlsx"'
            return response
        if request.GET.get("stats"):
            response.data["user_status_count"] = list(
                User.objects.filter(is_staff=False)
                .values("status")
                .annotate(status_count=Count("status"))
                .order_by("status")
            )
        return response


class AdminUserRetrieveUpdateAPIView(APIView):
    permission_classes = (IsStaff,)

    def get(self, request, *args, **kwargs):
        print(request.data)
        user = User.objects.get(id=kwargs.get("pk"), is_staff=False)
        userx = User.objects.get(id=67)
        print(userx)
        user_data = HostGuestUserSerializer(user).data
        user_data["profile"] = (
            UserProfileSerializer(
                user.userprofile, fields=["id", "languages", "bio"]
            ).data
            if hasattr(user, "userprofile")
            else None
        )
        return Response(data=user_data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=StatusUpdateSerializer)
    def patch(self, request, *args, **kwargs):
        serializer = StatusUpdateSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = User.objects.get(id=kwargs.get("pk"), is_staff=False)

            notification_data = []
            if serializer.validated_data.get("user_status") != user.status:
                event_type = NotificationEventTypeOption.USER_VERIFICATION
                user_notification = create_notification(
                    event_type=event_type,
                    data={
                        "identifier": str(user.id),
                        "message": f"Your submission for identity verification is {serializer.validated_data.get('identity_status')}",
                        "link": f"/user/profile",
                    },
                    n_type=NotificationTypeOption.USER_NOTIFICATION,
                    user_id=user.id,
                )

                admin_notification = create_notification(
                    event_type=event_type,
                    data={
                        "identifier": str(user.id),
                        "message": f"Identity verification {request.data.get('identity_status')} for a {user.get_full_name()}",
                        "link": f"/user/{user.id}/edit",
                    },
                    n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
                )
                notification_data = [
                    user_notification,
                    admin_notification,
                ]

            user_status = serializer.validated_data.get("user_status", user.status)
            identity_status = serializer.validated_data.get(
                "identity_status", user.identity_verification_status
            )
            user.status = user_status
            user.first_name = serializer.validated_data.get(
                "first_name", user.first_name
            )
            user.phone_number = serializer.validated_data.get(
                "phone_number", user.phone_number
            )
            user.email = serializer.validated_data.get(
                "email", user.email
            )
            user.last_name = serializer.validated_data.get("last_name", user.last_name)
            user.is_active = user_status == UserStatusOption.ACTIVE
            user.identity_verification_status = identity_status
            user.identity_verification_reject_reason = (
                serializer.validated_data.get("reject_reason", "")
                if identity_status == "rejected"
                else ""
            )
            with transaction.atomic():
                user.save()
                if len(notification_data) > 0:
                    Notification.objects.bulk_create(
                        [Notification(**item) for item in notification_data]
                    )

            if len(notification_data) > 0:
                send_notification(notification_data=notification_data)

            host_device_token = FCMToken.objects.filter(user_id=user.id).first()
            if host_device_token and get_cache(
                key=f"user_mobile_logged_in_{user.username}"
            ):
                fcm_title = "Inquiry Message"
                fcm_body = f"Your submission for identity verification is {serializer.validated_data.get('identity_status')}"

                fcm_data = {"url": f"/user/profile", "key2": "value2"}
                send_fcm_notification.delay(
                    host_device_token.token, fcm_title, fcm_body, fcm_data
                )

            return Response(
                {"message": "Status updated successfully."}, status=status.HTTP_200_OK
            )


class AdminDashboardStatAPIView(APIView):
    permission_classes = (IsStaff,)
    swagger_tags = ["Admin Dashboard"]

    def get(self, request, *args, **kwargs):
        current_month = now().month
        current_year, current_week, _ = now().isocalendar()

        current_year = now().year

        query_type = request.GET.get("query_type", "MONTHLY")

        if query_type == "MONTHLY":
            filter_params = {
                "updated_at__month": current_month,
                "updated_at__year": current_year,
            }
            user_filter = {
                "created_at__month": current_month,
                "created_at__year": current_year,
            }
        elif query_type == "YEARLY":
            filter_params = {
                "updated_at__year": current_year,
            }
            user_filter = {
                "created_at__year": current_year,
            }
        else:
            filter_params = {
                "updated_at__week": current_week,
                "updated_at__year": current_year,
            }
            user_filter = {
                "created_at__week": current_week,
                "created_at__year": current_year,
            }

        cancelled_booking_count = Booking.objects.filter(
            **filter_params, status=BookingStatusOption.CANCELLED
        ).count()

        user_count = User.objects.filter(
            **user_filter,
            is_staff=False,
        ).count()

        total_profit_filter_params = {
            k.replace("updated", "created"): v for k, v in filter_params.items()
        }

        success_booking_count = Booking.objects.filter(
            **total_profit_filter_params, status=BookingStatusOption.CONFIRMED
        ).count()

        total_profit = (
            Booking.objects.filter(
                **total_profit_filter_params, status=BookingStatusOption.CONFIRMED
            )
            .aggregate(total_profit=Sum("total_profit"))
            .get("total_profit")
            or 0
        )

        result = {
            "success_booking_count": success_booking_count,
            "cancelled_booking_count": cancelled_booking_count,
            "total_profit": total_profit,
            "user_count": user_count,
        }
        return Response({"data": result}, status=status.HTTP_200_OK)


class AdminBestSellingHostListAPIView(APIView):
    permission_classes = (IsStaff,)
    swagger_tags = ["Admin Dashboard"]

    def get(self, request, *args, **kwargs):
        current_month = now().month
        current_year, current_week, _ = now().isocalendar()

        query_type = request.GET.get("query_type", "MONTHLY")

        filter_params = {"u_type": "host"}
        if query_type == "MONTHLY":
            filter_params["updated_at__month"] = current_month
            filter_params["updated_at__year"] = current_year
        elif query_type == "YEARLY":
            filter_params["updated_at__year"] = current_year
        else:
            filter_params["updated_at__week"] = current_week
            filter_params["updated_at__year"] = current_year

        qs = (
            User.objects.filter(**filter_params)
            .only(
                "id",
                "username",
                "first_name",
                "last_name",
                "total_sell_amount",
                "total_property",
            )
            .order_by("-total_sell_amount")[:10]
        )

        data = UserSerializer(
            qs,
            many=True,
            fields=[
                "id",
                "username",
                "first_name",
                "last_name",
                "total_sell_amount",
                "total_property",
            ],
        ).data

        return Response({"data": data}, status=status.HTTP_200_OK)


class AdminUserReportDownloadAPIView(APIView):
    permission_classes = (IsStaff,)
    swagger_tags = ["Admin Dashboard"]

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        formatted_filters = {}
        if request.GET.get("u_type"):
            formatted_filters["u_type"] = request.GET.get("u_type")
        if request.GET.get("identity_verification_status"):
            formatted_filters["identity_verification_status"] = request.GET.get(
                "identity_verification_status"
            )
        if (
            request.GET.get("date_joined_gte")
            and request.GET.get("date_joined_gte") != None
        ):
            utc_date_time = datetime.strptime(
                request.GET.get("date_joined_gte"), "%Y-%m-%dT%H:%M:%S.%fZ"
            ).replace(tzinfo=pytz.utc)
            dhaka_timezone = pytz.timezone("Asia/Dhaka")
            dhaka_date_time = utc_date_time.astimezone(dhaka_timezone).date()
            formatted_filters["date_joined__gte"] = dhaka_date_time
        if (
            request.GET.get("date_joined_lte")
            and request.GET.get("date_joined_lte") != None
        ):
            utc_date_time = datetime.strptime(
                request.GET.get("date_joined_lte"), "%Y-%m-%dT%H:%M:%S.%fZ"
            ).replace(tzinfo=pytz.utc)
            dhaka_timezone = pytz.timezone("Asia/Dhaka")
            dhaka_date_time = utc_date_time.astimezone(dhaka_timezone).date()
            formatted_filters["date_joined__lte"] = dhaka_date_time

        qs = User.objects.filter(**formatted_filters)

        qs = qs.values(
            "first_name",
            "last_name",
            "phone_number",
            "u_type",
            "identity_verification_status",
            "date_joined",
        )

        output = io.BytesIO()

        # Create a workbook and add a worksheet
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet()

        # Define header titles
        headers = [
            "first_name",
            "last_name",
            "phone_number",
            "u_type",
            "identity_verification_status",
            "date_joined",
        ]

        for col, header in enumerate(headers):
            worksheet.write(0, col, field_name_to_label(header))

        for row, obj in enumerate(qs, start=1):
            for col, column in enumerate(headers):
                if isinstance(obj[column], datetime):
                    obj[column] = obj[column].date()
                worksheet.write(row, col, str(obj[column]))

        workbook.close()

        response = HttpResponse(content_type="application/vnd.ms-excel")
        response["Content-Disposition"] = 'attachment; filename="user_report.xlsx"'
        output.seek(0)
        response.write(output.getvalue())

        return response
