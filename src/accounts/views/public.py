import json
from uuid import UUID

import jwt
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

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
    LoginSerializer, RegisterSerializerRef,
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
from referrals.models import Referral, ReferralStatus, ReferralType
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

        #filter_params={'username': 'dominguezsusan', 'is_staff': False}
        user = User.objects.filter(**filter_params).first()
        print(user)
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

        # if not user.check_password(raw_password=request.data["password"]):
        #     return Response(
        #         {"message": "invalid credentials"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
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


class PublicUserRegisterAPIViewHost(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @swagger_auto_schema(
        request_body=RegisterSerializerRef,  # drf-yasg will use this serializer for the request body
        responses={
            201: openapi.Response(
                description="User registered successfully, returns access and refresh tokens.",
                examples={
                    "application/json": {
                        "access_token": "your_access_token_here",
                        "refresh_token": "your_refresh_token_here"
                    }
                }
            ),
            400: "Bad Request (e.g., user exists, invalid OTP, validation error)",
        }
    )

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializerRef(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        phone_number = validated_data['phone_number']
        referral_code_str = validated_data.get('referral_code')

        print(validated_data)
        # If no referral code provided, create both user types without referral processing
        if not referral_code_str:
            # Process registration for both user types
            response_data = self._create_dual_users(validated_data)
            return Response(response_data, status=status.HTTP_201_CREATED)

        # If referral code is provided, determine user type from the referral
        try:
            referral_code_uuid = UUID(referral_code_str)
            potential_referral = Referral.objects.filter(
                referral_code=referral_code_uuid,
                status=ReferralStatus.PENDING,
                referred_user__isnull=True
            ).select_related('referrer').first()

            if not potential_referral:
                return Response(
                    {"referral_code": ["Invalid, expired, or already used referral code."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Determine user type from the referral type
            if potential_referral.referral_type == ReferralType.HOST_TO_HOST:
                primary_user_type = UserTypeOption.HOST
                secondary_user_type = UserTypeOption.GUEST
            elif potential_referral.referral_type == ReferralType.GUEST_TO_GUEST:
                primary_user_type = UserTypeOption.GUEST
                secondary_user_type = UserTypeOption.HOST
            else:
                return Response(
                    {"referral_code": ["Invalid referral type."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if primary user already exists
            primary_username = f"{phone_number}_{primary_user_type}"
            secondary_username = f"{phone_number}_{secondary_user_type}"

            if User.objects.filter(username__in=[primary_username, secondary_username]).exists():
                return Response(
                    {"message": "User already exists with this phone number"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create both users but process referral only for primary user
            response_data = self._create_dual_users_with_referral(
                validated_data,
                primary_user_type,
                secondary_user_type,
                potential_referral
            )
            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValueError:
            return Response(
                {"referral_code": ["Invalid referral code format."]},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _create_dual_users_with_referral(self, validated_data, primary_user_type, secondary_user_type,
                                         referral_instance):
        """Create both user types with referral processing only for the primary type"""
        phone_number = validated_data['phone_number']

        # For validation, we use the primary username
        validation_username = f"{phone_number}_{primary_user_type}"
        if not OtpService.validate_otp(
            input_otp=validated_data["otp"],
            username=validation_username,
            scope=OtpScopeOption.REGISTER,
        ):
            raise ValidationError({"message": "Invalid OTP"})

        # Create both users within a transaction
        primary_user = None
        secondary_user = None

        with transaction.atomic():
            # Create primary user (with referral)
            primary_user = self._create_user_of_type(validated_data, primary_user_type)

            # Process referral for primary user only
            referral_instance.referred_user = primary_user
            if primary_user_type == UserTypeOption.HOST:
                referral_instance.status = ReferralStatus.HOST_ACTIVE
            elif primary_user_type == UserTypeOption.GUEST:
                referral_instance.status = ReferralStatus.SIGNED_UP
            referral_instance.save(update_fields=['referred_user', 'status', 'updated_at'])

            # Create secondary user (no referral)
            secondary_user = self._create_user_of_type(validated_data, secondary_user_type)

            # # Create relationship between the two users
            # if primary_user_type == UserTypeOption.HOST:
            #     UserRelationship.objects.create(
            #         host_user=primary_user,
            #         guest_user=secondary_user,
            #         relationship_type=UserRelationshipType.SELF
            #     )
            # else:
            #     UserRelationship.objects.create(
            #         host_user=secondary_user,
            #         guest_user=primary_user,
            #         relationship_type=UserRelationshipType.SELF
            #     )

        # Post-creation actions - we'll primarily use the primary user account (referral-based)
        # since that's what the referral was for
        for username in [primary_user.username, secondary_user.username]:
            OtpService.delete_otp(username=username, scope=OtpScopeOption.REGISTER)

        # Cache and tokens for primary user
        set_cache(
            key=f"{username}_token_data",
            value=json.dumps(
                UserSerializer(
                    primary_user, fields=["id", "username", "u_type", "phone_number"]
                ).data
            ),
            ttl=5 * 60 * 60,
        )

        access_token, refresh_token = create_tokens(user=primary_user)
        send_sms(
            username=primary_user.phone_number,
            message=f"Welcome! You've joined as a {primary_user_type} through referral, and we also created a {secondary_user_type} account for you."
        )

        return {
            "message": f"Successfully created accounts with {primary_user_type} referral.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "primary_user": {
                "id": primary_user.id,
                "username": primary_user.username,
                "full_name": primary_user.get_full_name(),
                "u_type": primary_user.u_type,
                "email": primary_user.email,
                "is_phone_verified": primary_user.is_phone_verified,
                "is_email_verified": primary_user.is_email_verified,
                "referral_applied": True
            },
            "secondary_user": {
                "id": secondary_user.id,
                "username": secondary_user.username,
                "u_type": secondary_user.u_type,
                "referral_applied": False
            }
        }

    def _create_dual_users(self, validated_data):
        """Create both HOST and GUEST users with the same credentials (no referral)"""
        phone_number = validated_data['phone_number']

        # Check if either user type already exists
        host_username = f"{phone_number}_{UserTypeOption.HOST}"
        guest_username = f"{phone_number}_{UserTypeOption.GUEST}"

        if User.objects.filter(username__in=[host_username, guest_username]).exists():
            raise ValidationError({"message": "User already exists with this phone number"})

        # For dual users, validate OTP against either username (just use one consistently)
        validation_username = guest_username
        if not OtpService.validate_otp(
            input_otp=validated_data["otp"],
            username=validation_username,
            scope=OtpScopeOption.REGISTER,
        ):
            raise ValidationError({"message": "Invalid OTP"})

        # Create both users within a transaction
        host_user = None
        guest_user = None

        with transaction.atomic():
            # Create HOST user
            host_user = self._create_user_of_type(validated_data, UserTypeOption.HOST)

            # Create GUEST user with same details
            guest_user = self._create_user_of_type(validated_data, UserTypeOption.GUEST)

            # Create a relationship between the two users
            # UserRelationship.objects.create(
            #     host_user=host_user,
            #     guest_user=guest_user,
            #     relationship_type=UserRelationshipType.SELF
            # )

        # Post-creation actions - we'll primarily use the GUEST account
        # but provide information about both accounts
        primary_user = guest_user  # Default to GUEST as primary

        for username in [host_username, guest_username]:
            OtpService.delete_otp(username=username, scope=OtpScopeOption.REGISTER)

        # Cache and tokens for primary user
        set_cache(
            key=f"{username}_token_data",
            value=json.dumps(
                UserSerializer(
                    primary_user, fields=["id", "username", "u_type", "phone_number"]
                ).data
            ),
            ttl=5 * 60 * 60,
        )

        access_token, refresh_token = create_tokens(user=primary_user)
        send_sms(
            username=primary_user.phone_number,
            message="Welcome! Both Host and Guest accounts have been created for you."
        )

        return {
            "message": "Both Host and Guest accounts created successfully.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "primary_user": {
                "id": primary_user.id,
                "username": primary_user.username,
                "full_name": primary_user.get_full_name(),
                "u_type": primary_user.u_type,
                "email": primary_user.email,
                "is_phone_verified": primary_user.is_phone_verified,
                "is_email_verified": primary_user.is_email_verified,
            },
            "secondary_user": {
                "id": host_user.id,
                "username": host_user.username,
                "u_type": host_user.u_type,
            }
        }

    def _create_user_of_type(self, validated_data, user_type):
        """Helper method to create a user of specific type"""
        phone_number = validated_data['phone_number']
        username = f"{phone_number}_{user_type}"

        user_creation_data = {
            "username": username,
            "phone_number": phone_number,
            "u_type": user_type,
            "password": make_password(validated_data["password"]),
            "email": validated_data.get("email", ""),
        }

        name_parts = validated_data["full_name"].split(" ", 1)
        user_creation_data["first_name"] = name_parts[0]
        user_creation_data["last_name"] = name_parts[1] if len(name_parts) > 1 else ""
        user_creation_data["wishlist_listings"] = []

        print(" ----=== --- ", user_creation_data)

        user_data_serializer = HostGuestUserSerializer(data=user_creation_data)
        user_data_serializer.is_valid(raise_exception=True)

        user_creation_data = user_data_serializer.validated_data

        print( " ---------------------------------- ")

        print(user_creation_data, " ---+++---- ")

        new_user = user_data_serializer.save()
        new_user.is_phone_verified = True
        if new_user.email:
            new_user.is_email_verified = False
        new_user.save(update_fields=['is_phone_verified', 'is_email_verified'])

        # Now we have a model instance, we can get its data for MongoDB
        user_data = UserSerializer(new_user).data
        create_user(user_data)

        UserProfile.objects.create(user=new_user, languages=[])
        Wishlist.objects.create(user=new_user)

        # Create notifications - pass the actual user instance, not serialized data
        self._create_notifications(new_user)

        return new_user

    def _create_notifications(self, user):
        """Create notifications for a new user

        Args:
            user: Either a User model instance or a dictionary containing user data
        """
        event_type = NotificationEventTypeOption.SIGN_UP

        # Determine if user is a model instance or a dictionary
        if hasattr(user, 'username'):
            # It's a model instance
            username = user.username
            user_id = user.id
            u_type = user.get_u_type_display() if hasattr(user, 'get_u_type_display') else user.u_type
        else:
            # It's a dictionary
            username = user.get('username')
            user_id = user.get('id')
            u_type = user.get('u_type')

        user_notification_payload = create_notification(
            event_type=event_type,
            data={
                "identifier": username,
                "message": "Congratulations! You've successfully joined our community.",
                "link": f"/profile/edit",
            },
            n_type=NotificationTypeOption.USER_NOTIFICATION,
        )
        user_notification_payload["user_id"] = user_id

        admin_notification_payload = create_notification(
            event_type=event_type,
            data={
                "identifier": username,
                "message": f"New {u_type} onboard: {username}.",
                "link": f"{settings.FRONTEND_ADMIN_BASE_URL}/users/{user_id}/view"
            },
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
        )

        notifications_to_create = [
            Notification(**item) for item in [user_notification_payload, admin_notification_payload]
            if item.get("user_id") or item["n_type"] == NotificationTypeOption.ADMIN_NOTIFICATION
        ]

        if notifications_to_create:
            Notification.objects.bulk_create(notifications_to_create)
