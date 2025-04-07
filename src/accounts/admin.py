from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from accounts.models import UserProfile, UserDTL

# Register your models here.
User = get_user_model()


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    fieldsets = UserAdmin.fieldsets + (
        (
            "Profile",
            {
                "fields": (
                    "phone_number",
                    "u_type",
                    "role",
                    "identity_verification_status",
                    "identity_verification_images",
                )
            },
        ),
    )
    model = User
    list_display = (
        "username",
        # "first_name",
        # "last_name",
        "is_staff",
        "is_active",
        "is_superuser",
        "created_at",
        "total_property",
        "total_sell_amount",
        "total_rating_count",
        "total_rating_sum",
    )
    list_filter = [
        "is_staff",
    ]
    list_editable = [
        "is_active",
        "is_staff",
        "total_rating_count",
        "total_rating_sum",
    ]
    list_per_page = 20


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    model = Permission
    fields = ["name"]


admin.site.register([UserProfile, UserDTL])
