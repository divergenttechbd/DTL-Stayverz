from django.contrib.auth import get_user_model
from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from base.permissions import IsHostUser
from quick_reply.models import QuickReply
from quick_reply.serializers import QuickReplySerializer, QuickReplyCreate

User = get_user_model()

class QuickReplyListCreateAPIView(APIView):
    permission_classes = (IsHostUser,)
    swagger_tags = ['quick reply (host)']

    def get_object(self, pk, request):
        obj = QuickReply.objects.get(pk=pk)

        if request.user != obj.host:
            raise PermissionDenied("You don't have permission to access this quick reply.")
        return obj

    def get_queryset(self, request):
        if not request.user.is_authenticated:
            return QuickReply.objects.none()
        return QuickReply.objects.filter(host=request.user)

    def get(self, request, format=None):

        queryset = self.get_queryset(request)
        serializer = QuickReplySerializer(
            queryset.order_by('title'),
            many=True
        )
        return Response(serializer.data)

    @swagger_auto_schema(request_body=QuickReplyCreate)
    def post(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        request.data['host'] = user.id
        print(request.data['host'])
        print(user.id)
        serializer = QuickReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuickReplyListUDAPIView(APIView):
    permission_classes = (IsHostUser,)
    swagger_tags = ['quick reply (host)']

    def get_object(self, pk, request):
        obj = QuickReply.objects.get(pk=pk)

        if request.user != obj.host:
            raise PermissionDenied("You don't have permission to access this quick reply.")
        return obj


    def get(self, request, pk, format=None):
        queryset = self.get_object(pk, request)
        serializer = QuickReplySerializer(queryset)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        reply = self.get_object(pk, request)
        reply.delete()
        return Response(data= "success", status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=QuickReplyCreate)
    def patch(self, request, pk, format=None):
        quick_reply = self.get_object(pk, request)
        serializer = QuickReplyCreate(quick_reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return_serializer = QuickReplySerializer(quick_reply)
            return Response(return_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
