from rest_framework import serializers, viewsets

from quick_reply.models import QuickReply


class QuickReplySerializer(serializers.ModelSerializer):
    host_username = serializers.CharField(source="host.username", read_only=True)

    class Meta:
        model = QuickReply
        fields = '__all__'
        read_only_fields = [
            'id',
            'host_username',
            'created_at',
            'updated_at',
        ]

class QuickReplyCreate(serializers.ModelSerializer):
    class Meta:
        model = QuickReply
        exclude = ('host',)

        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]
