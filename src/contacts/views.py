from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.template.loader import get_template
from contacts.serializers import ContactMessageSerializer
from base.helpers.email import send_email_using_default_django_backend


@api_view(["POST"])
@permission_classes([AllowAny])
def contact_us(request):
    serializer = ContactMessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    html_content = get_template("email/contact_email.html").render(
        serializer.validated_data
    )
    send_email_using_default_django_backend(
        "hello@stayverz.com", "Contact Us", html_content
    )

    return Response({"message": "Message sent successfully"}, status=status.HTTP_200_OK)
