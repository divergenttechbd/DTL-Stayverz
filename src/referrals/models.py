import uuid
from django.db import models
from django.conf import settings
from django.db.models import Sum, F
from django.core.validators import MinValueValidator
from decimal import Decimal

from django.utils import timezone


# Assuming BaseModel is in a 'base' app or similar shared location
# from base.models import BaseModel
# For this example, I'll define a simple BaseModel if you don't have one.
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Assuming UserTypeOption is defined elsewhere, e.g., base/type_choices.py
# from base.type_choices import UserTypeOption
# For this example, I'll define a simple UserTypeOption if you don't have one.
class UserTypeOption:  # Placeholder
    HOST = "host"
    GUEST = "guest"
    # ... other types if any


class ReferralStatus(models.TextChoices):
    PENDING = "pending", "Pending"  # Link generated, not yet used for signup
    SIGNED_UP = "signed_up", "Signed Up"  # Referred user signed up (relevant for Guest-to-Guest)
    HOST_ACTIVE = "host_active", "Host Active"  # Referred host signed up and is active (relevant for Host-to-Host)
    COMPLETED = "completed", "Completed"  # All rewardable actions (e.g., bookings) have occurred
    EXPIRED = "expired", "Expired"  # Optional: If referral links have an expiry


class ReferralType(models.TextChoices):
    HOST_TO_HOST = "host_to_host", "Host to Host"
    GUEST_TO_GUEST = "guest_to_guest", "Guest to Guest"


class RewardStatus(models.TextChoices):
    PENDING = "pending", "Pending"  # Reward generated but not yet available (e.g., booking not confirmed)
    CREDITED = "credited", "Credited"  # Reward is available to the user (points added or commission available)
    CLAIMED = "claimed", "Claimed"  # User has claimed this specific reward (e.g., towards a coupon)
    CANCELLED = "cancelled", "Cancelled"  # Reward cancelled (e.g. booking refunded)


class CouponStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    USED = "used", "Used"
    EXPIRED = "expired", "Expired"  # Optional: If coupons have an expiry


class Referral(BaseModel):
    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  # Keep referral record even if referrer is deleted
        null=True,
        related_name='referrals_made'
    )
    referral_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    referral_type = models.CharField(max_length=20,
                                     choices=ReferralType.choices, blank=True)  # Set by view based on referrer's u_type

    referred_user = models.OneToOneField(  # A user can only be successfully referred once
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  # Keep referral record if referred_user is deleted
        null=True,
        blank=True,
        related_name='referral_received'
    )
    status = models.CharField(max_length=20, choices=ReferralStatus.choices, default=ReferralStatus.PENDING)

    # Tracking for rewards based on referred user's actions
    rewarded_booking_count = models.PositiveIntegerField(default=0,
                                                         help_text="Number of referred user's bookings that have triggered a reward.")
    max_rewardable_bookings = models.PositiveIntegerField(default=3,
                                                          help_text="Maximum number of bookings by referred user that will trigger rewards for the referrer.")

    # suggested_email = models.EmailField(blank=True, null=True) # Optional if suggesting specific individuals

    class Meta:
        verbose_name = "Referral"
        verbose_name_plural = "Referrals"
        # A referrer can have multiple PENDING referral links of different types,
        # but once a referred_user is set, that (referrer, referred_user) pair should be unique if you want that constraint.
        # The OneToOneField on referred_user ensures a user is only 'referred_received' once.
        # unique_together = (('referrer', 'referred_user'),) # Consider if 'referred_user' can be null initially

    def __str__(self):
        referrer_username = self.referrer.username if self.referrer else "N/A"
        referred_username = self.referred_user.username if self.referred_user else "Pending User"
        return f"{self.get_referral_type_display()} by {referrer_username} for {referred_username} ({self.status})"

    @property
    def is_active_for_rewards(self):
        """Checks if this referral can still generate rewards."""
        if self.status in [ReferralStatus.SIGNED_UP, ReferralStatus.HOST_ACTIVE]:
            return self.rewarded_booking_count < self.max_rewardable_bookings
        return False


class ReferralReward(BaseModel):
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='rewards')
    user = models.ForeignKey(  # The user who receives this reward (either referrer or new host)
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='referral_rewards_earned'
    )
    # 'bookings.Booking' needs to be a real model path in your project
    booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='triggered_referral_rewards',
                                help_text="The booking that triggered this reward.")

    # For Host-to-Host, this is Taka. For Guest-to-Guest (referrer portion), this is points.
    # This might be confusing. Consider splitting into two models or adding a 'reward_unit' field.
    # For now, we rely on referral.referral_type to interpret this amount.
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])

    status = models.CharField(max_length=20, choices=RewardStatus.choices, default=RewardStatus.CREDITED)

    # Link to the coupon if these reward credits/points were used to claim one
    claimed_coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='rewards_claimed_with')

    class Meta:
        verbose_name = "Referral Reward"
        verbose_name_plural = "Referral Rewards"
        ordering = ['-created_at']

    def __str__(self):
        reward_type_info = "Commission" if self.referral.referral_type == ReferralType.HOST_TO_HOST else "Points"
        return f"{reward_type_info} of {self.amount} for {self.user.username} ({self.status})"


class Coupon(BaseModel):
    code = models.CharField(max_length=50, unique=True, db_index=True)  # Human-friendly codes generated
    claimed_by = models.ForeignKey(  # The user who generated this coupon from their rewards/points
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='claimed_coupons'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Discount value of the coupon in Taka.")
    status = models.CharField(max_length=20, choices=CouponStatus.choices, default=CouponStatus.ACTIVE)

    # Tracking usage
    used_by = models.ForeignKey(  # Any user who redeems this coupon
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='used_coupons'
    )
    # 'bookings.Booking' needs to be a real model path
    used_on_booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True,
                                        related_name='applied_coupons')
    used_at = models.DateTimeField(null=True, blank=True)

    # expires_at = models.DateTimeField(null=True, blank=True) # Optional: Coupon expiry date

    class Meta:
        verbose_name = "Coupon"
        verbose_name_plural = "Coupons"
        ordering = ['-created_at']

    def __str__(self):
        return f"Coupon {self.code} - {self.amount} Taka ({self.status})"

    @staticmethod
    def generate_code():
        # A simple unique code generator. Consider using libraries like shortuuid for more robust codes.
        return str(uuid.uuid4()).replace('-', '')[:12].upper()  # Example: 12 char uppercase

    def mark_as_used(self, user, booking):
        """Marks the coupon as used."""
        if self.status == CouponStatus.ACTIVE:
            self.used_by = user
            self.used_on_booking = booking
            self.used_at = timezone.now()  # Ensure timezone is imported from django.utils
            self.status = CouponStatus.USED
            self.save(update_fields=['used_by', 'used_on_booking', 'used_at', 'status', 'updated_at'])
            return True
        return False

# --- User Model modification (IMPORTANT: This needs to be in your accounts/models.py) ---
# from django.contrib.auth.models import AbstractUser
# class User(AbstractUser, BaseModel): # Assuming your User model
#     # ... other existing fields ...
#     points_balance = models.PositiveIntegerField(default=0, help_text="Points earned by guest users for spending and referrals.")
#     u_type = models.CharField(max_length=15, choices=UserTypeOption.choices) # Ensure this exists
#     # ...
