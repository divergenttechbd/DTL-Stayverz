from django.contrib import admin
from listings.models import Listing, ListingAmenity, ListingCalendar, Category, Amenity

# Register your models here.

admin.site.register([Listing, ListingAmenity, ListingCalendar, Category, Amenity])
