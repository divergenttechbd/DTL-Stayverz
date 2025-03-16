from rest_framework import serializers


class ContactMessageSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone_number = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    text = serializers.CharField(max_length=1000)
