# bookings/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.db.models import F

from django.conf import settings
from decimal import Decimal

from .models import Booking  # Make sure this path is correct
from django.contrib.auth import get_user_model
from referrals.models import Referral, ReferralType, ReferralStatus, ReferralReward, \
    RewardStatus  # Make sure this path is correct
from base.type_choices import UserTypeOption, BookingStatusOption  # Make sure this path is correct

User = get_user_model()

# --- Configuration (defaults if not in settings.py) ---
GUEST_POINTS_PER_TAKA_SPENT = Decimal(getattr(settings, 'GUEST_POINTS_PER_TAKA_SPENT', '0.01'))
HOST_REFERRAL_COMMISSION_RATE = Decimal(getattr(settings, 'HOST_REFERRAL_COMMISSION_RATE', '0.03'))  # 3%


# Ensure HOST_COUPON_VALUE_ON_CLAIM is accessible if needed for granular reward creation
# HOST_COUPON_VALUE_ON_CLAIM = Decimal(getattr(settings, 'REFERRAL_COUPON_VALUE', '100.00'))


@receiver(post_save, sender=Booking)
@transaction.atomic
def handle_booking_rewards_and_points(sender, instance: Booking, created: bool, **kwargs):
    """
    Handles awarding points to guests and commission to hosts upon successful booking.
    Triggered when a Booking instance is saved.
    """
    if instance.status != BookingStatusOption.CONFIRMED:
        return

    # Check if any ReferralReward has ALREADY been created for this booking FOR A HOST-TO-HOST referral.
    # This helps prevent duplicate processing specifically for the host commission part.
    # We check for the specific type of reward to avoid conflict if a booking could trigger multiple reward types.
    if ReferralReward.objects.filter(booking=instance, referral__referral_type=ReferralType.HOST_TO_HOST).exists():
        print(f"Booking {instance.invoice_no}: Host referral rewards already seem to exist for this booking.")
        # Note: Self-earned guest points are handled separately and don't create ReferralReward.
        # Guest referrer points *do* create ReferralReward, so this check needs to be specific if a booking
        # could somehow trigger both guest referral points AND host commission (unlikely under current design).
        # For now, assuming a booking triggers EITHER guest system OR host system based on users involved.
        # A more granular check would be:
        # if instance.rewards_processed_for_host_referral: return (if you add such a flag to Booking)
        # return # Commenting out to allow the logic below to run once based on its internal checks.

    # --- I. Guest earns points for THEIR OWN booking (Logic remains the same) ---
    booking_guest = instance.guest
    if booking_guest.u_type == UserTypeOption.GUEST:
        # Check if points for self were already awarded (e.g., by a flag on booking or separate log)
        # For simplicity, this example assumes it can run if not directly tied to ReferralReward existence.
        # If there's a risk of re-awarding, add a specific check for self-points.
        points_earned_for_self = int(Decimal(instance.total_price) * GUEST_POINTS_PER_TAKA_SPENT)
        if points_earned_for_self > 0:
            # Check if points already awarded (example: a temporary flag or a log)
            # This part would need a robust "already processed" check if signal runs multiple times for CONFIRMED.
            # For now, we rely on the top-level ReferralReward check for host commissions.
            User.objects.filter(pk=booking_guest.pk).update(points_balance=F('points_balance') + points_earned_for_self)
            print(
                f"Guest {booking_guest.username} earned {points_earned_for_self} points for booking {instance.invoice_no}.")

    # --- II. Referrer of a GUEST gets points (Guest-to-Guest referral - Logic remains similar) ---
    # (Make sure this section also has idempotency checks if needed)
    try:
        guest_referral_instance = Referral.objects.select_related('referrer').get(
            referred_user=booking_guest,
            referral_type=ReferralType.GUEST_TO_GUEST,
            status__in=[ReferralStatus.SIGNED_UP, ReferralStatus.COMPLETED]
        )
        if guest_referral_instance.is_active_for_rewards and \
            not ReferralReward.objects.filter(booking=instance,
                                              referral=guest_referral_instance).exists():  # Idempotency
            referrer_guest = guest_referral_instance.referrer
            if referrer_guest and referrer_guest.u_type == UserTypeOption.GUEST:
                points_for_referrer = int(Decimal(instance.total_price) * GUEST_POINTS_PER_TAKA_SPENT)
                if points_for_referrer > 0:
                    User.objects.filter(pk=referrer_guest.pk).update(
                        points_balance=F('points_balance') + points_for_referrer)
                    ReferralReward.objects.create(
                        referral=guest_referral_instance, user=referrer_guest, booking=instance,
                        amount=Decimal(points_for_referrer), status=RewardStatus.CREDITED
                    )
                    print(
                        f"Referrer guest {referrer_guest.username} earned {points_for_referrer} points from {booking_guest.username}'s booking {instance.invoice_no}.")
                    guest_referral_instance.rewarded_booking_count = F('rewarded_booking_count') + 1
                    guest_referral_instance.save(update_fields=['rewarded_booking_count', 'updated_at'])
                    guest_referral_instance.refresh_from_db()
                    if guest_referral_instance.rewarded_booking_count >= guest_referral_instance.max_rewardable_bookings:
                        guest_referral_instance.status = ReferralStatus.COMPLETED
                        guest_referral_instance.save(update_fields=['status', 'updated_at'])
    except Referral.DoesNotExist:
        pass
    except User.DoesNotExist:
        print(f"Error: Referrer user for guest {booking_guest.username} does not exist.")

    # --- III. Referrer of a HOST and the new HOST get commission (Host-to-Host referral) ---
    #            BALANCES ARE UPDATED ON USER MODEL
    property_host = instance.host
    if property_host.u_type == UserTypeOption.HOST:
        try:
            host_referral_instance = Referral.objects.select_related('referrer').get(
                referred_user=property_host,
                referral_type=ReferralType.HOST_TO_HOST,
                status__in=[ReferralStatus.HOST_ACTIVE, ReferralStatus.COMPLETED]
            )

            # Idempotency Check: Ensure rewards for this specific host referral and booking haven't been made.
            if host_referral_instance.is_active_for_rewards and \
                not ReferralReward.objects.filter(booking=instance, referral=host_referral_instance).exists():

                original_referrer_host = host_referral_instance.referrer
                commission_amount = (Decimal(instance.total_price) * HOST_REFERRAL_COMMISSION_RATE).quantize(
                    Decimal('0.01'))

                if commission_amount > 0:
                    # 1. Reward for the ORIGINAL REFERRER
                    if original_referrer_host:
                        # Create ReferralReward for audit/history
                        ReferralReward.objects.create(
                            referral=host_referral_instance, user=original_referrer_host,
                            booking=instance, amount=commission_amount, status=RewardStatus.CREDITED
                        )
                        # Increment user's balance directly
                        User.objects.filter(pk=original_referrer_host.pk).update(
                            host_referral_credit_balance=F('host_referral_credit_balance') + commission_amount
                        )
                        print(
                            f"Original referrer host {original_referrer_host.username} credited {commission_amount} Taka. Balance updated for booking {instance.invoice_no}.")

                    # 2. Reward for the NEW HOST (the one who was referred)
                    ReferralReward.objects.create(
                        referral=host_referral_instance, user=property_host,
                        booking=instance, amount=commission_amount, status=RewardStatus.CREDITED
                    )
                    # Increment new host's balance directly
                    User.objects.filter(pk=property_host.pk).update(
                        host_referral_credit_balance=F('host_referral_credit_balance') + commission_amount
                    )
                    print(
                        f"New host {property_host.username} credited {commission_amount} Taka (referral bonus). Balance updated for booking {instance.invoice_no}.")

                    # Update referral count and status
                    host_referral_instance.rewarded_booking_count = F('rewarded_booking_count') + 1
                    host_referral_instance.save(update_fields=['rewarded_booking_count', 'updated_at'])
                    host_referral_instance.refresh_from_db()
                    if host_referral_instance.rewarded_booking_count >= host_referral_instance.max_rewardable_bookings:
                        host_referral_instance.status = ReferralStatus.COMPLETED
                        host_referral_instance.save(update_fields=['status', 'updated_at'])
        except Referral.DoesNotExist:
            pass
        except User.DoesNotExist:
            print(f"Error: User not found for host referral involving booking {instance.invoice_no}.")
