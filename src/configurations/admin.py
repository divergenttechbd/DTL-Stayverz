from django.contrib import admin
from configurations.models import (
    CancellationPolicy,
    ServiceCharge,
    ServiceChargeHistory,
)

# Register your models here.
admin.site.register([CancellationPolicy, ServiceCharge, ServiceChargeHistory])
