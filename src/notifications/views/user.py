from django.db.models.query import QuerySet
from django.utils.decorators import method_decorator
from base.cache.redis_cache import set_cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import generics
from base.helpers.decorators import exception_handler
from base.helpers.mongo_query import mongo_update_user
from notifications.filters import NotificationFilter
from notifications.models import FCMToken, Notification
from notifications.serializers import NotificationSerializer


class UserNotificationListAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = NotificationSerializer
    filterset_class = NotificationFilter
    swagger_tags = ["User Notifications"]

    def get_queryset(self) -> QuerySet:
        return Notification.objects.filter(user_id=self.request.user.id).order_by("-id")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        unread_count = Notification.objects.filter(
            user_id=request.user.id, is_read=False
        ).count()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            paginated_response = self.get_paginated_response(data)
            paginated_response.data["stats"] = unread_count
            return paginated_response

        serializer = self.get_serializer(queryset, many=True)
        return Response({"results": serializer.data, "stats": unread_count})

    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, args, kwargs)
    #     # if request.GET.get("page_size") != "0":
    #     response.data["stats"] = Notification.objects.filter(
    #         user_id=request.user.id, is_read=False
    #     ).count()
    #     return response


class UserNotificationRetrieveUpdateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["User Notifications"]

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        notification_id = kwargs.get("pk")

        if request.GET.get("all_read"):
            Notification.objects.filter(user_id=request.user.id, is_read=False).update(
                is_read=True
            )
        else:
            notification_obj = Notification.objects.get(
                user_id=request.user.id, id=notification_id, is_read=False
            )

            notification_obj.is_read = True
            notification_obj.save()

        return Response(
            {"message": "Notification updated successfully"}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@exception_handler
def save_fcm_token(request):
    user = request.user
    token = request.data["token"]
    token, created = FCMToken.objects.update_or_create(
        user=user, defaults={"token": token}
    )

    set_cache(
        key=f"user_mobile_logged_in_{request.user.username}",
        value=True,
        ttl=5 * 60 * 60,
    )

    mongo_update_user(
        data={
            "fcm_token": token.token,
            "username": request.user.username,
        }
    )

    return Response(
        {"status": "success", "token": token.token}, status=status.HTTP_200_OK
    )
