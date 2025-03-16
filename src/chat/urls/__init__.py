from django.urls import include, path

app_name = "chat"

urlpatterns = [
    path("user/", include("chat.urls.user"), name="user.api"),
]
