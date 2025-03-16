from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from notifications.models import Notification


class NotificationSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"

    def get_user(self, obj):
        return UserSerializer(
            obj.user, fields=["id", "full_name", "phone_number", "image"]
        ).data
