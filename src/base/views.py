import mimetypes
import uuid
import re

import boto3
from django.conf import settings
from django.urls import NoReverseMatch, get_resolver, reverse
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from base.helpers.constants import IMAGE_CHAR_REPLACE

from base.helpers.decorators import exception_handler

# Create your views here.


class DocumentUploadS3ApiView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["S3 File Upload"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        folder = request.POST["folder"]
        uploaded_files = request.FILES.getlist("document")
        urls = []

        for document in uploaded_files:
            filename = re.sub(
                r"[ _]", lambda x: IMAGE_CHAR_REPLACE[x.group(0)], document.name
            )
            filename = f"{uuid.uuid4().hex}-{filename}"
            file_type = mimetypes.guess_type(filename)[0]
            if not file_type and filename.split(".")[1] == "webp":
                file_type = "image/webp"
            key = f"{folder}/{filename}"
            content = document.read()

            client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name="ap-southeast-1",
            )

            client.put_object(
                Body=content, Bucket=settings.S3_BUCKET, Key=key, ContentType=file_type
            )
            if settings.ENVIRONMENT != "prod":
                host = "https://dapcxdqknn4nj.cloudfront.net/"
            else:
                host = "https://d26o11dgjud8ta.cloudfront.net/"
            urls.append(f"{host}{key}")

        return Response(data={"urls": urls}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request: Request) -> Response:
    data = {"message": "Api service", "method": request.method}
    return Response(data=data, status=status.HTTP_200_OK)


def get_urls(request, url_patterns, namespace=""):
    urls = []
    for pattern in url_patterns:
        try:
            url_name = f"{namespace}:{pattern.name}"
            urls.append(request.build_absolute_uri(reverse(url_name)))
        except NoReverseMatch as e:
            import re

            url_name = f"{namespace}:{pattern.name}"
            error_message = str(e)
            keyword_arg_matches = re.finditer(
                r"<(?P<key>\w+)>\[(?P<type>[^\]]+)\]\+", error_message
            )
            kwargs = {}
            for match in keyword_arg_matches:
                keyword_arg_key = match.group("key")
                value_type_pattern = match.group("type")
                if value_type_pattern == "0-9":
                    value_type = 1
                elif value_type_pattern == "^/":
                    value_type = "example"
                else:
                    value_type = str

                kwargs[keyword_arg_key] = value_type

            if kwargs:
                url = reverse(url_name, kwargs=kwargs)
                absolute_url = request.build_absolute_uri(url)
                urls.append(absolute_url)
            else:
                pass
    return urls


class RootAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        app_names = [
            "accounts",
            "listings",
            "wishlists",
            "bookings",
            "payments",
            "configurations",
            "blogs",
            "notifications",
        ]
        endpoints = {}
        for app in app_names:
            resolver = get_resolver(app)
            endpoints[app] = {}
            try:
                for url in ["admin", "user", "public"]:
                    resolver = get_resolver(f"{app}.urls.{url}")
                    url_patterns = resolver.url_patterns
                    print(url_patterns)
                    endpoints[app][url] = get_urls(
                        request, url_patterns, f"{app}.apis:{url}"
                    )
            except ModuleNotFoundError:
                pass

        return Response(endpoints)
