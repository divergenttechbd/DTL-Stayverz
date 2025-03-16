from django.contrib import admin
from bookings.models import Booking, ListingBookingReview

# Register your models here.
admin.site.register([Booking, ListingBookingReview])
