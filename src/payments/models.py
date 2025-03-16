from django.contrib.auth import get_user_model
from django.db import models

from base.models import BaseModel
from base.type_choices import (
    HostPaymentMethodOption,
    OnlinePaymentMethodOption,
    OnlinePaymentStatusOption,
    PaymentStatusOption,
)

# Create your models here.
User = get_user_model()


class HostPayMethod(BaseModel):
    host = models.ForeignKey(User, on_delete=models.PROTECT)
    m_type = models.CharField(max_length=20, choices=HostPaymentMethodOption.choices)
    account_no = models.CharField(max_length=30, unique=True)
    account_name = models.CharField(max_length=150)
    bank_name = models.CharField(max_length=150, blank=True)
    branch_name = models.CharField(max_length=150, blank=True)
    routing_number = models.CharField(max_length=30, blank=True)
    is_default = models.BooleanField()

    class Meta:
        verbose_name = "Host PayMethod"
        verbose_name_plural = "1. Host PayMethod"

    def __str__(self):
        return self.account_no


class HostPayment(BaseModel):
    host = models.ForeignKey(User, on_delete=models.PROTECT)
    invoice_no = models.CharField(max_length=200, unique=True)
    pay_method = models.ForeignKey("payments.HostPayMethod", on_delete=models.PROTECT)
    total_amount = models.FloatField()
    status = models.CharField(
        max_length=15,
        choices=PaymentStatusOption.choices,
        default=PaymentStatusOption.UNPAID,
    )
    payment_date = models.DateField()

    class Meta:
        verbose_name = "Host Payment"
        verbose_name_plural = "2. Host Payment"

    def __str__(self):
        return self.invoice_no


class HostPaymentItem(BaseModel):
    host_payment = models.ForeignKey("payments.HostPayment", on_delete=models.PROTECT)
    booking = models.OneToOneField("bookings.Booking", on_delete=models.PROTECT)
    invoice_no = models.CharField(max_length=200)
    reservation_code = models.CharField(max_length=200)
    night_count = models.PositiveIntegerField()
    guest_count = models.PositiveIntegerField()
    amount = models.FloatField()

    class Meta:
        verbose_name = "Host Payment Item"
        verbose_name_plural = "2. Host Payment Item"

    def __str__(self):
        return str(self.pk)


class OnlinePayment(BaseModel):
    transaction_number = models.CharField(max_length=200, unique=True)
    payment_method = models.CharField(
        max_length=15, choices=OnlinePaymentMethodOption.choices
    )
    booking = models.OneToOneField("bookings.Booking", on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    amount = models.FloatField()
    status = models.CharField(max_length=15, choices=OnlinePaymentStatusOption.choices)
    meta = models.JSONField(default=dict)
    has_hit_ipn = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Online Payment"
        verbose_name_plural = "1. Online Payment"

    def __str__(self):
        return self.transaction_number
