from django.db import models

from base.type_choices import (
    ServiceChargeCalculationTypeOption,
    ServiceChargeTypeOption,
)


# Create your models here.
class CancellationPolicy(models.Model):
    policy_name = models.CharField(max_length=100)
    description = models.TextField()
    refund_percentage = models.FloatField(default=0)
    cancellation_deadline = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Cancellation Policy"
        verbose_name_plural = "1. Cancellation Policy"

    def __str__(self):
        return self.policy_name


class ServiceCharge(models.Model):
    value = models.FloatField()
    sc_type = models.CharField(max_length=20, choices=ServiceChargeTypeOption.choices)
    calculation_type = models.CharField(
        max_length=20, choices=ServiceChargeCalculationTypeOption.choices
    )

    class Meta:
        verbose_name = "Service Charge"
        verbose_name_plural = "2. Service Charge"

    def __str__(self):
        return str(self.pk)


class ServiceChargeHistory(models.Model):
    # service_charge = models.ForeignKey(ServiceCharge, on_delete=models.CASCADE)
    value = models.FloatField()
    sc_type = models.CharField(max_length=20, choices=ServiceChargeTypeOption.choices)
    calculation_type = models.CharField(
        max_length=20, choices=ServiceChargeCalculationTypeOption.choices
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Service Charge History"
        verbose_name_plural = "2. Service Charge History"

    def __str__(self):
        return str(self.pk)
