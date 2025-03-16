from listings.models import Amenity
from django.conf import settings

if settings.ENVIRONMENT != "prod":
    host = "https://dapcxdqknn4nj.cloudfront.net"
else:
    host = "https://d26o11dgjud8ta.cloudfront.net"

amenity_data = [
    {
        "a_type": "regular",
        "name": "Wifi",
        "icon": f"{host}/icons/amenities/Wifi.svg",
    },
    {
        "a_type": "regular",
        "icon": f"{host}/icons/amenities/TV.svg",
        "name": "TV",
    },
    {
        "a_type": "regular",
        "name": "Kitchen",
        "icon": f"{host}/icons/amenities/Kitchen.svg",
    },
    {
        "a_type": "regular",
        "icon": f"{host}/icons/amenities/Washer.svg",
        "name": "Washer",
    },
    {
        "a_type": "regular",
        "name": "Free parking on premises",
        "icon": f"{host}/icons/amenities/FreeParking.svg",
    },
    {
        "a_type": "regular",
        "icon": f"{host}/icons/amenities/PaidParking.svg",
        "name": "Paid parking on premises",
    },
    {
        "a_type": "regular",
        "name": "Air conditioning",
        "icon": f"{host}/icons/amenities/AirConditioning.svg",
    },
    {
        "a_type": "regular",
        "icon": f"{host}/icons/amenities/DedicatedWorkspace.svg",
        "name": "Dedicated Workspace",
    },
    {
        "a_type": "stand_out",
        "name": "pool",
        "icon": f"{host}/icons/amenities/Pool.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Hot tub",
        "icon": f"{host}/icons/amenities/HotTub.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Patio",
        "icon": f"{host}/icons/amenities/Patio.svg",
    },
    {
        "a_type": "stand_out",
        "name": "BBQ grill",
        "icon": f"{host}/icons/amenities/BBQGrill.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Outside dining area",
        "icon": f"{host}/icons/amenities/OutsideDining.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Fire pit",
        "icon": f"{host}/icons/amenities/FirePit.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Indoor fireplace",
        "icon": f"{host}/icons/amenities/IndoorFireplace.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Piano",
        "icon": f"{host}/icons/amenities/Piano.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Exercise Equipment",
        "icon": f"{host}/icons/amenities/ExerciseEquipment.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Lake access",
        "icon": f"{host}/icons/amenities/LakeAccess.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Beach access",
        "icon": f"{host}/icons/amenities/BeachAccess.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Ski-in/Ski-out",
        "icon": f"{host}/icons/amenities/SkiOutSkiIn.svg",
    },
    {
        "a_type": "stand_out",
        "name": "Outdoor shower",
        "icon": f"{host}/icons/amenities/OutdoorShower.svg",
    },
    {
        "a_type": "safety",
        "name": "Smoke Alarm",
        "icon": f"{host}/icons/amenities/SmokeAlarm.svg",
    },
    {
        "a_type": "safety",
        "name": "First aid kit",
        "icon": f"{host}/icons/amenities/FirstAidKit.svg",
    },
    {
        "a_type": "safety",
        "name": "Fire extinguisher",
        "icon": f"{host}/icons/amenities/FireExtinguisher.svg",
    },
    {
        "a_type": "safety",
        "name": "Carbon monoxide alarm",
        "icon": f"{host}/icons/amenities/CarbonMonoxideAlarm.svg",
    },
]


def run():
    Amenity.objects.bulk_create([Amenity(**item) for item in amenity_data])
    return
