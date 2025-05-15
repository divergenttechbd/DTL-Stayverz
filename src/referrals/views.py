# referrals/views.py

from django.db import transaction
from django.db.models import Sum, Q, F  # Added F
from django.db.models.functions import Coalesce
from django.utils import timezone
from decimal import Decimal
from django.conf import settings

from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi  # For swagger documentation

from .models import Referral, ReferralReward, Coupon, RewardStatus, CouponStatus, ReferralStatus, ReferralType
from .serilizers import (  # Assuming serializers.py is in the same app
    ReferralSerializer,
    ReferralRewardSerializer,
    CouponSerializer,
    CreditBalanceSerializer,
    GuestPointsBalanceSerializer  # Make sure this is defined in serializers.py
)

from base.type_choices import UserTypeOption  # Adjust import as per your project structure

# from base.permissions import IsHostUser # If you have a specific IsHostUser permission

# --- Default values if not in settings.py ---
# For Host Commission Claim
MIN_BALANCE_FOR_HOST_CLAIM = getattr(settings, 'REFERRAL_MIN_BALANCE_FOR_CLAIM', Decimal('100.00'))
HOST_COUPON_VALUE_ON_CLAIM = getattr(settings, 'REFERRAL_COUPON_VALUE', Decimal('100.00'))

# For Guest Points Claim
GUEST_POINTS_FOR_COUPON_CLAIM = getattr(settings, 'GUEST_REFERRAL_POINTS_FOR_COUPON', 100)
GUEST_COUPON_VALUE_ON_CLAIM = getattr(settings, 'GUEST_REFERRAL_COUPON_FIXED_VALUE', Decimal('100.00'))


class MyReferralLinkAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - General"]

    @swagger_auto_schema(
        operation_description="Generates or retrieves the authenticated user's unique referral link. The type of link (Host-to-Host or Guest-to-Guest) depends on the user's u_type.",
        responses={200: ReferralSerializer()}
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        referral_type_to_generate = None

        if user.u_type == UserTypeOption.HOST:
            referral_type_to_generate = ReferralType.HOST_TO_HOST
        elif user.u_type == UserTypeOption.GUEST:
            referral_type_to_generate = ReferralType.GUEST_TO_GUEST
        else:
            return Response(
                {"message": "Your user type is not eligible to generate referral links."},
                status=status.HTTP_400_BAD_REQUEST
            )

        referral, created = Referral.objects.get_or_create(
            referrer=request.user,
            referral_type=referral_type_to_generate,
            status=ReferralStatus.PENDING,  # Only find/create PENDING, unused ones
            referred_user__isnull=True,  # Ensure it's not already assigned to a referred user
            defaults={'max_rewardable_bookings': 3}  # Set default if creating new
        )
        # If not created, it means an existing PENDING link for this type was found.

        serializer = ReferralSerializer(referral, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyReferralsListAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ReferralSerializer
    swagger_tags = ["Referrals - General"]

    @swagger_auto_schema(
        operation_description="Lists all referrals (both Host-to-Host and Guest-to-Guest) initiated by the logged-in user.")
    def get_queryset(self):
        return Referral.objects.filter(referrer=self.request.user).select_related('referred_user').order_by(
            '-created_at')


class MyRewardHistoryListAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ReferralRewardSerializer
    swagger_tags = ["Referrals - General"]

    @swagger_auto_schema(
        operation_description="Lists the detailed history of all rewards (host commission credits, guest referral points) earned by the logged-in user.")
    def get_queryset(self):
        # Show all credited and claimed rewards for the user
        return ReferralReward.objects.filter(
            user=self.request.user
        ).select_related('user', 'booking', 'claimed_coupon', 'referral__referrer', 'referral__referred_user').order_by(
            '-created_at')


class MyCouponsListAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CouponSerializer
    swagger_tags = ["Referrals - General"]

    @swagger_auto_schema(
        operation_description="Lists all coupons (from host commissions or guest points) claimed by the logged-in user.")
    def get_queryset(self):
        return Coupon.objects.filter(claimed_by=self.request.user).select_related('used_by',
                                                                                  'used_on_booking').order_by(
            '-created_at')


# --- Views for Host Referral System (Commission based) ---

class MyHostRewardCreditBalanceAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)  # Add IsHostUser if you have it
    swagger_tags = ["Referrals - Host"]

    @swagger_auto_schema(
        operation_description="Shows the host's current available referral reward credit balance (from Host-to-Host referrals) and whether they can claim a coupon.",
        responses={200: CreditBalanceSerializer()}
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.u_type != UserTypeOption.HOST:
            return Response({"message": "This endpoint is for host users."}, status=status.HTTP_403_FORBIDDEN)

        available_credit = ReferralReward.objects.filter(
            user=request.user,
            status=RewardStatus.CREDITED,
            referral__referral_type=ReferralType.HOST_TO_HOST  # Only count host referral commissions
        ).aggregate(total=Coalesce(Sum('amount'), Decimal('0.00')))['total']

        can_claim = available_credit >= MIN_BALANCE_FOR_HOST_CLAIM

        serializer_data = {
            'total_available_credit': available_credit,
            'can_claim_coupon': can_claim,
            'minimum_claim_amount': MIN_BALANCE_FOR_HOST_CLAIM
        }
        serializer = CreditBalanceSerializer(data=serializer_data)
        serializer.is_valid()  # is_valid() is for deserialization, but good practice for consistency
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClaimHostCommissionCouponAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)  # Add IsHostUser if you have it
    swagger_tags = ["Referrals - Host"]

    @swagger_auto_schema(
        operation_description=f"Allows a host to claim a {HOST_COUPON_VALUE_ON_CLAIM} Taka coupon if their available host referral credit is sufficient. No request body needed.",
        responses={
            201: CouponSerializer(),
            400: "Insufficient balance or error during claim."
        }
    )
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        if user.u_type != UserTypeOption.HOST:
            return Response({"message": "This action is for host users."}, status=status.HTTP_403_FORBIDDEN)

        available_credit = ReferralReward.objects.filter(
            user=user,
            status=RewardStatus.CREDITED,
            referral__referral_type=ReferralType.HOST_TO_HOST
        ).aggregate(total=Coalesce(Sum('amount'), Decimal('0.00')))['total']

        if available_credit < MIN_BALANCE_FOR_HOST_CLAIM:
            return Response(
                {
                    "message": f"Insufficient balance. You need at least {MIN_BALANCE_FOR_HOST_CLAIM} Taka to claim a coupon. You have {available_credit} Taka."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if available_credit < HOST_COUPON_VALUE_ON_CLAIM:
            return Response(
                {
                    "message": f"You have {available_credit} Taka, which is less than the required coupon value of {HOST_COUPON_VALUE_ON_CLAIM} Taka for this claim."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the coupon first
        new_code = Coupon.generate_code()
        while Coupon.objects.filter(code=new_code).exists():
            new_code = Coupon.generate_code()

        coupon = Coupon.objects.create(
            code=new_code,
            claimed_by=user,
            amount=HOST_COUPON_VALUE_ON_CLAIM,
            status=CouponStatus.ACTIVE
        )

        amount_to_cover_for_coupon = HOST_COUPON_VALUE_ON_CLAIM
        rewards_to_mark_claimed = ReferralReward.objects.filter(
            user=user,
            status=RewardStatus.CREDITED,
            referral__referral_type=ReferralType.HOST_TO_HOST
        ).order_by('created_at')  # FIFO

        rewards_updated_pks = []

        for reward_item in rewards_to_mark_claimed:
            if amount_to_cover_for_coupon <= Decimal('0.00'):
                break

            # We will mark the entire reward item as claimed if it's used towards this coupon.
            # This assumes reward items are granular enough or it's acceptable to "overspend"
            # a small reward to complete a coupon value.
            # A more complex system would allow partial claims from a single ReferralReward.

            claim_from_this_reward = reward_item.amount  # Using the full amount of the reward item

            reward_item.status = RewardStatus.CLAIMED
            reward_item.claimed_coupon = coupon
            reward_item.save(update_fields=['status', 'claimed_coupon', 'updated_at'])

            amount_to_cover_for_coupon -= claim_from_this_reward
            rewards_updated_pks.append(reward_item.pk)

        if not rewards_updated_pks:  # Should not happen if initial balance check passed
            coupon.delete()  # Clean up the created coupon
            return Response(
                {"message": "Error processing rewards for coupon claim. No rewards were marked."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Optional: If you need to ensure the sum of marked rewards *exactly* equals coupon value,
        # you'd need more complex logic, possibly creating a "change" reward or partial claims.
        # The current logic marks full reward items until the coupon value is covered or exceeded.

        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# --- Views for Guest Referral System (Points based) ---

class MyGuestPointsBalanceAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Guest"]

    @swagger_auto_schema(
        operation_description="Shows the guest's current points balance (from Guest-to-Guest referrals and own spending) and whether they can claim a coupon.",
        responses={200: GuestPointsBalanceSerializer()}
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.u_type != UserTypeOption.GUEST:
            return Response({"message": "This endpoint is for guest users."}, status=status.HTTP_403_FORBIDDEN)

        # The 'points_balance' is directly on the User model for guests
        current_points = getattr(user, 'points_balance', 0)

        can_claim = current_points >= GUEST_POINTS_FOR_COUPON_CLAIM

        serializer_data = {
            'current_points': current_points,
            'points_needed_for_coupon': GUEST_POINTS_FOR_COUPON_CLAIM,
            'can_claim_coupon': can_claim,
            'coupon_value_on_claim': GUEST_COUPON_VALUE_ON_CLAIM
        }
        serializer = GuestPointsBalanceSerializer(data=serializer_data)
        serializer.is_valid()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClaimGuestPointsCouponAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Guest"]

    @swagger_auto_schema(
        operation_description=f"Allows a guest to claim a {GUEST_COUPON_VALUE_ON_CLAIM} Taka coupon if they have at least {GUEST_POINTS_FOR_COUPON_CLAIM} points. No request body needed.",
        responses={
            201: CouponSerializer(),
            400: "Insufficient points or error."
        }
    )
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        if user.u_type != UserTypeOption.GUEST:
            return Response({"message": "This action is for guest users."}, status=status.HTTP_403_FORBIDDEN)

        current_points = getattr(user, 'points_balance', 0)

        if current_points < GUEST_POINTS_FOR_COUPON_CLAIM:
            return Response(
                {
                    "message": f"Insufficient points. You need {GUEST_POINTS_FOR_COUPON_CLAIM} points to claim a coupon. You have {current_points} points."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct points directly from user model
        # User.objects.filter(pk=user.pk).update(points_balance=F('points_balance') - GUEST_POINTS_FOR_COUPON_CLAIM)
        # Or, more simply if you've fetched the user object:
        user.points_balance = F('points_balance') - GUEST_POINTS_FOR_COUPON_CLAIM
        user.save(
            update_fields=['points_balance', 'updated_at'])  # Ensure 'updated_at' exists on User model from BaseModel
        user.refresh_from_db()  # Get the updated points_balance

        # Create coupon
        new_code = Coupon.generate_code()
        while Coupon.objects.filter(code=new_code).exists():
            new_code = Coupon.generate_code()

        coupon = Coupon.objects.create(
            code=new_code,
            claimed_by=user,
            amount=GUEST_COUPON_VALUE_ON_CLAIM,
            status=CouponStatus.ACTIVE
        )

        # Optional: Log this point redemption if you have a separate detailed point transaction log
        # PointTransaction.objects.create(user=user, points_changed=-GUEST_POINTS_FOR_COUPON_CLAIM, reason="Coupon Claimed", related_coupon=coupon)

        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
