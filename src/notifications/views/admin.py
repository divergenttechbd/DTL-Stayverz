from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from base.helpers.decorators import exception_handler
from base.type_choices import NotificationTypeOption
from notifications.filters import NotificationFilter
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from base.permissions import IsStaff


class AdminNotificationListAPIView(generics.ListAPIView):
    permission_classes = (IsStaff,)
    serializer_class = NotificationSerializer
    queryset = Notification.objects.filter(
        n_type=NotificationTypeOption.ADMIN_NOTIFICATION
    ).order_by("-id")
    filterset_class = NotificationFilter
    swagger_tags = ["Admin Notifications"]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        unread_count = Notification.objects.filter(
            n_type=NotificationTypeOption.ADMIN_NOTIFICATION, is_read=False
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
    #     if request.GET.get("page_size") != "0":
    #         response.data["stats"] = Notification.objects.filter(
    #             n_type=NotificationTypeOption.ADMIN_NOTIFICATION, is_read=False
    #         ).count()
    #     return response


class AdminNotificationRetrieveUpdateAPIView(APIView):
    permission_classes = (IsStaff,)
    swagger_tags = ["Admin Notifications"]

    @method_decorator(exception_handler)
    def patch(self, request, *args, **kwargs):
        notification_id = kwargs.get("pk")

        if request.GET.get("all_read"):
            Notification.objects.filter(
                n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
                is_read=False,
            ).update(is_read=True)
        else:
            notification_obj = Notification.objects.get(
                n_type=NotificationTypeOption.ADMIN_NOTIFICATION,
                id=notification_id,
                is_read=False,
            )

            notification_obj.is_read = True
            notification_obj.save()

        return Response(
            {"message": "Notification updated successfully"}, status=status.HTTP_200_OK
        )
