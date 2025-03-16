from django.db import models
from django.contrib.auth import get_user_model
from base.models import BaseModel

User = get_user_model()


# Create your models here.
class Wishlist(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    items = models.ManyToManyField("listings.Listing", through="WishlistItem")

    def __str__(self):
        return str(self.pk)


class WishlistItem(BaseModel):
    wishlist = models.ForeignKey("Wishlist", on_delete=models.CASCADE)
    listing = models.ForeignKey("listings.Listing", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.pk)
