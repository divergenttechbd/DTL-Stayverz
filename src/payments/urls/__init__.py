from django.urls import path, include

app_name = "payments"

urlpatterns = [
    path("admin/", include("payments.urls.admin"), name="admin.api"),
    path("user/", include("payments.urls.user"), name="user.api"),
    path("host/", include("payments.urls.host"), name="host.api"),
]
