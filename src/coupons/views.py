from django.http import Http404
from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from base.permissions import IsSuperUser
from coupons.models import Coupon
from coupons.serializers import CouponSerializer


# Create your views here.



class CouponListApiView(APIView):
    permission_classes = (IsSuperUser,)
    serializer_class = CouponSerializer
    swagger_tags =['coupons']

    def get(self, request):
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=CouponSerializer)
    def post(self, request, format=None):
        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CouponRetrieveUpdateDestroyAPIView(APIView):
    permission_classes = (IsSuperUser,)
    serializer_class = CouponSerializer
    swagger_tags = ['coupons']

    def get_object(self, pk):
        try:
            return Coupon.objects.get(pk=pk)
        except Coupon.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        coupon = self.get_object(pk)
        serializer = CouponSerializer(coupon)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="will update whole coupon",
        request_body=CouponSerializer
    )
    def put(self, request, pk, format=None):
        coupon = self.get_object(pk)
        serializer = CouponSerializer(coupon, data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            response_serializer = CouponSerializer(instance)
            return Response({
                "success": True,
                "status_code": status.HTTP_200_OK,
                "message": "Updated",
                "data": response_serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "status_code": status.HTTP_400_BAD_REQUEST,
            "message": "Validation Error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="here partial update will be done",
        request_body=CouponSerializer
    )
    def patch(self, request, pk, format=None):
        coupon = self.get_object(pk)
        serializer = CouponSerializer(coupon, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            response_serializer = CouponSerializer(instance)  # Re-serialize after partial update
            return Response({
                "success": True,
                "status_code": status.HTTP_200_OK,
                "message": "Updated Partially",
                "data": response_serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "status_code": status.HTTP_400_BAD_REQUEST,
            "message": "Validation Error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        coupon = self.get_object(pk)
        coupon.delete()
        return Response({
            "success": True,
            "status_code": status.HTTP_204_NO_CONTENT,
            "message": "Deleted",
            "data": None
        }, status=status.HTTP_204_NO_CONTENT)
