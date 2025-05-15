from base.views import DocumentUploadS3ApiView, RootAPIView, health_check
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.urls.conf import re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from myproject.settings import STATIC_ROOT, STATIC_URL, MEDIA_ROOT, MEDIA_URL
from rest_framework import permissions

from quick_reply.views import QuickReplyListCreateAPIView

schema_view = get_schema_view(
    openapi.Info(
        title=settings.PROJECT_TITLE,
        default_version=settings.PROJECT_VERSION,
        description="Api description",
        contact=openapi.Contact(email="msm.tibrow@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

v1_patterns = [
    path("accounts/", include("accounts.urls", namespace="accounts.apis")),
    path("listings/", include("listings.urls", namespace="listings.apis")),
    path("maps/", include("maps.urls", namespace="maps.apis")),
    path("contacts/", include("contacts.urls", namespace="contacts.apis")),
    path("otp/", include("otp.urls", namespace="otp.apis")),
    path("chat/", include("chat.urls", namespace="chat.apis")),
    path("bookings/", include("bookings.urls", namespace="bookings.apis")),
    path("payments/", include("payments.urls", namespace="payments.apis")),
    path(
        "configurations/",
        include("configurations.urls", namespace="configurations.apis"),
    ),
    path("wishlists/", include("wishlists.urls", namespace="wishlists.apis")),
    path("blogs/", include("blogs.urls", namespace="blogs.apis")),
    path(
        "notifications/", include("notifications.urls", namespace="notifications.apis")
    ),
    path("document-upload/", DocumentUploadS3ApiView.as_view()),

    path("coupons/", include("coupons.urls")),
    path("quick_reply/", include("quick_reply.urls", namespace="quick_reply.apis")),

    path("referrals/", include("referrals.urls", namespace="referrals.apis")),
]

urlpatterns = [
    path("", health_check),
    path("api/", include([path("v1/", include(v1_patterns))])),
    path("admin/", admin.site.urls),
]

urlpatterns += [
    path("api-auth/", include("rest_framework.urls")),
    path("root-api/", RootAPIView.as_view(), name="api-root"),
]

urlpatterns += static(STATIC_URL, document_root=STATIC_ROOT)
urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
    urlpatterns += [
        re_path(
            r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        re_path(
            r"^swagger/$",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        re_path(
            r"^redoc/$",
            schema_view.with_ui("redoc", cache_timeout=0),
            name="schema-redoc",
        ),
    ]
