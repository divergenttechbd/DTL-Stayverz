from django.urls import include, path

app_name = "notifications"

urlpatterns = [
    path("admin/", include("notifications.urls.admin"), name="admin.api"),
    path("user/", include("notifications.urls.user"), name="user.api"),
]
