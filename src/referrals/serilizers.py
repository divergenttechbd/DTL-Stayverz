from django.db.models.functions import Coalesce
from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal
from django.conf import settings

from .models import Referral, ReferralReward, Coupon, RewardStatus, ReferralType, CouponStatus
# Assuming your User model is from settings.AUTH_USER_MODEL and you have a UserSerializer
# from accounts.serializers import UserSerializer # Adjust path as needed
# For this example, I'll define a placeholder UserSerializer
class UserSerializer(serializers.Serializer): # Placeholder
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    u_type = serializers.CharField(read_only=True)
    image = serializers.URLField(read_only=True, allow_null=True)


    # This is a placeholder. You should use your actual UserSerializer.
    # It's common to use DynamicFieldsModelSerializer or similar for flexibility.
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

# If you have a BookingSerializer, you might want to import it for nested details
# from bookings.serializers import MinimalBookingSerializer # Example

class ReferralSerializer(serializers.ModelSerializer):
    referrer = UserSerializer(read_only=True, fields=['id', 'username', 'full_name', 'u_type'])
    referred_user = UserSerializer(read_only=True, fields=['id', 'username', 'full_name', 'u_type', 'image'],allow_null=True)
    referral_link = serializers.SerializerMethodField()
    referral_type_display = serializers.CharField(source='get_referral_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    reward_value_from_this_referral = serializers.SerializerMethodField()
    reward_unit_from_this_referral = serializers.SerializerMethodField()

    class Meta:
        model = Referral
        fields = (
            'id',
            'referrer',
            'referral_code',
            'referral_type',
            'referral_type_display',
            'referred_user',
            'status',
            'status_display',
            'rewarded_booking_count',
            'max_rewardable_bookings',
            'reward_value_from_this_referral',
            'reward_unit_from_this_referral',
            'is_active_for_rewards', # Property from model
            'created_at',
            'updated_at',
            'referral_link',
        )
        read_only_fields = fields # Make all fields read-only for list/retrieve

    def get_referral_link(self, obj):
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        registration_path = getattr(settings, 'FRONTEND_REGISTER_PATH', '/register')
        # Append referral type to the link to help frontend and registration logic
        return f"{base_url}{registration_path}?ref={obj.referral_code}&ref_type={obj.referral_type}"

    def get_reward_value_from_this_referral(self, obj: Referral) -> str:

        if obj.referrer:
            current_requesting_user = None
            if 'request' in self.context and self.context['request']:
                current_requesting_user = self.context['request'].user

            if current_requesting_user and obj.referrer == current_requesting_user:
                # Sum of 'amount' from ReferralReward where the current user is the beneficiary of this referral
                total_value = ReferralReward.objects.filter(
                    referral=obj,
                    user=obj.referrer  # The reward was given to the referrer
                ).aggregate(
                    total=Coalesce(Sum('amount'), Decimal('0.00'))
                )['total']

                # For GUEST_TO_GUEST, 'amount' in ReferralReward stores points.
                # No conversion needed here, just return the sum. Frontend will use the unit.
                return str(total_value)

        return '0.00'

    def get_reward_unit_from_this_referral(self, obj: Referral) -> str:
        if obj.referral_type == ReferralType.HOST_TO_HOST:
            return "Taka"
        elif obj.referral_type == ReferralType.GUEST_TO_GUEST:
            return "Points"
        return ""


class ReferralRewardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True, fields=['id', 'username', 'full_name'])
    # booking = MinimalBookingSerializer(read_only=True) # Example if you have a booking serializer
    booking_id = serializers.PrimaryKeyRelatedField(read_only=True, source='booking.id', allow_null=True)
    referral_type = serializers.CharField(source='referral.get_referral_type_display', read_only=True)
    reward_interpretation = serializers.SerializerMethodField() # To clarify if amount is points or Taka
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    claimed_coupon_code = serializers.CharField(source='claimed_coupon.code', read_only=True, allow_null=True)

    class Meta:
        model = ReferralReward
        fields = (
            'id',
            'referral', # ID of the referral object
            'referral_type',
            'user',
            'booking_id', # ID of the booking
            'amount',
            'reward_interpretation',
            'status',
            'status_display',
            'claimed_coupon_code',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields

    def get_reward_interpretation(self, obj):
        if obj.referral.referral_type == ReferralType.HOST_TO_HOST:
            return f"{obj.amount} Taka (Commission)"
        elif obj.referral.referral_type == ReferralType.GUEST_TO_GUEST:
            # Assuming 'amount' field stores points for guest referrers
            return f"{int(obj.amount)} Points"
        return str(obj.amount)


class CouponSerializer(serializers.ModelSerializer):
    claimed_by = UserSerializer(read_only=True, fields=['id', 'username', 'full_name'])
    used_by = UserSerializer(read_only=True, fields=['id', 'username', 'full_name'], allow_null=True)
    # used_on_booking = MinimalBookingSerializer(read_only=True) # Example
    used_on_booking_id = serializers.PrimaryKeyRelatedField(read_only=True, source='used_on_booking.id', allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Coupon
        fields = (
            'id',
            'code',
            'claimed_by',
            'amount', # This is always Taka
            'status',
            'status_display',
            'used_by',
            'used_on_booking_id',
            'used_at',
            # 'expires_at', # If you implement expiry
            'created_at',
            'updated_at',
        )
        read_only_fields = fields
        ref_name = "ReferralAppCouponSerializer" # To avoid potential name clashes if Coupon is used elsewhere


class CreditBalanceSerializer(serializers.Serializer): # For Host Commission Balance
    total_available_credit = serializers.DecimalField(max_digits=12, decimal_places=2)
    can_claim_coupon = serializers.BooleanField()
    minimum_claim_amount = serializers.DecimalField(max_digits=10, decimal_places=2) # Min balance needed to claim *a* coupon
    # coupon_value_on_claim = serializers.DecimalField(max_digits=10, decimal_places=2) # This is set in view based on HOST_COUPON_VALUE_ON_CLAIM

class GuestPointsBalanceSerializer(serializers.Serializer): # For Guest Points Balance
    current_points = serializers.IntegerField()
    points_needed_for_coupon = serializers.IntegerField()
    can_claim_coupon = serializers.BooleanField()
    coupon_value_on_claim = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Value in Taka of the coupon generated from points.")
