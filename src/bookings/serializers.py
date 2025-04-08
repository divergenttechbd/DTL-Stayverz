from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from bookings.models import Booking, ListingBookingReview
from listings.serializers import ListingSerializer


class BookingSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

    def get_listing(self, obj):
        return ListingSerializer(
            obj.listing,
            fields=[
                "id",
                "title",
                "avg_rating",
                "total_rating_count",
                "cover_photo",
                "cancellation_policy",
                "address",
            ],
        ).data

    def get_guest(self, obj):
        return UserSerializer(
            obj.guest,
            fields=["id", "full_name", "phone_number"],
        ).data

    def get_host(self, obj):
        return UserSerializer(obj.host, fields=["id", "full_name", "phone_number"]).data


class BookingReviewSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ListingBookingReview
        fields = "__all__"

    def get_review_by(self, obj):
        return UserSerializer(
            obj.review_by,
            fields=["id", "full_name", "image", "phone_number", "u_type"],
        ).data

    def get_review_for(self, obj):
        return UserSerializer(
            obj.review_for,
            fields=["id", "full_name", "image", "phone_number", "u_type"],
        ).data

    def get_listing(self, obj):
        return ListingSerializer(
            obj.listing,
            fields=["id", "title", "cover_photo", "unique_id"],
        ).data

    def get_booking(self, obj):
        return BookingSerializer(
            obj.booking,
            fields=[
                "id",
                "invoice_no",
                "check_in",
                "check_out",
                "guest_count",
                "night_count",
                "total_price",
                "guest_payment_status",
                "host_payment_status",
                "status",
                "listing",
                "guest",
                "host",
            ],
        ).data
