import json
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from base.cache.redis_cache import get_cache, set_cache


@api_view(["GET"])
@permission_classes([AllowAny])
def get_map_place_suggestions(request: Request) -> Response:
    place = request.GET.get("place")
    if not place:
        return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
    # url = "https://maps.googleapis.com/maps/api/place/queryautocomplete/json"

    # place = place.split(",")[0]

    # params = {
    #     "input": place,
    #     "key": settings.GOOGLE_MAP_API_KEY,
    #     "types": "geocode",
    #     "components": "country:BD",
    # }

    results = (
        json.loads(get_cache(f"place_{place}")) if get_cache(f"place_{place}") else []
    )
    # if len(results) == 0:
    #     response = requests.get(url, params=params)
    #     if response.status_code == 200:
    #         data = response.json()
    #         if "predictions" in data:
    #             predictions = data["predictions"]
    #             print(predictions)
    #             for prediction in predictions:
    #                 results.append(
    #                     {
    #                         "description": prediction["description"],
    #                         "place_id": prediction.get("place_id"),
    #                         "reference": prediction.get("reference"),
    #                     }
    #                 )
    #             set_cache(f"place_{place}", json.dumps(results), ttl=604800)
    #         else:
    #             print("No predictions found.")
    #     else:
    #         print(
    #             f"API request failed with status code {response.status_code}: {response.text}"
    #         )

    if len(results) == 0:
        url = f"https://barikoi.xyz/v2/api/search/autocomplete/place?api_key={settings.BARIKOI_API_KEY}&q={place}&bangla=true"
        response = requests.request("GET", url)
        if response.status_code == 200:
            results = response.json().get("places")
            set_cache(f"place_{place}", json.dumps(results), ttl=604800)
        else:
            return Response(
                {"message": response.json()}, status=status.HTTP_400_BAD_REQUEST
            )

    return Response(data=results, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_place_info_by_id(request: Request, place_id: str) -> Response:
    url = f"https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key={settings.GOOGLE_MAP_API_KEY}"

    result = (
        json.loads(get_cache(f"place_id_{place_id}"))
        if get_cache(f"place_id_{place_id}")
        else None
    )
    if not result:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            location_data = data["results"][0]
            result = {
                "address": location_data.get("formatted_address", "N/A"),
                "lat": location_data["geometry"]["location"]["lat"],
                "lng": location_data["geometry"]["location"]["lng"],
            }
            set_cache(f"place_id_{place_id}", json.dumps(result), ttl=604800)
        else:
            print(
                f"API request failed with status code {response.status_code}: {response.text}"
            )

    return Response(data=result, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_address_by_lat_lng(request: Request) -> Response:
    latitude = request.GET.get("latitude")
    longitude = request.GET.get("longitude")

    if not latitude or not longitude:
        return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    # url = "https://maps.googleapis.com/maps/api/geocode/json"
    # query_params = {
    #     "key": settings.GOOGLE_MAP_API_KEY,
    #     "latlng": f"{latitude},{longitude}",
    #     # "result_type": "street_address",
    # }

    # response = requests.get(url, params=query_params)

    # result = None
    # if response.status_code == 200:
    #     data = response.json()
    #     print(data)
    #     if "results" in data and len(data["results"]) > 0:
    #         max_dict = max(
    #             data["results"], key=lambda x: len(x.get("formatted_address", ""))
    #         )
    #         # address = data["results"][0]["formatted_address"]
    #         address = max_dict["formatted_address"]
    #     else:
    #         address = data.get("plus_code", {}).get(
    #             "compound_code", data.get("plus_code", {}).get("global_code", None)
    #         )

    #     result = {"lat": float(latitude), "lng": float(longitude), "address": address}

    url = f"https://barikoi.xyz/v2/api/search/reverse/geocode?api_key={settings.BARIKOI_API_KEY}&longitude={longitude}&latitude={latitude}&district=true&post_code=true&country=true&sub_district=true&union=true&pauroshova=true&location_type=true&division=true&address=true&area=true&bangla=true"

    response = requests.request("GET", url)

    if response.status_code == 200:
        return Response(data=response.json().get("place"), status=status.HTTP_200_OK)
    else:
        return Response(data=response.json(), status=status.HTTP_400_BAD_REQUEST)
