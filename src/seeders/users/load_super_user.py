from accounts.models import User

SUPERUSER_USERNAME = "admin@gmail.com"
SUPERUSER_EMAIL = "admin@gmail.com"
SUPERUSER_PASSWORD = "admin"
EXTRA = {
    "is_active": True,
    "phone_number": "01630811624",
    "wishlist_listings": [],
    "u_type": "system",
}


def run():
    User.objects.create_superuser(
        SUPERUSER_USERNAME, SUPERUSER_EMAIL, SUPERUSER_PASSWORD, **EXTRA
    )
    return
