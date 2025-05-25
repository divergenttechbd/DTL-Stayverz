from rest_framework import serializers
from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from payments.models import HostPayMethod, OnlinePayment, HostPayment, HostPaymentItem


class OnlinePaymentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = OnlinePayment
        fields = "__all__"


class HostPayMethodSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPayMethod
        fields = "__all__"

    def validate(self, data):
        if self.instance:
            data.pop("m_type", None)
            data["bank_name"] = (
                data.get("bank_name")
                if data.get("bank_name")
                else self.instance.bank_name
            )
            data["branch_name"] = (
                data.get("branch_name")
                if data.get("branch_name")
                else self.instance.branch_name
            )
            data["routing_number"] = (
                data.get("routing_number")
                if data.get("routing_number")
                else self.instance.routing_number
            )
        else:
            m_type = data["m_type"]
            if m_type == "bank":
                if (
                    not data.get("bank_name")
                    or not data.get("branch_name")
                    or not data.get("routing_number")
                ):
                    raise serializers.ValidationError("Invalid data")

        return data


class HostPaymentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPayment
        fields = "__all__"

    def get_host(self, obj):
        return UserSerializer(
            obj.host,
            fields=["id", "full_name", "image", "phone_number"],
        ).data

    def get_pay_method(self, obj):
        return HostPayMethodSerializer(
            obj.pay_method,
            fields=[
                "id",
                "m_type",
                "branch_name",
                "bank_name",
                "account_name",
                "account_no",
            ],
        ).data


class HostPaymentItemSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPaymentItem
        fields = "__all__"



#  ------------------------------ fin report -------------------------
from decimal import Decimal
class MonthlyEarningSerializer(serializers.Serializer): # For Income Payments Graph
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    month_name = serializers.CharField()
    booking_related_earnings = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    suggestion_rewards_earned = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    gross_total_earnings = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

class MonthlyPaymentSerializer(serializers.Serializer): # For Payments Overview (Payouts)
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    month_name = serializers.CharField()
    received_payment_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    booking_amount_earned = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

class MonthlyBookingAmountSerializer(serializers.Serializer): # For new requirement
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    month_name = serializers.CharField()
    booking_amount_earned = serializers.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00')) # From Booking.host_pay_out

class YearlyIncomeSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    total_income = serializers.DecimalField(max_digits=14, decimal_places=2)

class InsightSerializer(serializers.Serializer):
    last_7_days_nights_booked = serializers.IntegerField(default=0)
    last_30_days_booking_value = serializers.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    last_365_days_5_star_rating_percentage = serializers.FloatField(default=0.0) # Changed

class HostFinanceReportDataSerializer(serializers.Serializer):
    current_month_total_earnings = serializers.DecimalField(max_digits=12, decimal_places=2)
    summary_previous_year_booking_earnings = serializers.DecimalField(max_digits=14, decimal_places=2)
    summary_lifetime_suggestion_rewards = serializers.DecimalField(max_digits=14, decimal_places=2)

    last_12_months_payments_overview = MonthlyPaymentSerializer(many=True, default=list)

    last_6_months_received_payments_graph = MonthlyPaymentSerializer(many=True, default=list)
    total_earnings_last_6_months_from_payouts = serializers.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00')) # NEW

    current_year_monthly_booking_amounts = MonthlyBookingAmountSerializer(many=True, default=list) # NEW
    previous_year_monthly_booking_amounts = MonthlyBookingAmountSerializer(many=True, default=list) # NEW

    current_year_total_income = serializers.DecimalField(max_digits=14, decimal_places=2) # Gross (booking + referral)
    previous_year_total_income = serializers.DecimalField(max_digits=14, decimal_places=2) # Gross (booking + referral)

    last_12_months_income_payments_graph = MonthlyEarningSerializer(many=True, default=list) # Gross earnings
    historical_yearly_income_summary = YearlyIncomeSerializer(many=True, default=list)
    insights = InsightSerializer(default=dict)



class Last6MonthsPayoutBreakdownSerializer(serializers.Serializer):
    period_start_date = serializers.DateField()
    period_end_date = serializers.DateField()
    gross_earnings_from_included_bookings = serializers.DecimalField(max_digits=14, decimal_places=2) # Sum of Booking.price for bookings in these payouts
    host_service_fee_from_included_bookings = serializers.DecimalField(max_digits=14, decimal_places=2) # Sum of Booking.host_service_charge for bookings in these payouts
    total_received_payouts_in_period = serializers.DecimalField(max_digits=14, decimal_places=2)



class MonthlyListingEarningSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField()
    listing_title = serializers.CharField()
    listing_cover_photo = serializers.URLField(allow_null=True, required=False, allow_blank=True )
    earnings_from_this_listing_for_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    # Optional: nights_booked_for_this_listing_for_month = serializers.IntegerField()

class MonthlyPerformanceStatsSerializer(serializers.Serializer):
    total_nights_booked_for_month = serializers.IntegerField()
    average_nights_per_stay_for_month = serializers.FloatField() # Or DecimalField

class MonthlyEarningsDetailSerializer(serializers.Serializer):
    selected_year = serializers.IntegerField()
    selected_month = serializers.IntegerField()
    selected_month_name = serializers.CharField()

    # "You earned X" - This is the net amount host is due for the month from bookings and referrals
    total_net_earnings_for_month = serializers.DecimalField(max_digits=12, decimal_places=2) # host_pay_out + referral_rewards

    # Breakdown section
    gross_booking_earnings_for_month = serializers.DecimalField(max_digits=12, decimal_places=2) # Sum of Booking.price
    total_host_service_fee_for_month = serializers.DecimalField(max_digits=12, decimal_places=2) # Sum of Booking.host_service_charge
    # adjustments and taxes are skipped as per your request
    net_from_bookings_for_month = serializers.DecimalField(max_digits=12, decimal_places=2) # Gross Booking Earnings - Host Service Fee

    performance_stats = MonthlyPerformanceStatsSerializer()
    listings_contributing_to_earnings = MonthlyListingEarningSerializer(many=True)
