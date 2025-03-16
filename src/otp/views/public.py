from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from rest_framework.generics import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from base.helpers.decorators import exception_handler
from base.type_choices import UserTypeOption
from base.helpers.constants import OtpScopeOption
from otp.service import OtpService

User = get_user_model()


class PublicOtpRequestAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    def validate_user_and_scope(
        self, username: str, scope: OtpScopeOption
    ) -> tuple[bool, User | None]:
        user = User.objects.filter(username=username).first()
        raise_exp = (user and scope == OtpScopeOption.REGISTER) or (
            not user and scope != OtpScopeOption.REGISTER
        )
        return raise_exp, user

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        scope = request.data["scope"]
        phone_number = request.data["phone_number"]

        if scope not in [OtpScopeOption.REGISTER, OtpScopeOption.RESET_PASSWORD]:
            return Response(
                {"message": "invalid scope"}, status=status.HTTP_400_BAD_REQUEST
            )

        username = (
            f"{phone_number}_{request.data['u_type']}"
            if request.data["u_type"] != UserTypeOption.SYSTEM
            else request.data["email"]
        )

        raise_exp, user = self.validate_user_and_scope(username=username, scope=scope)

        if raise_exp:
            message = str(
                "User with this phone number already exists"
                if user
                else "User does not exists",
            )

            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        if not OtpService.create_otp(
            username=username, scope=scope, is_sms=True, to_phone_number=phone_number
        ):
            return Response(
                {"message": "Otp not set"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        request.data["valid_till"] = 120
        return Response(
            {"message": "Otp sent to user", "data": request.data},
            status=status.HTTP_200_OK,
        )


class PublicOtpValidateAPIView(views.APIView):
    permission_classes = (AllowAny,)
    swagger_tags = ["Auth"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        scope = request.data["scope"]

        if scope not in [OtpScopeOption.REGISTER, OtpScopeOption.RESET_PASSWORD]:
            return Response(
                {"message": "invalid scope"}, status=status.HTTP_400_BAD_REQUEST
            )

        username = (
            f"{request.data['phone_number']}_{request.data['u_type']}"
            if request.data["u_type"] != UserTypeOption.SYSTEM
            else request.data["email"]
        )

        if not OtpService.validate_otp(
            input_otp=request.data["otp"],
            username=username,
            scope=scope,
        ):
            return Response(
                {"message": "Invalid otp"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "Valid otp"}, status=status.HTTP_200_OK)
