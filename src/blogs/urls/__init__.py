from django.urls import include, path

app_name = "blogs"

urlpatterns = [
    path("admin/", include("blogs.urls.admin"), name="admin.api"),
    path("public/", include("blogs.urls.public"), name="public.api"),
]
