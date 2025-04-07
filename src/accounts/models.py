from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.postgres.fields import ArrayField
from base.models import BaseModel
from base.type_choices import (
    IdentityVerificationMethod,
    IdentityVerificationStatusOption,
    UserStatusOption,
    UserTypeOption,
    UserRoleOption,
)


# Create your models here.
class User(AbstractUser, BaseModel):
    email = models.EmailField(blank=True)
    image = models.URLField(blank=True)
    phone_number = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    status = models.CharField(
        max_length=15, choices=UserStatusOption.choices, default=UserStatusOption.ACTIVE
    )
    u_type = models.CharField(max_length=15, choices=UserTypeOption.choices)
    role = models.CharField(max_length=15, choices=UserRoleOption.choices, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    identity_verification_status = models.CharField(
        max_length=15,
        choices=IdentityVerificationStatusOption.choices,
        default=IdentityVerificationStatusOption.NOT_VERIFIED,
    )
    identity_verification_method = models.CharField(
        max_length=15, choices=IdentityVerificationMethod.choices, blank=True
    )
    identity_verification_images = models.JSONField(default=dict)
    identity_verification_reject_reason = models.TextField(blank=True)
    country_code = models.CharField(max_length=10, default="BD")
    avg_rating = models.FloatField(default=0)
    total_rating_sum = models.FloatField(default=0)
    total_rating_count = models.PositiveIntegerField(default=0)
    total_property = models.PositiveIntegerField(default=0)
    total_sell_amount = models.FloatField(default=0)
    wishlist_listings = ArrayField(models.PositiveBigIntegerField(), blank=True)

    # avg_rating,

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "1. User"

    def __str__(self):
        return self.username


class UserProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.PROTECT)
    school = models.CharField(max_length=200, blank=True)
    work = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    bio = models.TextField(blank=True)
    languages = ArrayField(models.CharField(max_length=50), blank=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "2. User Profile"

    def __str__(self):
        return str(self.pk)


class UserDTL(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    password = models.CharField(max_length=200)

# class UserReview(BaseModel):
#     review_giver = models.ForeignKey(
#         User, on_delete=models.PROTECT, related_name="review_giver"
#     )
#     review_receiver = models.ForeignKey(
#         User, on_delete=models.PROTECT, related_name="review_receiver"
#     )
#     review = models.TextField()
#     rating = models.PositiveIntegerField()
