from datetime import datetime, date as Date, timedelta
from typing import Any
from django.db.models import Q
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer
from base.helpers.utils import identifier_builder
from base.type_choices import BookingStatusOption, UserTypeOption
from bookings.models import Booking, ListingBookingReview
from listings.models import Listing, ListingCalendar
from django.shortcuts import get_object_or_404

from listings.views.service import ListingCalendarDataProcess, ListingCheckoutCalculate


User = get_user_model()


class GuestBookingProcess:
    def __call__(self, request_data: dict, user) -> dict:
        current_date = Date.today()

        listing_id = request_data["listing"]
        listing_obj = Listing.objects.get(id=listing_id)

        from_date = datetime.strptime(request_data["check_in"], "%Y-%m-%d").date()
        to_date = datetime.strptime(request_data["check_out"], "%Y-%m-%d").date()

        if (
            from_date < current_date
            or to_date < current_date
            or not to_date > from_date
        ):
            return {
                "status": 400,
                "message": "Invalid date",
                "data": None,
            }

        date_filter = {
            "from_date": from_date,
            "to_date": to_date,
        }
        calendar_data = ListingCalendarDataProcess()(
            date_filter,
            listing_id,
        )

        calendar_data.popitem()

        checkout_data = ListingCheckoutCalculate()(
            booking_date_info=calendar_data.copy(),
            date_range=date_filter,
            instance=listing_obj,
        )
        if checkout_data["status"] != 200:
            return {
                "status": 400,
                "message": checkout_data["message"],
                "data": None,
            }

        checkout_data = checkout_data["data"]
        data = request_data
        data["invoice_no"] = identifier_builder(
            table_name="bookings_booking", prefix="BK"
        )
        data["guest"] = user.id
        data["host"] = listing_obj.host_id
        data["price"] = checkout_data["booking_price"]
        data["total_profit"] = checkout_data["total_profit"]
        data["guest_service_charge"] = checkout_data["guest_service_charge"]
        data["total_price"] = checkout_data["total_price"]

        updated_price_info = checkout_data["price_info"]
        for key in updated_price_info:
            # updated_price_info[key].update({"is_booked": True, "is_blocked": True})
            updated_price_info[key].pop("is_booked")
            updated_price_info[key].pop("is_blocked")
            updated_price_info[key].pop("id")

        data["host_service_charge"] = checkout_data["host_service_charge"]
        data["host_pay_out"] = checkout_data["host_pay_out"]
        data["night_count"] = checkout_data["nights"]
        data["price_info"] = updated_price_info
        data["guest_count"] = int(data["children_count"]) + int(data["adult_count"])

        result_data = []
        current_group = None

        for date, entry in calendar_data.items():
            if current_group is None:
                current_group = {
                    "start_date": date,
                    "end_date": date,
                    "price": entry["price"],
                    "base_price": listing_obj.price,
                    "listing_id": listing_id,
                    "is_blocked": True,
                    "is_booked": True,
                }
            elif entry["price"] == current_group["price"]:
                current_group["end_date"] = date
            else:
                result_data.append(current_group)
                current_group = {
                    "start_date": date,
                    "end_date": date,
                    "price": entry["price"],
                    "listing_id": listing_id,
                    "base_price": listing_obj.price,
                    "is_blocked": True,
                    "is_booked": True,
                }

        if current_group is not None:
            result_data.append(current_group)

        data["calendar_info"] = result_data
        return {"status": 200, "message": "ok", "data": data}


class BookingReviewProcess:
    def update_ratings(self, obj: Listing | User, rating: int) -> None:
        updated_total_rating_count = obj.total_rating_count + 1
        updated_total_rating_sum = obj.total_rating_sum + float(rating)
        update_avg_rating = updated_total_rating_sum / updated_total_rating_count

        obj.total_rating_count = updated_total_rating_count
        obj.total_rating_sum = updated_total_rating_sum
        obj.avg_rating = update_avg_rating
        obj.save()

    def validate_booking_review_data(
        self,
        data: dict,
        invoice_no: str,
        user: User,
    ) -> dict:
        current_date = Date.today()

        filter_param = {
            "invoice_no": invoice_no,
            "status": BookingStatusOption.CONFIRMED,
            # "check_out__lt": current_date,
        }

        booking_obj = Booking.objects.get(**filter_param)

        if user.u_type == UserTypeOption.GUEST:
            filter_param["guest_id"] = user.id
            review_for_id = booking_obj.host_id
        else:
            filter_param["host_id"] = user.id
            review_for_id = booking_obj.guest_id

        if booking_obj.check_out > current_date:
            return {
                "message": "Invalid booking or you can add review after checkout date",
                "status": 400,
            }

        if ListingBookingReview.objects.filter(
            booking_id=booking_obj.id, review_by_id=user.id
        ).exists():
            return {
                "message": "You have already add review for this booking",
                "status": 400,
            }

        booking_review_data = {
            "status": 200,
            "review_data": {
                "listing_id": booking_obj.listing_id,
                "booking_id": booking_obj.id,
                "review_by_id": user.id,
                "review_for_id": review_for_id,
                "is_guest_review": user.u_type == UserTypeOption.GUEST,
                "is_host_review": user.u_type == UserTypeOption.HOST,
                "rating": data.get("rating"),
                "review": data.get("review"),
            },
            "booking_obj": booking_obj,
        }

        return booking_review_data


class BookingDataFilterProcess:
    def __call__(self, query_param, current_user):
        current_date = Date.today()
        if query_param == "currently_hosting":
            qs = Booking.objects.filter(
                Q(check_in__lte=current_date) & Q(check_out__gte=current_date),
                host_id=current_user.id,
                status=BookingStatusOption.CONFIRMED,
            )
        elif query_param == "completed":
            qs = Booking.objects.filter(
                status=BookingStatusOption.CONFIRMED,
                check_out__lt=current_date,
                host_id=current_user.id,
            )
        elif query_param == "upcoming":
            qs = Booking.objects.filter(
                status=BookingStatusOption.CONFIRMED,
                check_in__gt=current_date,
                host_id=current_user.id,
            )
        elif query_param == "pending_review":
            qs = Booking.objects.filter(
                status=BookingStatusOption.CONFIRMED,
                host_review_done=False,
                host_id=current_user.id,
                check_out__lt=current_date,
            )
        elif query_param == "checking_out":
            qs = Booking.objects.filter(
                status=BookingStatusOption.CONFIRMED,
                host_id=current_user.id,
                check_out=current_date,
            )
        elif query_param == "arriving_soon":
            qs = Booking.objects.filter(
                status=BookingStatusOption.CONFIRMED,
                host_id=current_user.id,
                # check_in__gte=current_date + timedelta(days=3),
                check_in__gte=current_date + timedelta(days=1),
                check_in__lte=current_date + timedelta(days=7),
            )
        else:
            qs = Booking.objects.filter(
                host_id=current_user.id,
                status=BookingStatusOption.CONFIRMED,
            )

        return qs
