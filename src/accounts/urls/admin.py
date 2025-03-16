from accounts.views.admin import (
    AdminStaffListCreateApiView,
    AdminUserListApiView,
    AdminUserRetrieveUpdateAPIView,
    AdminStaffRetrieveUpdateAPIView,
    AdminDashboardStatAPIView,
    AdminBestSellingHostListAPIView,
    AdminUserReportDownloadAPIView,
)
from django.urls import path

app_name = "admin"

urlpatterns = [
    path(
        "staffs/",
        AdminStaffListCreateApiView.as_view(),
        name="staff_list_create",
    ),
    path(
        "staffs/<int:pk>/",
        AdminStaffRetrieveUpdateAPIView.as_view(),
        name="staff_get_update",
    ),
    path(
        "users/",
        AdminUserListApiView.as_view(),
        name="user_list",
    ),
    path(
        "users/<int:pk>/",
        AdminUserRetrieveUpdateAPIView.as_view(),
        name="user_get_update",
    ),
    path("dashboard-stat/", AdminDashboardStatAPIView.as_view(), name="dashboard_stat"),
    path("top-hosts/", AdminBestSellingHostListAPIView.as_view(), name="top_host_list"),
    path(
        "report-download/users/",
        AdminUserReportDownloadAPIView.as_view(),
        name="report_download",
    ),
]
