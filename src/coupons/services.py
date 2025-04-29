import decimal
from typing import Dict, Any, Optional, Tuple # For type hinting
from .models import Coupon

def apply_coupon_to_order(coupon_code: str, order_total: Any) -> Dict[str, Any]:

    result = {
        'success': False,
        'message': '',
        'discount_amount': None,
        'final_price': None,
        'coupon_id': None,
    }

    if not coupon_code:
        result['message'] = "Coupon code cannot be empty."
        return result

    code = coupon_code.strip().upper()

    try:

        order_amount_decimal = decimal.Decimal(order_total)

    except (TypeError, decimal.InvalidOperation) as e:
        result['message'] = f"Invalid order total provided ({order_total})."
        return result

    try:
        coupon = Coupon.objects.get(code=code)
    except Coupon.DoesNotExist:
        result['message'] = f"Coupon code '{code}' is invalid or does not exist."
        return result

    is_coupon_valid, validation_message = coupon.is_valid(order_amount=order_amount_decimal)

    if not is_coupon_valid:
        result['message'] = validation_message
        return result # Return failure with the specific validation message

    final_price_decimal, discount_amount_decimal = coupon.apply_discount(order_amount_decimal)

    result['success'] = True
    result['message'] = "Coupon applied successfully."
    result['discount_amount'] = discount_amount_decimal
    result['final_price'] = final_price_decimal
    result['coupon_id'] = coupon.id

    return result
