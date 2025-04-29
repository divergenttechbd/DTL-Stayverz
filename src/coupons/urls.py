from django.urls import path
from .views import CouponListApiView, CouponRetrieveUpdateDestroyAPIView

app_name = "coupons"

urlpatterns = [
     path("list/", CouponListApiView.as_view(), name="coupon_list"),
     path("retrive/<int:pk>", CouponRetrieveUpdateDestroyAPIView.as_view(), name="coupon_retrieve"),
]
