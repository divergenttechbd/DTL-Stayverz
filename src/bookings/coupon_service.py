# bookings/coupon_service.py
from decimal import Decimal, InvalidOperation
from referrals.models import Coupon as ReferralCoupon, CouponStatus as ReferralCouponStatus
from coupons.models import Coupon as AdminCoupon  # Your admin coupon model


def validate_and_get_coupon_discount_info(coupon_code_input: str, order_total: Decimal, booking_user) -> dict:

    result = {
        'is_valid': False,
        'message': 'Invalid coupon code.',
        'discount_amount': Decimal('0.00'),
        'final_price': order_total,
        'coupon_type': None,  # 'referral' or 'admin'
        'coupon_object': None,  # The actual coupon instance
    }

    if not coupon_code_input:
        result['message'] = "Coupon code cannot be empty."
        return result

    code = coupon_code_input.strip().upper()

    # 1. Try Referral Coupon
    try:
        ref_coupon = ReferralCoupon.objects.get(code=code)
        if ref_coupon.status == ReferralCouponStatus.ACTIVE:
            discount = min(ref_coupon.amount, order_total)  # Discount cannot exceed order_total
            result['is_valid'] = True
            result['message'] = f"Referral coupon '{code}' applied."
            result['discount_amount'] = discount.quantize(Decimal('0.01'))
            result['final_price'] = (order_total - discount).quantize(Decimal('0.01'))
            result['coupon_type'] = 'referral'
            result['coupon_object'] = ref_coupon
            return result
        else:
            # Found referral coupon but it's not active (e.g., already USED)
            # Continue to check admin coupons, or return specific message like "Referral coupon already used."
            # For now, let's assume we try admin if referral not active.
            pass  # result['message'] will be updated by admin check if it also fails

    except ReferralCoupon.DoesNotExist:
        pass  # Not a referral coupon, try admin coupon next

    # 2. Try Admin Coupon
    try:
        admin_coupon = AdminCoupon.objects.get(code=code)
        is_admin_coupon_valid, validation_message = admin_coupon.is_valid(order_amount=order_total)

        if is_admin_coupon_valid:
            _final_price, discount = admin_coupon.apply_discount(order_total)
            result['is_valid'] = True
            result['message'] = f"Admin coupon '{code}' applied."
            result['discount_amount'] = discount.quantize(Decimal('0.01'))
            result['final_price'] = _final_price.quantize(Decimal('0.01'))
            result['coupon_type'] = 'admin'
            result['coupon_object'] = admin_coupon
            return result
        else:
            result['message'] = validation_message  # Use validation message from admin_coupon.is_valid()
            return result

    except AdminCoupon.DoesNotExist:
        result['message'] = f"Coupon code '{code}' not found."  # If not found in either table
        return result

    return result  # Should have returned earlier
