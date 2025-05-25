from datetime import datetime, date as Date, timedelta
from decimal import Decimal, InvalidOperation
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
from ..coupon_service import validate_and_get_coupon_discount_info
from typing import Dict


User = get_user_model()


class GuestBookingProcess:
    def __call__(self, request_data: Dict[str, Any], user: User) -> Dict[str, Any]:
        current_date = Date.today()

        listing_id = request_data.get("listing")
        if not listing_id:
            return {"status": 400, "message": "Listing ID is required.", "data": None}
        try:
            listing_obj = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return {"status": 404, "message": "Listing not found.", "data": None}

        try:
            from_date_str = request_data.get("check_in")
            to_date_str = request_data.get("check_out")
            if not from_date_str or not to_date_str:
                return {"status": 400, "message": "Check-in and Check-out dates are required.", "data": None}
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"status": 400, "message": "Invalid date format. Please use YYYY-MM-DD.", "data": None}

        if not (from_date >= current_date and to_date > from_date):
            return {"status": 400, "message": "Invalid booking date range.", "data": None}

        date_filter = {"from_date": from_date, "to_date": to_date}
        calendar_data_process = ListingCalendarDataProcess()
        raw_calendar_data_for_period = calendar_data_process(date_filter, listing_id)
        if not raw_calendar_data_for_period:
            return {"status": 400, "message": "No availability/pricing for selected dates.", "data": None}

        checkout_calculator = ListingCheckoutCalculate()
        checkout_data_result = checkout_calculator(
            booking_date_info=raw_calendar_data_for_period.copy(),
            date_range=date_filter,
            instance=listing_obj,
        )
        if checkout_data_result["status"] != 200:
            return checkout_data_result
        checkout_data = checkout_data_result["data"]

        try:
            current_total_price_before_discount = Decimal(str(checkout_data.get("total_price", "0.00")))
        except (TypeError, InvalidOperation, KeyError) as e:
            return {"status": 500, "message": f"Error processing initial booking price: {e}", "data": None}

        final_price_after_discount = current_total_price_before_discount
        applied_discount_amount = Decimal('0.00')
        coupon_validation_message = None

        # Initialize with default values to prevent field_errors
        booking_applied_coupon_code_value = None
        booking_applied_coupon_type_value = None
        booking_applied_referral_coupon_pk = None
        booking_applied_admin_coupon_pk = None

        coupon_code_from_request = request_data.get('coupon_code')
        if coupon_code_from_request:
            coupon_info = validate_and_get_coupon_discount_info(
                coupon_code_input=coupon_code_from_request,
                order_total=current_total_price_before_discount,
                booking_user=user
            )

            # Always include a valid coupon_code_matched, even if invalid
            coupon_validation_message = coupon_info.get('message', 'Coupon processing completed.')

            # Set coupon_code_matched regardless of validity (user's input or default)
            booking_applied_coupon_code_value = coupon_info.get('coupon_code_matched', coupon_code_from_request)

            if coupon_info.get('is_valid', False):
                final_price_after_discount = coupon_info.get('final_price', current_total_price_before_discount)
                applied_discount_amount = coupon_info.get('discount_amount', Decimal('0.00'))
                booking_applied_coupon_type_value = coupon_info.get('coupon_type')

                if booking_applied_coupon_type_value == 'referral' and coupon_info.get('coupon_object'):
                    booking_applied_referral_coupon_pk = coupon_info['coupon_object'].pk
                elif booking_applied_coupon_type_value == 'admin' and coupon_info.get('coupon_object'):
                    booking_applied_admin_coupon_pk = coupon_info['coupon_object'].pk
            else:
                print(f"GuestBookingProcess: Coupon validation failed: {coupon_validation_message}")
                # Proceed without discount, but keep the invalid coupon code for reference

        # --- Prepare data_for_serializer ---
        data_for_serializer = {
            "invoice_no": identifier_builder(table_name="bookings_booking", prefix="BK"),
            "guest": user.id,
            "host": listing_obj.host_id,
            "listing": listing_obj.id,
            "check_in": from_date_str,
            "check_out": to_date_str,
            "night_count": checkout_data.get("nights", 0),
            "children_count": int(request_data.get("children_count", 0)),
            "adult_count": int(request_data.get("adult_count", 1)),
            "infant_count": int(request_data.get("infant_count", 0)),
            "price": float(checkout_data.get("booking_price", 0.00)),
            "guest_service_charge": float(checkout_data.get("guest_service_charge", 0.00)),
            "total_price": float(final_price_after_discount),  # Final price user pays
            "paid_amount": 0.00,  # Will be updated after payment
            "host_service_charge": float(checkout_data.get("host_service_charge", 0.00)),
            "host_pay_out": float(checkout_data.get("host_pay_out", 0.00)),
            "total_profit": float(checkout_data.get("total_profit", 0.00)),
            "price_info": {},  # To be populated below
            "calendar_info": [],  # To be populated below
            "is_test_booking": request_data.get("test_booking", False),

            # Coupon related fields - ensure all required fields have at least default values
            "applied_coupon_code": booking_applied_coupon_code_value,  # Important: This was missing or inconsistent
            "applied_coupon_type": booking_applied_coupon_type_value,
            "applied_referral_coupon": booking_applied_referral_coupon_pk,
            "applied_admin_coupon": booking_applied_admin_coupon_pk,
            "discount_amount_applied": float(applied_discount_amount),  # Convert Decimal to float
            "price_after_discount": float(final_price_after_discount),  # Convert Decimal to float

            # Add the coupon_code_matched field explicitly to avoid the field_error
            "coupon_code_matched": booking_applied_coupon_code_value,
        }
        # Calculate guest_count after individual counts are set
        data_for_serializer["guest_count"] = data_for_serializer["children_count"] + data_for_serializer["adult_count"]

        # Price info processing
        raw_price_info_from_checkout = checkout_data.get("price_info", {})
        cleaned_price_info_for_booking = {}
        for key, entry_info in raw_price_info_from_checkout.items():
            cleaned_entry = entry_info.copy()
            cleaned_entry.pop("is_booked", None)
            cleaned_entry.pop("is_blocked", None)
            cleaned_entry.pop("id", None)
            cleaned_price_info_for_booking[key] = cleaned_entry
        data_for_serializer["price_info"] = cleaned_price_info_for_booking

        # Calendar info processing
        processed_calendar_info_for_booking = []
        current_group = None
        for date_key_str, entry_details in raw_calendar_data_for_period.items():
            current_price_for_day = entry_details.get("price")
            if current_price_for_day is None: continue
            current_day_date_obj = datetime.strptime(date_key_str, "%Y-%m-%d").date()
            if current_group is None:
                current_group = {
                    "start_date": current_day_date_obj.isoformat(), "end_date": current_day_date_obj.isoformat(),
                    "price": current_price_for_day, "base_price": listing_obj.price,
                    "listing_id": listing_id, "is_blocked": True, "is_booked": True,
                }
            elif current_price_for_day == current_group["price"] and \
                current_day_date_obj == (Date.fromisoformat(current_group["end_date"]) + timedelta(days=1)):
                current_group["end_date"] = current_day_date_obj.isoformat()
            else:
                processed_calendar_info_for_booking.append(current_group)
                current_group = {
                    "start_date": current_day_date_obj.isoformat(), "end_date": current_day_date_obj.isoformat(),
                    "price": current_price_for_day, "base_price": listing_obj.price,
                    "listing_id": listing_id, "is_blocked": True, "is_booked": True,
                }
        if current_group is not None:
            processed_calendar_info_for_booking.append(current_group)
        data_for_serializer["calendar_info"] = processed_calendar_info_for_booking

        final_api_message = "Booking data processed successfully."
        if coupon_validation_message:
            final_api_message = coupon_validation_message

        return {"status": 200, "message": final_api_message, "data": data_for_serializer}


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
