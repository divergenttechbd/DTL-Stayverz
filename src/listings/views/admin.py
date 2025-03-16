from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, views
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from base.permissions import IsStaff, IsSuperUser
from listings.filters import ListingFilter
from listings.models import Category, Listing
from listings.serializers import (
    ListingAmenitySerializer,
    ListingSerializer,
    ListingStatusUpdateSerializer,
)


class AdminListingCategoryListApiView(views.APIView):
    permission_classes = (IsStaff,)
    swagger_tags = ["Admin Listings"]

    def get(self, request, *args, **kwargs):
        categories = list(Category.objects.filter().values("id", "name", "icon"))
        return Response(data=categories, status=status.HTTP_200_OK)


class AdminListingListAPIView(ListAPIView):
    permission_classes = (IsStaff,)
    # queryset = (
    #     Listing.objects.filter().select_related("category").order_by("-created_at")
    # )
    serializer_class = ListingSerializer
    http_method_names = ["get", "post"]
    filterset_class = ListingFilter
    swagger_tags = ["Admin Listings"]
    ordering_fields = ["created_at", "-created_at", "avg_rating", "-avg_rating"]

    def get_queryset(self):
        qs = Listing.objects.filter().select_related("category", "host")
        sort_by = self.request.query_params.get("sort_by")
        if sort_by == "oldest":
            qs = qs.order_by("created_at")
        elif sort_by == "newest":
            qs = qs.order_by("-created_at")
        elif sort_by == "popular":
            qs = qs.order_by("-avg_rating")
        else:
            qs = qs.order_by("-created_at")
        return qs

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["r_method_fields"] = ["category", "owner"]
        return self.serializer_class(*args, **kwargs)


class AdminListingLitListAPIView(ListAPIView):
    permission_classes = (IsStaff,)
    serializer_class = ListingSerializer
    queryset = Listing.objects.filter().only("id", "cover_photo", "title")
    search_fields = ("title",)
    swagger_tags = ["Admin Listings"]

    def get_serializer(self, *args, **kwargs):
        kwargs["context"] = self.get_serializer_context()
        kwargs["fields"] = ["id", "cover_photo", "title"]
        return self.serializer_class(*args, **kwargs)

    # def get(self, request, *args, **kwargs):
    #     listings = list(
    #         Listing.objects.filter(title=request.GET.get("search", "")).values(
    #             "id", "cover_photo", "title"
    #         )
    #     )
    #     return Response(data=listings, status=status.HTTP_200_OK)


class AdminListingRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    queryset = (
        Listing.objects.filter()
        .prefetch_related("listingamenity_set__amenity")
        .select_related("category", "host")
    )
    serializer_class = ListingSerializer
    swagger_tags = ["Admin Listings"]

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
        kwargs["r_method_fields"] = ["category", "owner"]
        kwargs["related_fields"] = related_fields
        return self.serializer_class(*args, **kwargs)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ListingStatusUpdateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            listing_status = serializer.validated_data.get(
                "listing_status", instance.status
            )
            verification_status = serializer.validated_data.get(
                "verification_status", instance.verification_status
            )

            instance.status = listing_status
            instance.verification_status = verification_status
            instance.save()
            return Response(
                {"message": "Status updated successfully."}, status=status.HTTP_200_OK
            )
