from accounts.models import User
from wishlists.models import Wishlist


def run():
    objs = User.objects.filter(u_type="guest")
    for obj in objs:
        Wishlist.objects.create(user=obj)
    return
