from django.urls import path

from bookings.views.host import (
    HostReservationListAPIView,
    HostReservationRetrieveAPIView,
    HostBookingReviewAPIView,
    HostBookingReviewRetrieveAPIView,
    HostReservationStatsApiView,
)

app_name = "host"

urlpatterns = [
    path(
        "reservations/",
        HostReservationListAPIView.as_view(),
        name="reservation_list",
    ),
    path(
        "reservations/<str:invoice_no>/",
        HostReservationRetrieveAPIView.as_view(),
        name="reservation_retrieve",
    ),
    path(
        "reservations/<str:invoice_no>/reviews/",
        HostBookingReviewAPIView.as_view(),
        name="booking_review",
    ),
    path(
        "reservations/<str:invoice_no>/reviews/<int:pk>/",
        HostBookingReviewRetrieveAPIView.as_view(),
        name="retrieve_booking_review",
    ),
    path(
        "reservation-stats/",
        HostReservationStatsApiView.as_view(),
        name="reservation_stats",
    ),
]
