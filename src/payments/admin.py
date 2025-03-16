from django.contrib import admin
from payments.models import OnlinePayment, HostPayment, HostPaymentItem, HostPayMethod

# Register your models here.
admin.site.register([OnlinePayment, HostPayment, HostPaymentItem, HostPayMethod])
