from django.urls import path

from bookings.views.user import (
    GuestBookingListCreateAPIView,
    GuestBookingRetrieveAPIView,
    GuestBookingReviewAPIView,
    GuestBookingReviewRetrieveAPIView,
    GuestBookingCancelAPIView,
)

app_name = "user"

urlpatterns = [
    path(
        "bookings/",
        GuestBookingListCreateAPIView.as_view(),
        name="booking_list_create",
    ),
    path(
        "bookings/<str:invoice_no>/",
        GuestBookingRetrieveAPIView.as_view(),
        name="booking_retrieve",
    ),
    path(
        "bookings/<str:invoice_no>/cancel/",
        GuestBookingCancelAPIView.as_view(),
        name="booking_cancel",
    ),
    path(
        "bookings/<str:invoice_no>/reviews/",
        GuestBookingReviewAPIView.as_view(),
        name="booking_review",
    ),
    path(
        "bookings/<str:invoice_no>/reviews/<int:pk>/",
        GuestBookingReviewRetrieveAPIView.as_view(),
        name="retrieve_booking_review",
    ),
]
