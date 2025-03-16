import json
import uuid
from django.db.models import F
from django.contrib.gis.geos import Point
from datetime import datetime
from django.utils.decorators import method_decorator
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    views,
)
from rest_framework import status
from rest_framework.response import Response
from base.helpers.constants import (
    PLACE_TYPE_DESCRIPTION_MAPPING,
    PLACE_TYPE_ICON_MAPPING,
)
from base.helpers.decorators import exception_handler
from base.permissions import HostUserHasObjectAccess, IsHostUser
from base.type_choices import PlaceTypeOption, ServiceChargeTypeOption
from configurations.data import CANCELLATION_POLICY_DATA
from configurations.models import ServiceCharge
from listings.filters import HostListingFilter
from django.contrib.auth import get_user_model
from listings.models import Category, Amenity, Listing, ListingCalendar
from listings.serializers import (
    ListingSerializer,
    ListingAmenitySerializer,
)
from listings.views.service import ListingCalendarDataProcess, ListingCreateDataProcess

User = get_user_model()


class HostListingConfigurationApiView(views.APIView):
    permission_classes = (IsAuthenticated, IsHostUser)
    swagger_tags = ["Host Listings"]

    def get(self, request, *args, **kwargs):
        categories = list(Category.objects.filter().values("id", "name", "icon"))
        amenity_data = list(
            Amenity.objects.filter().values("a_type", "id", "name", "icon")
        )

        amenity_list_dict = dict()
        for obj in amenity_data:
            amenity_list_dict.setdefault(obj.pop("a_type"), []).append(obj)

        place_types = []
        for choice in PlaceTypeOption:
            place_types.append(
                {
                    "id": choice.value,
                    "name": choice.value.replace("_", " ").title(),
                    "icon": PLACE_TYPE_ICON_MAPPING.get(choice.value),
                    "short_description": PLACE_TYPE_DESCRIPTION_MAPPING.get(
                        choice.value
                    ),
                }
            )
        data = {
            "categories": categories,
            "amenities": json.loads(json.dumps(amenity_list_dict)),
            "place_types": place_types,
            "cancellation_policy": CANCELLATION_POLICY_DATA,
        }

        return Response(data=data, status=status.HTTP_200_OK)


class HostListingListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsHostUser)
    serializer_class = ListingSerializer
    http_method_names = ["get", "post"]
    filterset_class = HostListingFilter
    search_fields = ("title",)
    swagger_tags = ["Host Listings"]

    def get_queryset(self):
        return Listing.objects.filter(host_id=self.request.user.id).order_by(
            "-created_at"
        )

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        request.data["host"] = request.user.id
        request.data["title"] = "Write your awesome title"
        request.data["unique_id"] = uuid.uuid4()

        serializer = ListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
            User.objects.filter(id=request.user.id).update(
                total_property=F("total_property") + 1
            )

        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


class HostListingRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsHostUser, HostUserHasObjectAccess)
    lookup_field = "unique_id"
    queryset = Listing.objects.filter()
    serializer_class = ListingSerializer
    http_method_names = ["get", "patch"]
    removeable_keys = ("unique_id", "host")
    swagger_tags = ["Host Listings"]

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
        service_charges = list(ServiceCharge.objects.values())
        guest_service_charge = 0
        host_service_charge = 0

        for item in service_charges:
            if item["sc_type"] == "host_charge":
                host_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )
            elif item["sc_type"] == "guest_charge":
                guest_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )

        data["guest_service_charge"] = guest_service_charge
        data["host_service_charge"] = host_service_charge
        return Response(data)

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        current_price = instance.price
        amenities = request.data.pop("amenities", None)

        if request.data.get("latitude") and request.data.get("longitude"):
            request.data["location"] = Point(
                float(request.data.get("longitude")),
                float(request.data.get("latitude")),
            )

        serializer = ListingSerializer(
            instance=instance,
            data=request.data,
            partial=True,
            exclude_fields=self.removeable_keys,
        )
        serializer.is_valid(raise_exception=True)

        listing_data_process = ListingCreateDataProcess(instance)

        with transaction.atomic():
            serializer.save()

            if request.data.get("price") and current_price != float(
                request.data.get("price")
            ):
                listing_data_process.process_listing_price(request.data.get("price"))

            if amenities:
                listing_data_process.process_amenities(amenities)

        return Response(
            self.get_serializer(instance=instance).data, status=status.HTTP_200_OK
        )


