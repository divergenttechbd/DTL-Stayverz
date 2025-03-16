from django.urls import include, path

app_name = "otp"

urlpatterns = [
    path("user/", include("otp.urls.user"), name="user.api"),
    path("public/", include("otp.urls.public"), name="public.api"),
]
