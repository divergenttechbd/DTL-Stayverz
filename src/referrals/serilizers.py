import django_filters
from django.db.models.functions import Coalesce
from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal
from django.conf import settings

from accounts.models import User
from bookings.models import Booking
from listings.models import Listing
from .models import Referral, ReferralReward, Coupon, RewardStatus, ReferralType, CouponStatus, UserTypeOption


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

#
class UserBriefSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True, source='get_full_name', allow_null=True)
    u_type = serializers.CharField(read_only=True)
    image = serializers.URLField(read_only=True, allow_null=True)



# ---------------------------------


class BasicUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField(method_name='get_user_image_url')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'u_type', 'image_url')

    def get_full_name(self, obj: User) -> str:
        # AbstractUser provides get_full_name(), first_name, last_name
        name_from_method = obj.get_full_name()
        if name_from_method and name_from_method.strip() and name_from_method != obj.email:
            return name_from_method
        if obj.first_name or obj.last_name:  # These are direct fields on User
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username

    def get_user_image_url(self, obj: User):
        # User model has 'image' URLField directly
        if obj.image:  # This is obj.image from User model
            request = self.context.get('request')
            if request:
                try:
                    # If obj.image might be relative
                    return request.build_absolute_uri(obj.image)
                except ValueError:  # If obj.image is already absolute
                    return obj.image
            return obj.image  # Fallback if no request context
        return None



class MinimalListingSerializer(serializers.ModelSerializer): # Renamed for clarity
    host_username = serializers.CharField(source='host.username', read_only=True, allow_null=True)

    class Meta:
        model = Listing # Directly use your Listing model
        fields = (
            'id',
            'unique_id', # A good unique identifier for listings
            'title',
            'cover_photo',
            'host_username', # To show who owns the listing
            'address',
            'city',
            'area',
        )

# -------------------------
class MinimalPropertySerializer(serializers.ModelSerializer):  # If Property has a name
    class Meta:
        # Replace 'Property' with your actual Property model name
        # from properties.models import Property # Example import
        model = None  # Placeholder - YOU MUST REPLACE THIS WITH YOUR ACTUAL PROPERTY MODEL
        fields = ('id', 'name')  # Example: Property name

    def __init__(self, *args, **kwargs):
        # This is a simple way to handle if the model isn't set, to avoid import errors
        # during initial setup if Property model is in another app not yet fully loaded.
        # In a real setup, ensure your Property model is correctly imported and set.
        if self.Meta.model is None:
            try:
                from properties.models import Property  # Adjust import path
                self.Meta.model = Property
            except ImportError:
                # Log or print a warning that Property model couldn't be imported
                print(
                    "Warning: Property model for MinimalPropertySerializer not found. Booking property details will be limited.")
        super().__init__(*args, **kwargs)


class MinimalBookingSerializer(serializers.ModelSerializer):
    listing_details = MinimalListingSerializer(source='listing', read_only=True, allow_null=True) # Use source='listing'
    guest_username = serializers.CharField(source='guest.username', read_only=True, allow_null=True)

    class Meta:
        model = Booking # Directly use your Booking model
        fields = (
            'id',
            'invoice_no', # A good unique ID for bookings
            'check_in',   # Changed from check_in_date
            'check_out',  # Changed from check_out_date
            'total_price',# Changed from total_amount
            'status',     # Booking status
            'guest_username',
            'listing_details',
        )

    def __init__(self, *args, **kwargs):
        if self.Meta.model is None:
            try:
                from bookings.models import Booking  # Adjust import path for your Booking model
                self.Meta.model = Booking
            except ImportError:
                print("Warning: Booking model for MinimalBookingSerializer not found. Booking details will be limited.")
        super().__init__(*args, **kwargs)



class AdminReferredUserSerializer(BasicUserSerializer):
    class Meta(BasicUserSerializer.Meta):
        fields = ('id', 'username', 'full_name', 'u_type', 'image_url')


class AdminReferralRewardDetailSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    claimed_coupon_code = serializers.CharField(source='claimed_coupon.code', read_only=True, allow_null=True)
    reward_interpretation = serializers.SerializerMethodField()
    booking_pk = serializers.IntegerField(source='booking.pk', read_only=True, allow_null=True)
    reward_recipient = BasicUserSerializer(source='user', read_only=True)

    booking_details = MinimalBookingSerializer(source='booking', read_only=True, allow_null=True)

    class Meta:
        model = ReferralReward
        fields = (
            'id',
            'reward_recipient',
            'amount',
            'reward_interpretation',
            'status',
            'status_display',
            'booking_pk',
            'booking_details',
            'claimed_coupon_code',
            'created_at'
        )

    def get_reward_interpretation(self, obj: ReferralReward):
        if obj.referral.referral_type == ReferralType.HOST_TO_HOST:
            return f"{obj.amount} Taka (Commission)"
        elif obj.referral.referral_type == ReferralType.GUEST_TO_GUEST:
            return f"{int(obj.amount)} Points" # Assuming points are stored in 'amount'
        return str(obj.amount)

class AdminReferralInstanceDetailSerializer(serializers.ModelSerializer):
    referred_user_details = AdminReferredUserSerializer(source='referred_user', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    referral_type_display = serializers.CharField(source='get_referral_type_display', read_only=True)
    # 'rewards' is the related_name from ReferralReward.referral back to Referral
    rewards_associated = AdminReferralRewardDetailSerializer(many=True, source='rewards', read_only=True)

    class Meta:
        model = Referral
        fields = (
            'id',
            'referral_code',
            'referral_type',
            'referral_type_display',
            'status',
            'status_display',
            'referred_user_details',
            'rewarded_booking_count',
            'max_rewardable_bookings',
            'is_active_for_rewards', # Property from model
            'rewards_associated',
            'created_at',
        )

# Serializer for the list view (AdminReferrerReportListView)
class AdminReferrerSummarySerializer(BasicUserSerializer):
    total_host_referrals_made = serializers.IntegerField(read_only=True, default=0)
    total_host_referrals_successful = serializers.IntegerField(read_only=True, default=0)
    total_host_referral_earnings = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=Decimal('0.00'))

    total_guest_referrals_made = serializers.IntegerField(read_only=True, default=0)
    total_guest_referrals_successful = serializers.IntegerField(read_only=True, default=0)
    total_guest_referral_points = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=Decimal('0.00'))

    class Meta(BasicUserSerializer.Meta):
        fields = BasicUserSerializer.Meta.fields + (
            'total_host_referrals_made',
            'total_host_referrals_successful',
            'total_host_referral_earnings',
            'total_guest_referrals_made',
            'total_guest_referrals_successful',
            'total_guest_referral_points'
        )

# Serializer for the detail view (AdminReferrerDetailReportView)
class AdminReferrerFullDetailSerializer(BasicUserSerializer):
    # Aggregated earnings/points for this specific user
    summary_total_host_referral_earnings = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, source='annotated_total_host_earnings')
    summary_total_guest_referral_points = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, source='annotated_total_guest_points')

    # Detailed list of referrals made by this user
    # 'referrals_made' is the related_name from Referral.referrer back to User
    referral_links_details = AdminReferralInstanceDetailSerializer(many=True, read_only=True, source='referrals_made')

    class Meta(BasicUserSerializer.Meta):
        fields = BasicUserSerializer.Meta.fields + (
            'summary_total_host_referral_earnings',
            'summary_total_guest_referral_points',
            'referral_links_details',
        )


# --- Admin Report Filters ---

class AdminReferrerFilter(django_filters.FilterSet):
    referral_type = django_filters.ChoiceFilter(
        choices=ReferralType.choices,
        method='filter_by_referral_type',
        label='Referral Type (Filters users who made this type of referral)'
    )
    username = django_filters.CharFilter(field_name='username', lookup_expr='icontains', label='Referrer Username')
    email = django_filters.CharFilter(field_name='email', lookup_expr='icontains', label='Referrer Email')


    class Meta:
        model = User
        fields = ['username', 'email', 'referral_type', 'u_type'] # Added u_type for direct filtering

    def filter_by_referral_type(self, queryset, name, value):
        if value:
            return queryset.filter(referrals_made__referral_type=value).distinct()
        return queryset



