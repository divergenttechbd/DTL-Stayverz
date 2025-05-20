from django.db import models
from django.contrib.gis.db.models import PointField
from django.contrib.gis.geos import Point
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from base.models import BaseModel
from base.type_choices import (
    AmenityTypeOption,
    ListingStatusOption,
    ListingVerificationStatusOption,
    PlaceTypeOption,
)
from django.utils import timezone
from configurations.data import default_cancellation_policy
from django.utils.translation import gettext_lazy as _
# Create your models here.
User = get_user_model()


class ListingSoftDeleteManager(models.Manager):
    def get_queryset(self):
        return ListingSoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)


class ListingSoftDeleteQuerySet(models.QuerySet):
    """
    QuerySet that supports soft delete operations for listings.
    """

    def delete(self):
        return self.update(is_deleted=True, deleted_at=timezone.now())

    def hard_delete(self):
        return super().delete()

    def restore(self):
        return self.update(is_deleted=False, deleted_at=None)


class Category(BaseModel):
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Listing Category"
        verbose_name_plural = "1. Listing Category"

    def __str__(self):
        return self.name


class Amenity(BaseModel):
    name = models.CharField(max_length=200)
    a_type = models.CharField(max_length=20, choices=AmenityTypeOption.choices)
    icon = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Listing Amenity"
        verbose_name_plural = "2. Listing Amenities"

    def __str__(self):
        return self.name


class Listing(BaseModel):
    unique_id = models.UUIDField(unique=True)
    host = models.ForeignKey(User, on_delete=models.PROTECT)
    category = models.ForeignKey(
        "listings.Category", on_delete=models.PROTECT, null=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.FloatField(default=0)
    cover_photo = models.URLField(blank=True)
    images = models.JSONField(default=list, blank=True)
    place_type = models.CharField(
        max_length=20, choices=PlaceTypeOption.choices, blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=ListingStatusOption.choices,
        default=ListingStatusOption.IN_PROGRESS,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=ListingVerificationStatusOption.choices,
        default=ListingVerificationStatusOption.UNVERIFIED,
    )
    guest_count = models.PositiveIntegerField(default=0)
    bedroom_count = models.PositiveIntegerField(default=0)
    bed_count = models.PositiveIntegerField(default=0)
    bathroom_count = models.PositiveIntegerField(default=0)
    minimum_nights = models.PositiveIntegerField(default=1)
    maximum_nights = models.PositiveIntegerField(default=30)
    address = models.CharField(max_length=200, blank=True)
    pet_allowed = models.BooleanField(default=False)
    event_allowed = models.BooleanField(default=False)
    smoking_allowed = models.BooleanField(default=False)
    media_allowed = models.BooleanField(default=False)
    unmarried_couples_allowed = models.BooleanField(default=False)
    cancellation_policy = models.JSONField(default=default_cancellation_policy)
    check_in = models.TimeField(default="12:00")
    check_out = models.TimeField(default="11:00")
    avg_rating = models.FloatField(default=0)
    total_rating_sum = models.FloatField(default=0)
    total_rating_count = models.PositiveIntegerField(default=0)
    total_booking_count = models.PositiveIntegerField(default=0)
    location = PointField(default=Point(0, 0))

    district = models.CharField(blank=True)
    division = models.CharField(blank=True)

    area = models.CharField(blank=True)
    city = models.CharField(blank=True)


    instant_booking_allowed = models.BooleanField(default=False)
    require_guest_good_track_record = models.BooleanField(default=False)

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    objects = ListingSoftDeleteManager()
    all_objects = ListingSoftDeleteQuerySet.as_manager()

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "3. Listing"

    @property
    def latitude(self) -> float:
        return self.location.x

    @property
    def longitude(self) -> float:
        return self.location.y

    def delete(self, using=None, keep_parents=False):
        """Override delete method to implement soft delete"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """Method to actually delete the record from the database"""
        super().delete(using, keep_parents)

    def restore(self):
        """Method to restore a soft-deleted record"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

    def clean(self):
        if self.require_guest_good_track_record and not self.instant_booking_allowed:
            raise ValidationError({
                'require_guest_good_track_record': _(
                    'Cannot require good track record if instant booking is not allowed.')
            })
        super().clean()

    def save(self, *args, **kwargs):
        if not self.instant_booking_allowed:
            self.require_guest_good_track_record = False
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ListingAmenity(BaseModel):
    listing = models.ForeignKey("listings.Listing", on_delete=models.PROTECT)
    amenity = models.ForeignKey("listings.Amenity", on_delete=models.PROTECT)

    class Meta:
        verbose_name = "Listing Amenity"
        verbose_name_plural = "4. Listing Amenity"

    def __str__(self):
        return str(self.pk)


class ListingCalendar(BaseModel):
    listing = models.ForeignKey("listings.Listing", on_delete=models.PROTECT)
    base_price = models.FloatField()
    custom_price = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_blocked = models.BooleanField(default=False)
    is_booked = models.BooleanField(default=False)
    note = models.TextField(blank=True)
    booking_data = models.JSONField(default=dict)

    class Meta:
        verbose_name = "Listing Calendar"
        verbose_name_plural = "5. Listing Calendar"

    def __str__(self):
        return str(self.pk)



