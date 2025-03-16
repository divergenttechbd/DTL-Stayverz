from django.urls import include, path

app_name = "bookings"

urlpatterns = [
    path("admin/", include("bookings.urls.admin"), name="admin.api"),
    path("user/", include("bookings.urls.user"), name="user.api"),
    path("host/", include("bookings.urls.host"), name="host.api"),
]
