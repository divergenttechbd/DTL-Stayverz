from django.urls import include, path

app_name = "configurations"

urlpatterns = [
    path("admin/", include("configurations.urls.admin"), name="admin.api"),
]
