from django.urls import path

from bookings.views.user import (
    GuestBookingListCreateAPIView,
    GuestBookingRetrieveAPIView,
    GuestBookingReviewAPIView,
    GuestBookingReviewRetrieveAPIView,
    GuestBookingCancelAPIView, ValidateCouponAPIView, DownloadInvoiceAPIView, GuestBookingCancelAdminAPIView,
    GuestPendingReviewsAPIView,
)

app_name = "user"

urlpatterns = [
    path(
        "bookings/",
        GuestBookingListCreateAPIView.as_view(),
        name="booking_list_create",
    ),

    path(
        "bookings/pending-reviews/",
        GuestPendingReviewsAPIView.as_view(),
        name="booking_pending_reviews",
    ),
    path('validate-coupon/', ValidateCouponAPIView.as_view(), name='validate_coupon'),
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
        "bookings/admin/<int:guest_id>/<str:invoice_no>/cancel/",
        GuestBookingCancelAdminAPIView.as_view(),
        name="booking_cancel_admin",
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



    path('bookings/<str:invoice_no>/download-invoice/', DownloadInvoiceAPIView.as_view(), name='download_booking_invoice')
]
