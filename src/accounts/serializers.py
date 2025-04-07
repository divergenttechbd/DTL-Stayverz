import re
from django.contrib.auth import get_user_model
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    ValidationError,
    SerializerMethodField,
    ChoiceField,
    CharField,
)
from accounts.models import UserProfile
from base.serializers import DynamicFieldsModelSerializer
from base.type_choices import (
    IdentityVerificationStatusOption,
    UserTypeOption,
)

User = get_user_model()


class HostGuestUserSerializer(ModelSerializer):
    full_name = SerializerMethodField()

    class Meta:
        model = User
        fields = (
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
            "country_code",
            "password",
            "image",
            "date_joined",
            "full_name",
            "identity_verification_status",
            "identity_verification_images",
            "identity_verification_method",
            "identity_verification_reject_reason",
            "avg_rating",
            "total_rating_count",
            "wishlist_listings",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "country_code": {"read_only": True},
            "avg_rating": {"read_only": True},
            "total_rating_count": {"read_only": True},
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserSerializer(DynamicFieldsModelSerializer):
    full_name = SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

        extra_kwargs = {
            "password": {"write_only": True},
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserProfileSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class UserIdentityVerificationSerializer(Serializer):
    document_type = CharField(required=True)
    front_image = CharField(required=True)
    back_image = CharField(required=False)

    def validate_document_type(self, value):
        if value not in ["passport", "nid", "driving_license"]:
            raise ValidationError("document_type is not valid")
        return value


class StatusUpdateSerializer(Serializer):
    first_name = CharField(required=False)
    last_name = CharField(required=False)
    phone_number = CharField(required=False)
    email = CharField(required=False)
    user_status = ChoiceField(choices=["active", "restricted"], required=False)
    identity_status = ChoiceField(choices=["rejected", "verified"], required=False)
    reject_reason = CharField(required=False, allow_blank=True)

    def validate(self, data):
        if not data.get("user_status") and not data.get("identity_status"):
            raise ValidationError(
                "At least one of 'user_status' or 'identity_status' must be provided."
            )

        if data.get(
            "identity_status"
        ) == IdentityVerificationStatusOption.REJECTED and not data.get(
            "reject_reason"
        ):
            raise ValidationError(
                "You must give a reject_reason while reject an account"
            )

        return data


class ChangePasswordSerializer(Serializer):
    old_password = CharField(required=True)
    new_password = CharField(required=True)


class AuthSerializer(Serializer):
    phone_number = CharField(required=True)
    u_type = CharField(required=True)

    def validate_u_type(self, value):
        if value not in [UserTypeOption.HOST, UserTypeOption.GUEST]:
            raise ValidationError("u_type is invalid")
        return value

    def validate_username(self, value):
        pattern = r"^\d{11}$"
        if not re.match(pattern, value):
            raise ValidationError("invalid phone number")
        return value


class RegisterSerializer(AuthSerializer):
    full_name = CharField(required=True)
    password = CharField(required=True)
    otp = CharField(required=True)


class ResetPasswordSerializer(AuthSerializer):
    password = CharField(required=True)
    otp = CharField(required=True)


class LoginSerializer(AuthSerializer):
    password = CharField(required=True)


class UserDTLSerializer(Serializer):
    name = CharField(max_length=200)
    email = CharField()
    password = CharField(max_length=200)
