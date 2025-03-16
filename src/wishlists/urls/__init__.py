from django.urls import include, path

app_name = "wishlists"

urlpatterns = [
    path("user/", include("wishlists.urls.user"), name="user.api"),
]
