from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import views
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status
from base.helpers.decorators import exception_handler
from base.helpers.constants import OtpScopeOption
from base.type_choices import UserTypeOption
from otp.service import OtpService


User = get_user_model()


class UserOtpRequestAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["User Otp"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        scope = request.data["scope"]
        if scope not in [OtpScopeOption.EMAIL_VERIFY, OtpScopeOption.PAYMENT_METHOD]:
            return Response(
                {"message": "invalid scope"}, status=status.HTTP_400_BAD_REQUEST
            )

        otp_body = {
            "username": request.user.username,
            "scope": scope,
            "is_sms": True,
            "to_phone_number": request.user.phone_number,
        }

        if scope == OtpScopeOption.EMAIL_VERIFY:
            email = request.data["email"]
            if User.objects.filter(email=email).exists():
                Response(
                    {"message": "Email already taken"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            otp_body = {
                "username": request.user.username,
                "scope": scope,
                "is_email": True,
                "to_email": email,
            }

        if (
            scope == OtpScopeOption.PAYMENT_METHOD
            and request.user.u_type != UserTypeOption.HOST
        ):
            Response(
                {"message": "Only Host can use this scope"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not OtpService.create_otp(**otp_body):
            return Response(
                {"message": "Otp not set"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        request.data["valid_till"] = 120
        return Response(
            {"message": "Otp sent to user", "data": request.data},
            status=status.HTTP_200_OK,
        )


class UserOtpValidateAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["User Otp"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        scope = request.data["scope"]
        if scope not in [OtpScopeOption.EMAIL_VERIFY]:
            return Response(
                {"message": "invalid scope"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=request.user.username,
            scope=scope,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "Valid otp"}, status=status.HTTP_200_OK)
