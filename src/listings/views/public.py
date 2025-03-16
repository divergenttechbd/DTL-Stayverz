from datetime import datetime, timedelta, date
import json
from django.utils.decorators import method_decorator
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView, RetrieveAPIView, views
from rest_framework import status
from rest_framework.response import Response
from base.helpers.decorators import exception_handler
from base.helpers.utils import calculate_days_between_dates
from base.type_choices import ListingStatusOption, ServiceChargeTypeOption
from bookings.models import ListingBookingReview
from bookings.serializers import BookingReviewSerializer
from configurations.models import ServiceCharge
from listings.filters import PublicListingFilter
from listings.models import Amenity, Category, Listing

from listings.serializers import ListingSerializer, ListingAmenitySerializer
from listings.utils import get_user_with_profile
from listings.views.service import ListingCalendarDataProcess, ListingCheckoutCalculate


class PublicListingListAPIView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ListingSerializer
    filterset_class = PublicListingFilter
    swagger_tags = ["Public Listings"]

    def get_queryset(self):
        if self.request.GET.get("latitude") and self.request.GET.get("longitude"):
            latitude = self.request.GET.get("latitude")
            longitude = self.request.GET.get("longitude")
            search_point = Point(float(longitude), float(latitude), srid=4326)
            return (
                Listing.objects.annotate(distance=Distance("location", search_point))
                .filter(
                    status=ListingStatusOption.PUBLISHED,
                    distance__lte=D(km=float(self.request.GET.get("radius", 25))),
                )
                .order_by("distance")
            )

        return Listing.objects.filter(status=ListingStatusOption.PUBLISHED).order_by(
            "-created_at"
        )


class PublicListingConfigurationListApiView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Public Listings"]

    def get(self, request, *args, **kwargs):
        categories = list(Category.objects.filter().values("id", "name", "icon"))
        amenity_data = list(
            Amenity.objects.filter().values("a_type", "id", "name", "icon")
        )

        amenity_list_dict = dict()
        for obj in amenity_data:
            amenity_list_dict.setdefault(obj.pop("a_type"), []).append(obj)

        data = {
            "categories": categories,
            "amenities": json.loads(json.dumps(amenity_list_dict)),
        }

        return Response(data=data, status=status.HTTP_200_OK)


class PublicListingRetrieveAPIView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    lookup_field = "unique_id"
    queryset = (
        Listing.objects.filter()
        .prefetch_related("listingamenity_set__amenity")
        .select_related("host__userprofile")
    )
    serializer_class = ListingSerializer
    swagger_tags = ["Public Listings"]

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        related_fields = [
            {
                "serializer": ListingAmenitySerializer(
                    source="listingamenity_set",
                    read_only=True,
                    many=True,
                    fields=["id"],
                    r_method_fields=["amenity"],
                ),
                "name": "amenities",
            }
        ]
        kwargs["related_fields"] = related_fields
        return self.serializer_class(*args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        data["host"] = get_user_with_profile(instance.host)

        calendar_start_date = date.today()
        calendar_end_date = calendar_start_date + timedelta(weeks=53)

        calendar_data = ListingCalendarDataProcess()(
            {
                "from_date": calendar_start_date,
                "to_date": calendar_end_date,
            },
            instance.id,
        )
        data["calendar_data"] = calendar_data

        service_charge = ServiceCharge.objects.filter(
            sc_type=ServiceChargeTypeOption.GUEST_CHARGE
        ).first()
        data["service_charge_percentage"] = (
            service_charge.value / 100
            if service_charge.calculation_type == "percentage"
            else service_charge.value
        )

        reviews = ListingBookingReview.objects.filter(
            listing_id=instance.id,
            is_host_review=False,
        ).select_related("review_by")
        data["reviews"] = BookingReviewSerializer(
            reviews,
            many=True,
            fields=["rating", "review", "id"],
            r_method_fields=["review_by"],
        ).data

        # data["checkout_data"] = {
        #     "nights": 0,
        #     "service_charge": 0.03,
        #     "booking_price": 0,
        #     "total_price": 0,
        # }

        # if request.GET.get("from_date") and request.GET.get("to_date"):
        #     from_date = datetime.strptime(
        #         request.GET.get("from_date"), "%Y-%m-%d"
        #     ).date()
        #     to_date = datetime.strptime(request.GET.get("to_date"), "%Y-%m-%d").date()
        #     if from_date >= calendar_start_date and to_date >= calendar_start_date:
        #         booking_date_info = {}
        #         for c_date, data_entry in calendar_data.items():
        #             c_date = datetime.strptime(c_date, "%Y-%m-%d").date()
        #             if from_date <= c_date <= to_date:
        #                 booking_date_info[str(c_date)] = data_entry

        #         checkout_data = ListingCheckoutCalculate()(
        #             booking_date_info=booking_date_info,
        #             date_range={"from_date": from_date, "to_date": to_date},
        #             instance=instance,
        #         )
        #         data["checkout_data"] = checkout_data

        return Response(data)


class PublicListingCheckoutCalculateAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Public Listings"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        instance = Listing.objects.get(unique_id=kwargs.get("unique_id"))
        from_date = request.data.get("from_date")
        to_date = request.data.get("to_date")
        current_date = date.today()

        if not from_date or not to_date:
            return Response(
                data={"message": "from_date and to_date is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
        to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
        if (
            from_date >= current_date
            and to_date >= current_date
            and to_date > from_date
        ):
            date_filter = {
                "from_date": from_date,
                "to_date": to_date,
            }
            calendar_data = ListingCalendarDataProcess()(
                date_filter,
                instance.id,
            )
            checkout_data = ListingCheckoutCalculate()(
                booking_date_info=calendar_data,
                date_range=date_filter,
                instance=instance,
            )
            status = checkout_data.pop("status")
            return Response(
                data=checkout_data,
                status=status,
            )


class PublicListingLiteRetrieveAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Public Listings"]

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        instance = Listing.objects.get(unique_id=kwargs.get("unique_id"))
        data = ListingSerializer(
            instance,
            many=False,
            fields=[
                "id",
                "unique_id",
                "title",
                "cover_photo",
                "address",
                "cancellation_policy",
                "avg_rating",
                "total_rating_count",
            ],
        ).data

        return Response(
            data=data,
            status=status.HTTP_200_OK,
        )
