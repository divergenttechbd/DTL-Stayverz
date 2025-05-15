from accounts.views.public import (
    PublicUserRegisterAPIView,
    PublicUserResetPasswordAPIView,
    PublicUserLoginAPIView,
    RefreshTokenAPIView,
    PublicAdminResetPasswordAPIView,
    PublicUserProfileAPIView,
    PublicUserReviewListApi, PublicUserRegisterAPIViewHost,
)
from django.urls import path

app_name = "public"

urlpatterns = [
    path("login/", PublicUserLoginAPIView.as_view(), name="login"),
    path("register/", PublicUserRegisterAPIView.as_view(), name="register"),
    path(
        "reset-password/",
        PublicUserResetPasswordAPIView.as_view(),
        name="reset_password",
    ),
    path("refresh-token/", RefreshTokenAPIView.as_view(), name="token_refresh_api"),
    path(
        "admin-reset-password/",
        PublicAdminResetPasswordAPIView.as_view(),
        name="admin_reset_password",
    ),
    path(
        "profile/<int:pk>/",
        PublicUserProfileAPIView.as_view(),
        name="user_profile",
    ),
    path(
        "reviews/<int:user_id>/", PublicUserReviewListApi.as_view(), name="review_list"
    ),

    path("register/ref/", PublicUserRegisterAPIViewHost.as_view(), name="register-host"),
]
