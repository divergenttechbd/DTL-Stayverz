from typing import Any
from django.db.models import Q
from datetime import datetime
from base.helpers.utils import calculate_days_between_dates, date_range
from configurations.models import ServiceCharge
from listings.models import Listing, ListingAmenity, ListingCalendar


class ListingCreateDataProcess:
    def __init__(self, listing: Listing) -> None:
        self.listing = listing

    def process_amenities(self, amenities: list) -> None:
        exist_listing_amenities_ids = list(
            ListingAmenity.objects.filter(listing_id=self.listing.id).values_list(
                "amenity_id", flat=True
            )
        )

        remove_listing_amenity_ids = list(
            set(exist_listing_amenities_ids) - set(amenities)
        )
        new_listing_amenities_ids = list(
            set(amenities) - set(exist_listing_amenities_ids)
        )

        listing_amenities = []
        for amenity in new_listing_amenities_ids:
            listing_amenities.append(
                {
                    "listing_id": self.listing.id,
                    "amenity_id": amenity,
                }
            )

        ListingAmenity.objects.filter(
            listing_id=self.listing, amenity_id__in=remove_listing_amenity_ids
        ).delete()
        ListingAmenity.objects.bulk_create(
            [ListingAmenity(**item) for item in listing_amenities]
        )
        return None

    def process_listing_price(self, requested_price: float) -> None:
        today = datetime.today()
        ListingCalendar.objects.create(
            listing_id=self.listing.id,
            base_price=requested_price,
            custom_price=requested_price,
            start_date=today,
            is_blocked=False,
            is_booked=False,
        )
        return None


class ListingCalendarDataProcess:
    def __call__(self, data: dict, listing_id: str) -> dict:
        from_date = data.get("from_date")
        to_date = data.get("to_date")

        listings = list(
            ListingCalendar.objects.filter(
                Q(end_date__isnull=True)
                | Q(start_date__lte=to_date, end_date__gte=from_date),
                listing_id=listing_id,
            ).values(
                "id",
                "start_date",
                "end_date",
                "custom_price",
                "is_blocked",
                "is_booked",
                "booking_data",
                "note",
            )
        )

        new_data = [entry for entry in listings if entry["end_date"] is not None]
        null_data = [entry for entry in listings if entry["end_date"] is None]
        listings = null_data + new_data
        formatted_data = {}

        for date_obj in date_range(from_date, to_date):
            date_str = str(date_obj)
            formatted_data[date_str] = {
                "id": listings[0]["id"],
                "price": listings[0]["custom_price"],
                "is_blocked": False,
                "is_booked": False,
            }

            for item in listings:
                start_date = item["start_date"]
                end_date = item["end_date"]
                price = item["custom_price"]
                is_blocked = item["is_blocked"]
                is_booked = item["is_booked"]
                listing_calendar_id = item["id"]
                booking_data = item["booking_data"]
                date_range_end = end_date if end_date is not None else to_date
                if date_obj in date_range(
                    start_date, date_range_end
                ):  # date_obj >= start_date and  date_obj <= date_range_end
                    formatted_data[date_str] = {
                        "id": listing_calendar_id,
                        "price": price,
                        "is_blocked": is_blocked,
                        "is_booked": is_booked,
                        "booking_data": booking_data,
                        "note": item["note"],
                    }

        formatted_data = dict(formatted_data)
        return formatted_data


class ListingCheckoutCalculate:
    def __call__(
        self, booking_date_info: dict, date_range: dict, instance: Listing
    ) -> dict:
        is_blocked_true = any(item["is_blocked"] for item in booking_date_info.values())
        nights = calculate_days_between_dates(
            date_range.get("from_date"), date_range.get("to_date")
        )
        pass_night_check = instance.minimum_nights <= nights <= instance.maximum_nights

        if is_blocked_true or not pass_night_check:
            message = f"Room is blocked, or it does not pass minimum {instance.minimum_nights} and maximum {instance.maximum_nights} night check."
            return {"message": message, "status": 400}

        data = {}
        booking_price = sum(entry["price"] for entry in booking_date_info.values())

        service_charges = list(ServiceCharge.objects.values())
        guest_service_charge = 0
        host_service_charge = 0

        for item in service_charges:
            if item["sc_type"] == "host_charge":
                host_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )
            elif item["sc_type"] == "guest_charge":
                guest_service_charge = (
                    item["value"] / 100
                    if item["calculation_type"] == "percentage"
                    else item["value"]
                )

        guest_service_charge = round(guest_service_charge * booking_price, 2)
        host_service_charge = round(host_service_charge * booking_price, 2)

        total_price = booking_price + guest_service_charge
        host_pay_out = booking_price - host_service_charge
        total_profit = host_service_charge  # host_service_charge + guest_service_charge

        data["nights"] = nights
        data["booking_price"] = booking_price
        data["guest_service_charge"] = guest_service_charge
        data["total_price"] = total_price
        data["host_service_charge"] = host_service_charge
        data["host_pay_out"] = host_pay_out
        data["price_info"] = booking_date_info
        data["total_profit"] = total_profit
        return {"data": data, "status": 200}
