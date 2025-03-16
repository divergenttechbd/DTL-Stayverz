import json
import jwt
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from rest_framework.generics import views, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from accounts.models import UserProfile
from accounts.serializers import (
    HostGuestUserSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserProfileSerializer,
    UserSerializer,
    LoginSerializer,
)
from accounts.tasks.users import send_sms
from base.helpers.mongo_query import create_user
from bookings.models import ListingBookingReview
from bookings.serializers import BookingReviewSerializer
from accounts.utils.token import create_tokens, generate_cookie_data
from base.cache.redis_cache import set_cache
from base.helpers.decorators import exception_handler
from base.type_choices import (
    ListingStatusOption,
    NotificationEventTypeOption,
    NotificationTypeOption,
    UserTypeOption,
)
from base.helpers.constants import OtpScopeOption
from listings.models import Listing
from listings.serializers import ListingSerializer
from notifications.models import Notification
from notifications.utils import create_notification, send_notification
from otp.service import OtpService
from wishlists.models import Wishlist


User = get_user_model()


class PublicUserRegisterAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = f"{request.data['phone_number']}_{request.data['u_type']}"
        if User.objects.filter(username=username).exists():
            return Response(
                {"message": "User already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=username,
            scope=OtpScopeOption.REGISTER,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )

        request.data["password"] = make_password(request.data["password"])
        request.data["username"] = username

        name_parts = request.data["full_name"].split()

        request.data["first_name"] = name_parts[0]
        request.data["last_name"] = (
            " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
        )
        request.data["wishlist_listings"] = []

        serializer = HostGuestUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event_type = NotificationEventTypeOption.SIGN_UP
        user_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": "",
                "message": "Congratulations ! You’ve successfully joined Stayverz community. It’s time to setup your profile",
                "link": f"/profile/verify-profile",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
        )

        admin_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": "",
                "message": f"Congralutations ! You have a new {request.data['u_type']} onboard.",
            },
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
        )

        if serializer.is_valid(raise_exception=True):
            with transaction.atomic():
                user = serializer.save()
                UserProfile.objects.create(user=user, languages=[])
                Wishlist.objects.create(user=user)
                user_notification["user_id"] = user.id
                admin_notification["data"][
                    "link"
                ] = f"{settings.FRONTEND_ADMIN_BASE_URL}/user/{user.id}/edit"
                Notification.objects.bulk_create(
                    [
                        Notification(**item)
                        for item in [user_notification, admin_notification]
                    ]
                )
                create_user(serializer.data)

            OtpService.delete_otp(username=username, scope=OtpScopeOption.REGISTER)
            set_cache(
                key=f"{username}_token_data",
                value=json.dumps(
                    UserSerializer(
                        user, fields=["id", "username", "u_type", "phone_number"]
                    ).data
                ),
                ttl=5 * 60 * 60,
            )

            access_token, refresh_token = create_tokens(user=user)
            data = {
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
            send_sms(
                username=user.phone_number,
                message="Congratulations ! You’ve successfully joined Stayverz community",
            )
            send_notification(notification_data=[user_notification, admin_notification])
            return Response(
                data,
                status=status.HTTP_201_CREATED,
            )


class PublicUserResetPasswordAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = f"{request.data['phone_number']}_{request.data['u_type']}"
        user = User.objects.get(username=username)

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=username,
            scope=OtpScopeOption.RESET_PASSWORD,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )

        OtpService.delete_otp(username=username, scope=OtpScopeOption.RESET_PASSWORD)
        password = request.data["password"]
        user.set_password(raw_password=password)
        user.save()

        access_token, refresh_token = create_tokens(user=user)
        data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class PublicAdminResetPasswordAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        username = request.data["email"]
        filter_params = {"username": username, "is_staff": True}
        user = User.objects.get(**filter_params)

        if not OtpService.get_otp(
            username=username, scope=OtpScopeOption.RESET_PASSWORD
        ):
            OtpService.create_otp(
                username=username,
                scope=OtpScopeOption.RESET_PASSWORD,
                is_email=True,
                to_email=username,
            )
            return Response(
                {"message": "Otp send successfully"}, status=status.HTTP_200_OK
            )

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=username,
            scope=OtpScopeOption.RESET_PASSWORD,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )

        OtpService.delete_otp(username=username, scope=OtpScopeOption.RESET_PASSWORD)
        user.set_password(raw_password=request.data["password"])
        user.save()

        access_token, refresh_token = create_tokens(user=user)
        data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class PublicUserLoginAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request):
        response = Response()
        if request.data.get("email"):
            username = request.data.get("email")
            filter_params = {"username": username, "is_staff": True}
        else:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            username = f"{request.data['phone_number']}_{request.data['u_type']}"
            filter_params = {"username": username, "is_staff": False}

        try:
            user = User.objects.get(**filter_params)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_active:
            return Response(
                {"message": f"You account is {user.status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(raw_password=request.data["password"]):
            return Response(
                {"message": "invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        access_token, refresh_token = create_tokens(user=user)
        data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
        set_cache(
            key=f"{username}_token_data",
            value=json.dumps(
                UserSerializer(
                    user, fields=["id", "username", "u_type", "phone_number"]
                ).data
            ),
            ttl=5 * 60 * 60,
        )
        cookie_data = generate_cookie_data("bearer " + data["access_token"])
        response.set_cookie(**cookie_data)

        response.data = {
            "Success": "Login successfully",
            "data": data,
            "status": status.HTTP_201_CREATED,
        }

        return response
        # return Response(data=data, status=status.HTTP_201_CREATED)


class RefreshTokenAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request):
        refreshed_token = request.data.get("refresh_token")
        try:
            payload = jwt.decode(
                jwt=refreshed_token,
                key=settings.SECRET_KEY,
                algorithms="HS256",
                verify=True,
            )
            if payload["token_type"] != "refresh":
                return Response(
                    {"message": "no refresh token provided", "success": False},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user_name = payload.get("username")
            user_obj = get_object_or_404(User, username=user_name)
            # if get_cache(f"{user_obj.username}_token_data"):
            #     return Response(
            #         {"message": "Already have a valid token"},
            #         status=status.HTTP_401_UNAUTHORIZED,
            #     )
            if not user_obj.is_active:
                return Response(
                    {"message": "user is not active"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            access_token, refresh_token = create_tokens(user=user_obj)
            set_cache(
                key=f"{user_obj.username}_token_data",
                value=json.dumps(
                    UserSerializer(
                        user_obj, fields=["id", "username", "u_type", "phone_number"]
                    ).data
                ),
                ttl=5 * 60 * 60,
            )
            data = {
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
            response = Response()
            cookie_data = generate_cookie_data("bearer " + data["access_token"])
            response.set_cookie(**cookie_data)

            response.data = {
                "Success": "Login successfully",
                "data": data,
                "status": status.HTTP_201_CREATED,
            }
            return response
            # return Response(data=data, status=status.HTTP_201_CREATED)
        except Exception as err:
            return Response(
                data={
                    "message": f"{str(err)}",
                    "success": False,
                },
                status=401,
            )


class PublicUserProfileAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=kwargs.get("pk"))
        user_data = UserSerializer(
            user,
            fields=[
                "id",
                "first_name",
                "last_name",
                "username",
                "phone_number",
                "email",
                "is_active",
                "status",
                "is_phone_verified",
                "is_email_verified",
                "u_type",
                "image",
                "date_joined",
                "full_name",
                "identity_verification_status",
                "avg_rating",
                "total_rating_count",
                "wishlist_listings",
            ],
        ).data
        user_data["profile"] = (
            UserProfileSerializer(user.userprofile).data
            if hasattr(user, "userprofile")
            else None
        )

        if not request.GET.get("is_chat"):
            latest_reviews = (
                ListingBookingReview.objects.filter(
                    review_for_id=user.id,
                )
                .select_related("review_by", "listing")
                .order_by("-created_at")[:2]
            )
            user_data["latest_reviews"] = BookingReviewSerializer(
                latest_reviews, many=True, r_method_fields=["review_by", "listing"]
            ).data
            if user.u_type == UserTypeOption.HOST:
                listings = Listing.objects.filter(
                    host_id=user.id, status=ListingStatusOption.PUBLISHED
                ).only("title", "address", "cover_photo", "avg_rating", "unique_id")
                user_data["listings"] = ListingSerializer(
                    listings,
                    many=True,
                    fields=[
                        "title",
                        "address",
                        "cover_photo",
                        "avg_rating",
                        "unique_id",
                    ],
                ).data
        return Response(data=user_data, status=status.HTTP_200_OK)


class PublicUserReviewListApi(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BookingReviewSerializer
    swagger_tags = ["Auth"]

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["r_method_fields"] = ["review_by", "listing"]
        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        user = User.objects.get(id=self.kwargs.get("user_id"))
        if self.request.GET.get("my_reviews") == "true":
            qs = ListingBookingReview.objects.filter(review_for_id=user.id)
        else:
            qs = ListingBookingReview.objects.filter(review_by_id=user.id)

        return qs.select_related("review_by", "listing")
