from otp.views.public import (
    PublicOtpRequestAPIView,
    PublicOtpValidateAPIView,
)
from django.urls import path

app_name = "public"

urlpatterns = [
    path("otp-request/", PublicOtpRequestAPIView.as_view(), name="otp_request"),
    path("otp-validate/", PublicOtpValidateAPIView.as_view(), name="otp_validate"),
]
