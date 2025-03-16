from django.urls import include, path

app_name = "listings"

urlpatterns = [
    path("admin/", include("listings.urls.admin"), name="admin.api"),
    path("host/", include("listings.urls.host"), name="host.api"),
    path("public/", include("listings.urls.public"), name="public.api"),
]
