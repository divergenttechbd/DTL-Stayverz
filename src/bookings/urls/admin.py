from django.urls import path

from bookings.views.admin import (
    AdminBookingListAPIView,
    AdminBookingRetrieveAPIView,
    AdminBookingStatisticsAPIView,
    AdminListingBookingReviewsAPIView,
    AdminLatestBookingListAPIView,
    AdminBookingReportDownloadAPIView, ExportBookingReviewsAPIView,
)

app_name = "admin"

urlpatterns = [
    path(
        "bookings/",
        AdminBookingListAPIView.as_view(),
        name="booking_list",
    ),
    path(
        "bookings/<int:pk>/",
        AdminBookingRetrieveAPIView.as_view(),
        name="booking_retrieve",
    ),
    path(
        "statistics/",
        AdminBookingStatisticsAPIView.as_view(),
        name="booking_statistics",
    ),
    path(
        "reviews/",
        AdminListingBookingReviewsAPIView.as_view(),
        name="reviews_list",
    ),


    path("export-booking-reviews/", ExportBookingReviewsAPIView.as_view(), name="export_booking_reviews"),
    path(
        "latest-bookings/",
        AdminLatestBookingListAPIView.as_view(),
        name="latest_booking_list",
    ),
    path(
        "download-reports/",
        AdminBookingReportDownloadAPIView.as_view(),
        name="report_download",
    ),
]
