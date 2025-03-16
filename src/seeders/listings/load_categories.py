from listings.models import Category
from django.conf import settings

if settings.ENVIRONMENT != "prod":
    host = "https://dapcxdqknn4nj.cloudfront.net/"
else:
    host = "https://d26o11dgjud8ta.cloudfront.net/"

categories = [
    {
        "name": "Home",
        "icon": f"{host}/icons/categories/ApartmentHome.svg",
    },
    {
        "name": "Apartment",
        "icon": f"{host}/icons/categories/Apartment.svg",
    },
    {
        "name": "Guest House",
        "icon": f"{host}/icons/categories/GuestHouse.svg",
    },
    {
        "name": "Hotel",
        "icon": f"{host}/icons/categories/Hotel.svg",
    },
    {
        "name": "Cabin",
        "icon": f"{host}/icons/categories/Cabin.svg",
    },
]


def run():
    Category.objects.bulk_create([Category(**item) for item in categories])
    return
