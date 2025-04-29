import decimal

from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.db import models

from base.models import BaseModel


class Coupon(BaseModel):
    DISCOUNT_TYPE_PERCENTAGE = 'PERCENT'
    DISCOUNT_TYPE_FIXED = 'FIXED'

    DISCOUNT_TYPE_CHOICES = (
        (DISCOUNT_TYPE_PERCENTAGE, 'Percentage'),
        (DISCOUNT_TYPE_FIXED, 'Fixed'),
    )

    code = models.CharField(max_length=30, unique=True, help_text='Code unique for this coupon')
    description = models.TextField(blank=True, help_text='Description of this coupon')
    discount_type = models.CharField(max_length=30, choices=DISCOUNT_TYPE_CHOICES, default=DISCOUNT_TYPE_PERCENTAGE, help_text='Discount type for this coupon')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(decimal.Decimal('0.01'))], help_text='Discount value for this coupon')
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(blank=True, null=True)
    max_use = models.PositiveIntegerField(default=100)

    threshold_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(decimal.Decimal('0.00'))],
        null=True,
        blank=True,
        default=None,
        help_text='Minimum order amount required to use this coupon. Leave blank if no threshold.'
    )

    uses_count = models.PositiveIntegerField(default=0, editable=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code

    def clean(self):
        super().clean()
        if self.discount_type == self.DISCOUNT_TYPE_PERCENTAGE and self.discount_value > 100:
            raise ValidationError('Discount value must be greater than 100')

        if self.valid_from and self.valid_to and self.valid_from > self.valid_to:
            raise ValidationError('Invalid date range')

        self.code = self.code.upper()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def is_valid(self, order_amount=None):
        now = timezone.now()
        if not self.is_active:
            return False, "Coupon is not active."
        if self.valid_from > now:
            return False, "Coupon is not yet valid."
        if self.valid_to < now:
            return False, "Coupon has expired."
        if self.uses_count >= self.max_uses:
            return False, "Coupon usage limit reached."

        if self.threshold_amount is not None and order_amount is not None:
            try:
                current_amount = decimal.Decimal(order_amount)
            except (TypeError, decimal.InvalidOperation):
                return False, "Invalid order amount provided for threshold check."
            if current_amount < self.threshold_amount:
                return False, f"Order amount must be at least {self.threshold_amount} to use this coupon."

        return True, "Coupon is valid."

    def apply_discount(self, original_price):
        try:
            original_price = decimal.Decimal(original_price)
        except (TypeError, decimal.InvalidOperation):
            return original_price, decimal.Decimal('0.00')

        discount_amount = decimal.Decimal('0.00')
        if self.discount_type == self.DISCOUNT_TYPE_PERCENTAGE:
            discount_amount = (self.discount_value / decimal.Decimal('100')) * original_price
        elif self.discount_type == self.DISCOUNT_TYPE_FIXED:
            discount_amount = self.discount_value
        discount_amount = min(discount_amount, original_price)
        final_price = original_price - discount_amount
        final_price = max(final_price, decimal.Decimal('0.00'))
        return final_price, discount_amount
