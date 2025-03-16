from django.urls import path

from listings.views.admin import (
    AdminListingListAPIView,
    AdminListingCategoryListApiView,
    AdminListingRetrieveUpdateAPIView,
    AdminListingLitListAPIView,
)

app_name = "admin"

urlpatterns = [
    path(
        "categories/",
        AdminListingCategoryListApiView.as_view(),
        name="category_list",
    ),
    path(
        "listings/",
        AdminListingListAPIView.as_view(),
        name="listing_list",
    ),
    path(
        "listings/<int:pk>/",
        AdminListingRetrieveUpdateAPIView.as_view(),
        name="listing_get_update",
    ),
    path(
        "lite-listings/",
        AdminListingLitListAPIView.as_view(),
        name="listing_lite_get",
    ),
]
