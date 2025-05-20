# referrals/views.py
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Sum, Q, F  # Added F
from django.db.models.functions import Coalesce
from django.utils import timezone
from decimal import Decimal
from django.conf import settings

from rest_framework import generics, views, status, serializers
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
User = get_user_model()
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
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Host"]

    @swagger_auto_schema(
        operation_description="Shows the host's current available referral credit balance (from Host-to-Host referrals) and whether they can claim a coupon.",
        responses={200: CreditBalanceSerializer()}
    )
    def get(self, request, *args, **kwargs):
        user = request.user  # The user object from authentication middleware
        if user.u_type != UserTypeOption.HOST:
            return Response({"message": "This endpoint is for host users."}, status=status.HTTP_403_FORBIDDEN)

        # Read directly from the User model's balance field
        # No need to re-fetch 'user' unless there's a strong reason for concurrent updates within the same request lifecycle part
        available_credit = getattr(user, 'host_referral_credit_balance', Decimal('0.00'))

        # A host can claim if their balance is >= the value of ONE coupon
        can_claim = available_credit >= HOST_COUPON_VALUE_ON_CLAIM

        serializer_data = {
            'total_available_credit': available_credit.quantize(Decimal('0.01')),
            'can_claim_coupon': can_claim,
            'minimum_claim_amount': HOST_COUPON_VALUE_ON_CLAIM  # Min amount needed for *one* coupon
        }
        # CreditBalanceSerializer might need 'coupon_value_on_claim' if it's part of its definition
        # For now, minimum_claim_amount reflects the value of one coupon.

        serializer = CreditBalanceSerializer(data=serializer_data)
        serializer.is_valid()  # This is for input validation, not strictly needed for output-only construction
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClaimHostCommissionCouponAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Host"]

    @swagger_auto_schema(
        operation_description=f"Allows a host to claim ONE {HOST_COUPON_VALUE_ON_CLAIM} Taka coupon by 'spending' that amount from their available host referral credit. No request body needed.",
        responses={
            201: CouponSerializer(),
            400: "Insufficient balance or error during claim."
        }
    )
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # It's critical to get the LATEST state of the user from the DB within a transaction
        # to avoid race conditions with their balance.
        user = User.objects.select_for_update().get(pk=request.user.pk)

        if user.u_type != UserTypeOption.HOST:
            return Response({"message": "This action is for host users."}, status=status.HTTP_403_FORBIDDEN)

        current_balance = getattr(user, 'host_referral_credit_balance', Decimal('0.00'))

        if current_balance < HOST_COUPON_VALUE_ON_CLAIM:
            return Response(
                {
                    "message": f"Insufficient balance. You need {HOST_COUPON_VALUE_ON_CLAIM} Taka to claim a coupon. You currently have {current_balance} Taka."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Decrement user's balance atomically
        # user.host_referral_credit_balance -= HOST_COUPON_VALUE_ON_CLAIM
        # user.save(update_fields=['host_referral_credit_balance', 'updated_at'])
        # More robust atomic update:
        updated_rows = User.objects.filter(pk=user.pk,
                                           host_referral_credit_balance__gte=HOST_COUPON_VALUE_ON_CLAIM).update(
            host_referral_credit_balance=F('host_referral_credit_balance') - HOST_COUPON_VALUE_ON_CLAIM
        )

        if updated_rows == 0:
            raise serializers.ValidationError(
                "Failed to update balance, possibly due to a concurrent claim. Please try again.")

        # 2. Create the new Coupon object
        new_code = Coupon.generate_code()
        while Coupon.objects.filter(code=new_code).exists():
            new_code = Coupon.generate_code()

        coupon = Coupon.objects.create(
            code=new_code,
            claimed_by=user,  # The original request.user or the fetched user object
            amount=HOST_COUPON_VALUE_ON_CLAIM,
            status=CouponStatus.ACTIVE
        )

        # 3. [AUDIT STEP] Mark underlying ReferralReward records as CLAIMED.
        # This step is for bookkeeping to show where the credited balance originated from.
        # It needs to "account for" HOST_COUPON_VALUE_ON_CLAIM.
        amount_to_account_for_in_rewards = HOST_COUPON_VALUE_ON_CLAIM

        # Get oldest 'CREDITED' rewards. The status might be different if you changed it in the signal
        # (e.g., if you used 'LOGGED' instead of 'CREDITED' because the balance is now on User).
        # Assuming they are still 'CREDITED' until this accounting step.
        rewards_to_mark = ReferralReward.objects.filter(
            user=user,  # Rewards earned by this user
            status=RewardStatus.CREDITED,  # That haven't been accounted for yet
            referral__referral_type=ReferralType.HOST_TO_HOST
        ).order_by('created_at')

        rewards_marked_pks = []
        for reward_item in rewards_to_mark:
            if amount_to_account_for_in_rewards <= Decimal('0.00'):
                break

            # How much of this reward_item's amount can be used to account for this coupon's value
            value_from_this_item_to_account = min(reward_item.amount, amount_to_account_for_in_rewards)

            # For simplicity, mark the entire reward_item as CLAIMED if it's touched.
            # If reward_item.amount > value_from_this_item_to_account, it means this reward item
            # had more value than needed to finish accounting for *this specific coupon*.
            # The remaining "unaccounted" part of this reward_item will be picked up by the next coupon claim's accounting.
            # This is fine as long as the USER's balance (`host_referral_credit_balance`) is the source of truth.
            reward_item.status = RewardStatus.CLAIMED
            reward_item.claimed_coupon = coupon  # Link to the coupon being generated
            reward_item.save(update_fields=['status', 'claimed_coupon', 'updated_at'])

            amount_to_account_for_in_rewards -= reward_item.amount  # Reduce by the full amount of this item
            rewards_marked_pks.append(reward_item.pk)

        if not rewards_marked_pks and HOST_COUPON_VALUE_ON_CLAIM > Decimal('0.00'):
            # This is unusual if the balance update succeeded, means no source rewards were found or marked.
            # Could log a warning. Doesn't necessarily invalidate the coupon if balance was debited.
            print(
                f"Warning: Coupon {coupon.code} created and balance debited for user {user.username}, but no source ReferralReward records were marked as CLAIMED for audit.")

        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
# class MyCouponsListAPIView(generics.ListAPIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = CouponSerializer
#     swagger_tags = ["Referrals - General"] # Or "Referrals - Host" if only for host claimed coupons
#
#     @swagger_auto_schema(operation_description="Lists all coupons (from host commissions or guest points) claimed by the logged-in user.")
#     def get_queryset(self):
#         # This will list ALL coupons claimed by the user, whether from host commissions or guest points.
#         # If you want to separate them, you might need to filter based on how the coupon was generated,
#         # though the Coupon model itself doesn't directly store "source_type (points/commission)".
#         # The `claimed_by` user's u_type could be an indirect indicator if hosts only claim commission coupons
#         # and guests only claim point coupons.
#         return Coupon.objects.filter(claimed_by=self.request.user).select_related('used_by', 'used_on_booking').order_by('-created_at')
# --- Views for Guest Referral System (Points based) ---

class MyGuestPointsBalanceAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Guest"]

    @swagger_auto_schema(
        operation_description="Shows the guest's current points balance and whether they can claim a coupon.",
        responses={200: GuestPointsBalanceSerializer()}
    )
    def get(self, request, *args, **kwargs):
        user = request.user  # User from auth middleware
        if user.u_type != UserTypeOption.GUEST:
            return Response({"message": "This endpoint is for guest users."}, status=status.HTTP_403_FORBIDDEN)

        current_points = getattr(user, 'points_balance', 0)
        can_claim = current_points >= GUEST_POINTS_FOR_COUPON_CLAIM

        serializer_data = {
            'current_points': current_points,
            'points_needed_for_coupon': GUEST_POINTS_FOR_COUPON_CLAIM,
            'can_claim_coupon': can_claim,
            'coupon_value_on_claim': GUEST_COUPON_VALUE_ON_CLAIM.quantize(Decimal('0.01'))
        }
        serializer = GuestPointsBalanceSerializer(data=serializer_data)
        serializer.is_valid()  # For output-only data, validation isn't strictly necessary but harmless
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClaimGuestPointsCouponAPIView(views.APIView):
    permission_classes = (IsAuthenticated,)
    swagger_tags = ["Referrals - Guest"]

    @swagger_auto_schema(
        operation_description=f"Allows a guest to claim ONE {GUEST_COUPON_VALUE_ON_CLAIM} Taka coupon if they have at least {GUEST_POINTS_FOR_COUPON_CLAIM} points. No request body needed.",
        responses={
            201: CouponSerializer(),
            400: "Insufficient points or error."
        }
    )
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Fetch user with a lock to prevent race conditions on points_balance
        user = User.objects.select_for_update().get(pk=request.user.pk)

        if user.u_type != UserTypeOption.GUEST:
            return Response({"message": "This action is for guest users."}, status=status.HTTP_403_FORBIDDEN)

        current_points = getattr(user, 'points_balance', 0)

        if current_points < GUEST_POINTS_FOR_COUPON_CLAIM:
            return Response(
                {
                    "message": f"Insufficient points. You need {GUEST_POINTS_FOR_COUPON_CLAIM} points to claim a coupon. You currently have {current_points} points."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Atomically deduct points.
        # The F() expression itself is atomic for the row being updated.
        # The select_for_update() ensures that we are operating on the latest version of the row
        # and other transactions trying to update this user's points_balance will wait.

        # user.points_balance -= GUEST_POINTS_FOR_COUPON_CLAIM # This modifies the in-memory object
        # user.save(update_fields=['points_balance', 'updated_at'])
        # Alternative: Direct conditional update (even safer against certain race conditions if select_for_update wasn't used)
        updated_rows = User.objects.filter(
            pk=user.pk,
            points_balance__gte=GUEST_POINTS_FOR_COUPON_CLAIM
            # Ensure balance hasn't dipped below threshold due to concurrency
        ).update(
            points_balance=F('points_balance') - GUEST_POINTS_FOR_COUPON_CLAIM
        )

        if updated_rows == 0:
            # This could happen if:
            # 1. The points_balance was < GUEST_POINTS_FOR_COUPON_CLAIM when the UPDATE query ran (a race condition that select_for_update aims to prevent).
            # 2. The user.pk somehow didn't match (highly unlikely).
            # With select_for_update, this path is less likely for race conditions on points_balance.
            # However, keeping the check is good practice.
            return Response(
                {
                    "message": "Failed to claim coupon. Points balance might have changed concurrently. Please try again."},
                status=status.HTTP_409_CONFLICT  # 409 Conflict is appropriate for concurrent modification issues
            )

        # 2. Create coupon
        new_code = Coupon.generate_code()
        while Coupon.objects.filter(code=new_code).exists():  # Ensure unique code
            new_code = Coupon.generate_code()

        coupon = Coupon.objects.create(
            code=new_code,
            claimed_by=user,  # Use the locked user object
            amount=GUEST_COUPON_VALUE_ON_CLAIM,
            status=CouponStatus.ACTIVE
        )

        # Optional: Create a PointTransaction log if you have such a model.
        # This log would be distinct from ReferralReward, which tracks how referral points were *earned*.
        # A PointTransaction could track how points were *spent*.
        # E.g., PointTransaction.objects.create(user=user, points_change=-GUEST_POINTS_FOR_COUPON_CLAIM, reason="Coupon Claimed", related_coupon=coupon)

        # No need to mark ReferralReward records here because points are on User.points_balance.
        # ReferralReward records (for guest referrers) show how points were *earned*, not how they were spent.

        serializer = CouponSerializer(coupon)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
