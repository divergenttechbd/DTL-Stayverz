from chat.views.user import UserChatApiView
from django.urls import path

app_name = "user"

urlpatterns = [
    path("start/", UserChatApiView.as_view(), name="user_chat_initialize"),
]
