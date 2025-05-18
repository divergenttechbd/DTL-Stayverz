from accounts.views.user import (
    UserProfileRetrieveUpdateAPIView,
    UserIdentityVerificationAPIView,
    UserEmailVerificationAPIView,
    UserPasswordChange,
    UserReviewListApi,
    UserUnreadMessageCountAPIView,
    logout,
    mobile_login, UserSelfieVerificationAPIView,
)
from django.urls import path

app_name = "user"

urlpatterns = [
    path(
        "profile/",
        UserProfileRetrieveUpdateAPIView.as_view(),
        name="user_profile_get_update",
    ),
    path(
        "identity-verification/",
        UserIdentityVerificationAPIView.as_view(),
        name="identity_verification",
    ),
    path(
        "identity-live-verification/",
        UserSelfieVerificationAPIView.as_view(),
        name="identity_live_verification",
    ),
    path(
        "email-verification/",
        UserEmailVerificationAPIView.as_view(),
        name="email_verification",
    ),
    path("password-change/", UserPasswordChange.as_view(), name="password_change"),
    path("reviews/", UserReviewListApi.as_view(), name="review_list"),
    path(
        "logout/",
        logout,
        name="logout",
    ),
    path(
        "unread-messages/",
        UserUnreadMessageCountAPIView.as_view(),
        name="unread_message",
    ),
    path(
        "mobile-login/",
        mobile_login,
        name="mobile_login",
    ),
]
