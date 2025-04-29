from rest_framework.fields import BooleanField
from rest_framework.serializers import (
    Serializer,
    ValidationError,
    ChoiceField,
    FloatField,
)
from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from listings.models import Listing, ListingAmenity, Category
from django.utils.translation import gettext_lazy as _

class CategorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ListingSerializer(DynamicFieldsModelSerializer):
    latitude = FloatField(source="location.y", read_only=True)
    longitude = FloatField(source="location.x", read_only=True)
    instant_booking_allowed = BooleanField(required=False)
    require_guest_good_track_record = BooleanField(required=False)

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

    def validate(self, data):

        instant_booking_final_state = data.get(
            'instant_booking_allowed',
            getattr(self.instance, 'instant_booking_allowed', False) if self.instance else False
        )

        require_good_track_record_incoming = data.get('require_guest_good_track_record')


        if require_good_track_record_incoming is True and instant_booking_final_state is False:

            raise ValidationError({
                'require_guest_good_track_record': _(
                    'Cannot set require good track record to true when instant booking is false or being set to false.')
            })

        if not instant_booking_final_state:
            data['require_guest_good_track_record'] = False


        return data


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

