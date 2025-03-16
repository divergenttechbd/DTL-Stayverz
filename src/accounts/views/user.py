from bson import ObjectId
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import (
    ChangePasswordSerializer,
    HostGuestUserSerializer,
    UserIdentityVerificationSerializer,
    UserProfileSerializer,
)
from base.cache.redis_cache import delete_cache, set_cache
from base.helpers.decorators import exception_handler
from base.helpers.mongo_query import mongo_update_user
from base.mongo.connection import connect_mongo
from base.type_choices import (
    IdentityVerificationStatusOption,
    ListingStatusOption,
    NotificationEventTypeOption,
    NotificationTypeOption,
    UserTypeOption,
)
from base.helpers.constants import OtpScopeOption
from bookings.models import ListingBookingReview
from bookings.serializers import BookingReviewSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer
from notifications.models import Notification
from notifications.utils import create_notification, send_notification
from otp.service import OtpService


User = get_user_model()


class UserProfileRetrieveUpdateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ["get", "patch"]
    swagger_tags = ["User Profile"]
    removeable_keys = ("user",)

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        user = self.request.user
        user_data = HostGuestUserSerializer(user).data
        user_data["profile"] = (
            UserProfileSerializer(request.user.userprofile).data
            if hasattr(request.user, "userprofile")
            else None
        )
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
                fields=["title", "address", "cover_photo", "avg_rating", "unique_id"],
            ).data

        with connect_mongo() as collections:
            mongo_user_id = collections["User"].find_one(
                {"username": request.user.username}
            )

            if mongo_user_id["u_type"] == "guest":
                user_all_room = collections["ChatRoom"].find(
                    {"from_user.$id": ObjectId(mongo_user_id["_id"])}
                )
            else:
                user_all_room = collections["ChatRoom"].find(
                    {"to_user.$id": ObjectId(mongo_user_id["_id"])}
                )

            total_unread_msg_count = 0
            for room in user_all_room:
                other_user_id = (
                    room["from_user"].id
                    if mongo_user_id["_id"] == room["to_user"].id
                    else room["to_user"].id
                )
                individual_chat_room_msg_count = collections["Message"].count_documents(
                    {
                        "chat_room.$id": ObjectId(room["_id"]),
                        "user.$id": ObjectId(other_user_id),
                        "is_read": False,
                    }
                )
                if individual_chat_room_msg_count > 0:
                    total_unread_msg_count += 1
            user_data["unread_message_count"] = total_unread_msg_count
        return Response(data=user_data, status=status.HTTP_200_OK)

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        instance = self.request.user.userprofile
        serializer = UserProfileSerializer(
            instance=instance,
            data=request.data,
            partial=True,
            exclude_fields=self.removeable_keys,
        )
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
            if request.data.get("image"):
                user = request.user
                user.image = request.data.get("image")
                user.save()
                mongo_update_user(
                    data={
                        "image": request.data.get("image"),
                        "username": request.user.username,
                    }
                )
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUnreadMessageCountAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        with connect_mongo() as collections:
            mongo_user_id = collections["User"].find_one(
                {"username": request.user.username}
            )

            if mongo_user_id["u_type"] == "guest":
                user_all_room = collections["ChatRoom"].find(
                    {"from_user.$id": ObjectId(mongo_user_id["_id"])}
                )
            else:
                user_all_room = collections["ChatRoom"].find(
                    {"to_user.$id": ObjectId(mongo_user_id["_id"])}
                )

            total_unread_msg_count = 0
            for room in user_all_room:
                # other_user_id = (
                #     room["from_user"].id
                #     if mongo_user_id["_id"] == room["to_user"].id
                #     else room["to_user"].id
                # )

                chat_room_user_ids = [room["to_user"].id, room["from_user"].id]
                other_user_id = (
                    chat_room_user_ids[1]
                    if chat_room_user_ids[0] == mongo_user_id["_id"]
                    else chat_room_user_ids[0]
                )

                individual_chat_room_msg_count = collections["Message"].count_documents(
                    {
                        "chat_room.$id": ObjectId(room["_id"]),
                        "user.$id": ObjectId(other_user_id),
                        "is_read": False,
                    }
                )
                if individual_chat_room_msg_count > 0:
                    total_unread_msg_count += 1
            data = {"unread_message_count": total_unread_msg_count}
        return Response(data=data, status=status.HTTP_200_OK)


class UserIdentityVerificationAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ["get", "post"]
    swagger_tags = ["User Profile"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        user = request.user
        if (
            user.identity_verification_status
            == IdentityVerificationStatusOption.VERIFIED
        ):
            return Response(
                {"message": "Already verified"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserIdentityVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event_type = NotificationEventTypeOption.USER_VERIFICATION
        user_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": str(user.id),
                "message": f"Thank you ! Your submission for identity verification is currently under review",
                "link": f"/profile/verify-profile",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
            user_id=user.id,
        )

        admin_notification = create_notification(
            event_type=event_type,
            data={
                "identifier": str(user.id),
                "message": f"A new submission for identity verification from {user.get_full_name()}.",
                "link": f"/user/{user.id}/edit",
            },
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
        )
        notification_data = [
            user_notification,
            admin_notification,
        ]

        user.identity_verification_images = {
            "front_image": request.data["front_image"],
            "back_image": request.data.get("back_image"),
        }
        user.identity_verification_method = request.data["document_type"]
        user.identity_verification_status = IdentityVerificationStatusOption.PENDING
        with transaction.atomic():
            user.save()
            Notification.objects.bulk_create(
                [Notification(**item) for item in notification_data]
            )

        send_notification(notification_data=notification_data)
        return Response(
            {"message": "Successfully submitted"}, status=status.HTTP_200_OK
        )


class UserEmailVerificationAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    http_method_names = ["get", "post"]
    swagger_tags = ["User Profile"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        user = request.user
        username = user.username
        email = request.data["email"]

        if User.objects.filter(email=email, u_type=user.u_type).exists():
            return Response(
                {"message": "Email already is used"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=username,
            scope=OtpScopeOption.EMAIL_VERIFY,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )
        user.is_email_verified = True
        user.email = email
        user.save()

        OtpService.delete_otp(username=username, scope=OtpScopeOption.EMAIL_VERIFY)
        return Response(
            {
                "message": "Email verification successfully done",
            },
            status=status.HTTP_200_OK,
        )


class UserPasswordChange(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response(
                    {"message": "Wrong password."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password(serializer.validated_data.get("new_password"))
            user.save()
            return Response(
                {"message": "Password updated successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserReviewListApi(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BookingReviewSerializer
    swagger_tags = ["User Profile"]

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["r_method_fields"] = ["review_by", "listing"]
        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        if self.request.GET.get("my_reviews") == "true":
            qs = ListingBookingReview.objects.filter(review_for_id=self.request.user.id)
        else:
            qs = ListingBookingReview.objects.filter(review_by_id=self.request.user.id)

        return qs.select_related("review_by", "listing")


@api_view(["DELETE"])
@permission_classes([AllowAny])
def logout(request: Request) -> Response:
    delete_cache(f"{request.user.username}_token_data")
    delete_cache(key=f"user_mobile_logged_in_{request.user.username}")
    response = Response()
    for cookie_name in request.COOKIES:
        response.set_cookie(
            cookie_name,
            "",
            max_age=0,
            expires="Thu, 01 Jan 1970 00:00:00 GMT",
            secure=True,
            httponly=True,
            samesite="None",
            domain=".stayverz.com",
        )
    response.status_code = status.HTTP_200_OK
    response.data = {
        "status": status.HTTP_200_OK,
        "data": [],
        "message": "Logout out successfully",
    }
    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@exception_handler
def mobile_login(request: Request) -> Response:
    data = request.data["action"]
    login = data == "login"

    set_cache(
        key=f"user_mobile_logged_in_{request.user.username}",
        value=login,
        ttl=5 * 60 * 60,
    )

    return Response({"message": "success"}, status=status.HTTP_200_OK)