class HostListingCalendarApiView(views.APIView):
    permission_classes = (IsAuthenticated, IsHostUser, HostUserHasObjectAccess)

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        listing_id = kwargs.get("listing_id")
        listing = Listing.objects.get(id=listing_id)

        self.check_object_permissions(request, listing)

        formatted_data = request.data["data"]

        # valid_price = all(
        #     entry["price"] == formatted_data[0]["price"] for entry in formatted_data
        # )
        # valid_is_booked = all(not entry["is_booked"] for entry in formatted_data)

        # if not (valid_price and valid_is_booked):
        #     return Response(
        #         data={"message": "Invalid data"},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )

        # #  data formatting
        # grouped_data = []
        # current_group = None
        # for item in formatted_data:
        #     if current_group and current_group[-1]["is_blocked"] == item["is_blocked"]:
        #         current_group[-1]["end_date"] = item["end_date"]
        #     else:
        #         current_group = [item]
        #         grouped_data.append(current_group)

        # result = []
        # for group in grouped_data:
        #     if len(group) > 1:
        #         combined_dict = group[0].copy()
        #         combined_dict["end_date"] = group[-1]["end_date"]
        #         result.append(combined_dict)
        #     else:
        #         result.append(group[0])
        #  data formatting

        for entry in formatted_data:
            start_date = entry["start_date"]
            end_date = entry["end_date"]

            defaults = {
                "base_price": listing.price,
                "custom_price": entry[
                    "price"
                ],  # request.data.get("price", listing.price),
                "is_blocked": entry[
                    "is_blocked"
                ],  # request.data.get("is_blocked", False),
                # "is_booked": entry["is_booked"],
                "note": entry["note"],
            }

            obj, created = ListingCalendar.objects.update_or_create(
                listing_id=listing_id,
                start_date=start_date,
                end_date=end_date,
                defaults=defaults,
            )

            # if not created:
            #     for key, value in defaults.items():
            #         setattr(obj, key, value)
            #     obj.save()

        return Response(
            data={"message": "Successfully submitted"}, status=status.HTTP_200_OK
        )

    @method_decorator(exception_handler)
    def get(self, request, *args, **kwargs):
        listing_id = kwargs.get("listing_id")
        listing = Listing.objects.get(id=listing_id)

        self.check_object_permissions(request, listing)

        if not request.GET.get("from_date") or not request.GET.get("to_date"):
            calendar_data = {}
        else:
            query_data = {
                "from_date": datetime.strptime(
                    request.GET.get("from_date"), "%Y-%m-%d"
                ).date(),
                "to_date": datetime.strptime(
                    request.GET.get("to_date"), "%Y-%m-%d"
                ).date(),
            }
            calendar_data = ListingCalendarDataProcess()(query_data, listing_id)

        service_charges = list(ServiceCharge.objects.values())
        guest_service_charge = 0
        host_service_charge = 0

        for item in service_charges:
            if item["sc_type"] == "host_charge":
                host_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )
            elif item["sc_type"] == "guest_charge":
                guest_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )

        data = {
            "listing": {
                "base_price": listing.price,
                "minimum_nights": listing.minimum_nights,
                "maximum_nights": listing.maximum_nights,
                "guest_service_charge": guest_service_charge,
                "host_service_charge": host_service_charge,
            },
            "calendar_data": calendar_data,
        }
        return Response(data=data, status=status.HTTP_200_OK)
