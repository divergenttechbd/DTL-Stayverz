from django.urls import path

from listings.views.public import (
    PublicListingListAPIView,
    PublicListingConfigurationListApiView,
    PublicListingRetrieveAPIView,
    PublicListingCheckoutCalculateAPIView,
    PublicListingLiteRetrieveAPIView, SimpleRandomPriorityAPIView, TimeBasedRotationAPIView,
)

app_name = "public"

urlpatterns = [
    path(
        "configurations/",
        PublicListingConfigurationListApiView.as_view(),
        name="configuration_list",
    ),

    path('listings/random/', SimpleRandomPriorityAPIView.as_view(), name='listings_random'),
    path('listings/timebased/', TimeBasedRotationAPIView.as_view(), name='listings_timebased'),
    path(
        "listings/",
        PublicListingListAPIView.as_view(),
        name="listing_list",
    ),
    path(
        "listings/<str:unique_id>/",
        PublicListingRetrieveAPIView.as_view(),
        name="listing_retrieve",
    ),
    path(
        "listings/lite/<str:unique_id>/",
        PublicListingLiteRetrieveAPIView.as_view(),
        name="listing_lite_retrieve",
    ),
    path(
        "listings/<str:unique_id>/checkout-calculate/",
        PublicListingCheckoutCalculateAPIView.as_view(),
        name="listing_checkout_calculate",
    ),

    # path('listings/random/', SimpleRandomPriorityAPIView.as_view(), name='listings_random'),
    # path('listings/timebased/', TimeBasedRotationAPIView.as_view(), name='listings_timebased')
]
