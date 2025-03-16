from django.urls import path

from listings.views.host import (
    HostListingListCreateAPIView,
    HostListingRetrieveUpdateAPIView,
    HostListingConfigurationApiView,
    HostListingCalendarApiView,
)

app_name = "host"

urlpatterns = [
    path(
        "configurations/",
        HostListingConfigurationApiView.as_view(),
        name="listing_configurations",
    ),
    path(
        "listings/",
        HostListingListCreateAPIView.as_view(),
        name="listing_list_create",
    ),
    path(
        "listings/<uuid:unique_id>/",
        HostListingRetrieveUpdateAPIView.as_view(),
        name="listing_retrieve_update",
    ),
    path(
        "listing-calendars/<int:listing_id>/",
        HostListingCalendarApiView.as_view(),
        name="listing_calendar",
    ),
]
