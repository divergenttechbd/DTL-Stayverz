from django_filters import rest_framework as filters

from notifications.models import Notification


class NotificationFilter(filters.FilterSet):
    created_at = filters.DateFromToRangeFilter()

    class Meta:
        model = Notification
        fields = ("created_at",)
