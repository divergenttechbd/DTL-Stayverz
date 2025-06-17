from django.db.models import Q
from django_filters import rest_framework as filters
from listings.models import Listing

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D # D is a distance object
from rest_framework.exceptions import ValidationError

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

    host_superhost_tier__in = CharacterInFilter(
        field_name="host__current_superhost_tier",
        lookup_expr="in",
        label="Superhost Tier(s) (e.g., SILVER,GOLD)"
    )


    is_superhost = filters.BooleanFilter(
        method='filter_is_superhost',
        label="Show only listings from Superhosts (any tier)"
    )

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
            "host_superhost_tier__in",
            "is_superhost",
        )

    def filter_is_superhost(self, queryset, name, value):

        if value is True:

            return queryset.filter(host__current_superhost_tier__isnull=False).exclude(
                host__current_superhost_tier__exact='')
        elif value is False:
            return queryset.filter(
                Q(host__current_superhost_tier__isnull=True) | Q(host__current_superhost_tier__exact=''))
        return queryset

    @property
    def qs(self):
        parent = super().qs
        return parent.distinct()


class ListingFilter(filters.FilterSet):
    created_at = filters.DateFromToRangeFilter()

    district__in = CharacterInFilter(field_name="district", lookup_expr="in")

    deleted_status = filters.ChoiceFilter(
        method='filter_deleted_status',
        choices=(
            ('active', 'Active Only'),
            ('deleted', 'Deleted Only'),
            ('all', 'All'),
        ),
        label="Deleted Status"
    )

    location = filters.CharFilter(
        method='filter_by_distance',
        label="Filter by distance. Use with 'lat', 'lng', and 'radius_km' query params."
    )

    class Meta:
        model = Listing
        fields = ("category", "status", "verification_status", "created_at", "host", "deleted_status", "district__in", "location")

    def __init__(self, data=None, *args, **kwargs):
        # If 'deleted_status' is not provided, set it to 'active' by default
        if data is not None and "deleted_status" not in data:
            data = data.copy()
            data["deleted_status"] = "active"
        super().__init__(data, *args, **kwargs)

    def filter_deleted_status(self, queryset, name, value):
        if value == 'active':
            return queryset.filter(is_deleted=False)
        elif value == 'deleted':
            return queryset.filter(is_deleted=True)
        elif value == 'all':
            return queryset
        return queryset.filter(is_deleted=False)

    def filter_by_distance(self, queryset, name, value):
        request = self.request
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius_km = request.query_params.get('radius_km')

        print("Filter 'filter_by_distance' is running.")
        if not all([lat, lng, radius_km]):
            print("Missing one or more location parameters (lat, lng, radius_km).")
            return queryset

        try:
            center_point = Point(float(lng), float(lat), srid=4326)


            radius_meters = float(radius_km) * 1000

            print(f"Filtering within {radius_meters} meters of point ({lng}, {lat}).")

            # Use the numeric meter value directly instead of the D() object
            return queryset.filter(location__dwithin=(center_point, radius_meters))

        except (ValueError, TypeError):
            raise ValidationError(detail={'error': "Invalid numeric values for 'lat', 'lng', or 'radius_km'."})
