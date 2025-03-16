from rest_framework.serializers import (
    Serializer,
    ValidationError,
    ChoiceField,
    FloatField,
)
from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from listings.models import Listing, ListingAmenity, Category


class CategorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ListingSerializer(DynamicFieldsModelSerializer):
    latitude = FloatField(source="location.y", read_only=True)
    longitude = FloatField(source="location.x", read_only=True)

    class Meta:
        model = Listing
        fields = "__all__"

    def get_category(self, obj):
        return (
            CategorySerializer(obj.category, fields=["id", "name"]).data
            if obj.category
            else None
        )

    def get_owner(self, obj):
        return UserSerializer(
            instance=obj.host,
            fields=[
                "id",
                "full_name",
                "image",
                "email",
                "identity_verification_status",
                "status",
            ],
        ).data


class ListingAmenitySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ListingAmenity
        fields = "__all__"

    def get_amenity(self, obj):
        amenity = obj.amenity
        return {
            "name": amenity.name,
            "a_type": amenity.a_type,
            "icon": amenity.icon,
            "id": amenity.id,
        }


class ListingStatusUpdateSerializer(Serializer):
    listing_status = ChoiceField(
        choices=["restricted", "published", "unpublished"], required=False
    )
    verification_status = ChoiceField(
        choices=["unverified", "verified"], required=False
    )

    def validate(self, data):
        if not data.get("listing_status") and not data.get("verification_status"):
            raise ValidationError(
                "At least one of 'listing_status' or 'verification_status' must be provided."
            )

        return data
