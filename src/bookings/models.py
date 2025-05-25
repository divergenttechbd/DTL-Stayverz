from decimal import Decimal

from django.db import models
from django.contrib.auth import get_user_model
from base.models import BaseModel
from base.type_choices import BookingStatusOption, PaymentStatusOption


# Create your models here.
User = get_user_model()


class Booking(BaseModel):
    invoice_no = models.CharField(max_length=200, unique=True)
    pgw_transaction_number = models.CharField(max_length=200, blank=True)
    reservation_code = models.CharField(
        max_length=200, blank=True
    )  # should unique true later
    guest = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="guest_bookings"
    )
    host = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="host_bookings"
    )
    listing = models.ForeignKey("listings.Listing", on_delete=models.PROTECT)
    check_in = models.DateField()
    check_out = models.DateField()
    night_count = models.PositiveIntegerField()
    children_count = models.PositiveIntegerField()
    infant_count = models.PositiveIntegerField()
    adult_count = models.PositiveIntegerField()
    guest_count = models.PositiveIntegerField()
    price = models.FloatField()
    guest_service_charge = models.FloatField()
    total_price = models.FloatField()
    paid_amount = models.FloatField(default=0)
    host_service_charge = models.FloatField()
    host_pay_out = models.FloatField()
    total_profit = models.FloatField()
    gateway_fee = models.FloatField(default=0)
    refund_amount = models.FloatField(default=0)
    is_refunded = models.BooleanField(default=False)
    price_info = models.JSONField()
    guest_payment_status = models.CharField(
        max_length=15,
        choices=PaymentStatusOption.choices,
        default=PaymentStatusOption.UNPAID,
    )
    host_payment_status = models.CharField(
        max_length=15,
        choices=PaymentStatusOption.choices,
        default=PaymentStatusOption.UNPAID,
    )
    status = models.CharField(
        max_length=15,
        choices=BookingStatusOption.choices,
        default=BookingStatusOption.INITIATED,
    )
    cancellation_reason = models.TextField(blank=True)
    host_review_done = models.BooleanField(default=False)
    guest_review_done = models.BooleanField(default=False)
    calendar_info = models.JSONField(default=dict)
    chat_room_id = models.CharField(max_length=200, blank=True)

    applied_coupon_code = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    applied_coupon_type = models.CharField(max_length=20, null=True, blank=True,
                                           choices=[('referral', 'Referral Coupon'), ('admin', 'Admin Coupon')])

    discount_amount_applied = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    price_after_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    applied_referral_coupon = models.ForeignKey(
        'referrals.Coupon',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='used_in_bookings'
    )

    applied_admin_coupon = models.ForeignKey(
        'coupons.Coupon',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='used_in_bookings'
    )

    invoice_pdf = models.FileField(
        upload_to='booking_invoices/',
        null=True, blank=True
    )
    invoice_generated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "1. Booking"

    def __str__(self):
        return self.invoice_no


class ListingBookingReview(BaseModel):
    listing = models.ForeignKey("listings.Listing", on_delete=models.CASCADE)
    booking = models.ForeignKey("bookings.Booking", on_delete=models.CASCADE)
    review_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews_by_user"
    )
    review_for = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews_for_user"
    )
    is_host_review = models.BooleanField(default=False)
    is_guest_review = models.BooleanField(default=False)
    rating = models.PositiveIntegerField()
    review = models.TextField()

    class Meta:
        verbose_name = "Booking Review"
        verbose_name_plural = "2. Booking Review"

    def __str__(self):
        return str(self.pk)
