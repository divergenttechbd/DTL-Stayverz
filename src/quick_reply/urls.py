from django.urls import path

from quick_reply.views import QuickReplyListCreateAPIView, QuickReplyListUDAPIView

app_name = "quick_reply"
urlpatterns = [
    path("", QuickReplyListCreateAPIView.as_view(), name="quick_reply_list"),
    path('api/quickreplies/<int:pk>/', QuickReplyListUDAPIView.as_view(), name='quickreply-detail'),
]
