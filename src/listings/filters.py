from django_filters import rest_framework as filters
from listings.models import Listing


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class CharacterInFilter(filters.BaseInFilter, filters.CharFilter):
    pass


class HostListingFilter(filters.FilterSet):
    class Meta:
        model = Listing
        fields = ("status",)


class PublicListingFilter(filters.FilterSet):
    listing_amenity__in = NumberInFilter(
        field_name="listingamenity__amenity_id", lookup_expr="in"
    )
    category__in = NumberInFilter(field_name="category_id", lookup_expr="in")
    guests = filters.NumberFilter(field_name="guest_count", lookup_expr="gte")
    bedroom_count = filters.NumberFilter(lookup_expr="gte")
    bed_count = filters.NumberFilter(lookup_expr="gte")
    bathroom_count = filters.NumberFilter(lookup_expr="gte")
    place_type__in = CharacterInFilter(field_name="place_type", lookup_expr="in")
    price = filters.RangeFilter()

    class Meta:
        model = Listing
        fields = (
            "guests",
            "pet_allowed",
            "bedroom_count",
            "bed_count",
            "bathroom_count",
            "listing_amenity__in",
            "category__in",
            "price",
        )

    @property
    def qs(self):
        parent = super().qs
        return parent.distinct()


class ListingFilter(filters.FilterSet):
    created_at = filters.DateFromToRangeFilter()

    class Meta:
        model = Listing
        fields = ("category", "status", "verification_status", "created_at", "host")
