import logging
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import Response, exception_handler
from django.conf import settings

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    # if there is an IntegrityError and the error response hasn't already been generated
    if isinstance(exc, Exception) and not response:
        if settings.DEBUG:
            response = Response(
                {"message": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        else:
            logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
            response = Response(
                {"message": "Internal Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    return response


class UnprocessableEntity(APIException):
    status_code = 406
    default_code = 406
    default_detail = "unprocessable entity"
