import django_filters
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFilter(django_filters.FilterSet):
    date_joined = django_filters.DateFromToRangeFilter()
    created_at = django_filters.DateFromToRangeFilter()

    class Meta:
        model = User
        fields = (
            "is_active",
            "status",
            "u_type",
            "identity_verification_status",
            "role",
        )
