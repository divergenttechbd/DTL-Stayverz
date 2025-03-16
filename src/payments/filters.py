from django.utils import timezone
from django_filters import rest_framework as filters
from payments.models import HostPayment, HostPayMethod


class AdminHostPayMethodFilter(filters.FilterSet):
    class Meta:
        model = HostPayMethod
        fields = ("host",)


class AdminHostPaymentFilter(filters.FilterSet):
    payment_date = filters.DateFromToRangeFilter()

    class Meta:
        model = HostPayment
        fields = ("payment_date", "host", "status")


class HostPaymentFilter(filters.FilterSet):
    payment_date = filters.DateFromToRangeFilter()

    class Meta:
        model = HostPayment
        fields = ("payment_date", "pay_method", "status")
