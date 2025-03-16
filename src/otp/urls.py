from otp.views.user import UserOtpRequestAPIView, UserOtpValidateAPIView
from django.urls import path

app_name = "otp"

urlpatterns = [
    path("otp-request/", UserOtpRequestAPIView.as_view(), name="otp_request"),
    path("otp-validate/", UserOtpValidateAPIView.as_view(), name="otp_validate"),
]
