from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from configurations.models import ServiceCharge, ServiceChargeHistory


@receiver(post_save, sender=ServiceCharge)
def create_service_charge_history(sender, instance, created, **kwargs):
    if created:
        # If the instance is newly created, create a history record with just the start date
        ServiceChargeHistory.objects.create(
            # service_charge=instance,
            start_date=timezone.now(),
            value=instance.value,
            sc_type=instance.sc_type,
            calculation_type=instance.calculation_type,
        )
    else:
        last_history = ServiceChargeHistory.objects.last()
        if last_history:
            last_history.end_date = timezone.now()
            last_history.save()

            # Create a new historical record with the updated values
            ServiceChargeHistory.objects.create(
                # service_charge=instance,
                start_date=timezone.now(),
                value=instance.value,
                sc_type=instance.sc_type,
                calculation_type=instance.calculation_type,
            )
