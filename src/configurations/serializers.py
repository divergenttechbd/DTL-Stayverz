from rest_framework import serializers
from base.serializers import BaseModelSerializer

from base.type_choices import (
    ServiceChargeCalculationTypeOption,
    ServiceChargeTypeOption,
)
from configurations.models import ServiceChargeHistory


class ServiceChargeSerializer(serializers.Serializer):
    value = serializers.FloatField()
    sc_type = serializers.ChoiceField(choices=ServiceChargeTypeOption.choices)
    calculation_type = serializers.ChoiceField(
        choices=ServiceChargeCalculationTypeOption.choices
    )


class ServiceChargeHistorySerializer(BaseModelSerializer):
    class Meta:
        model = ServiceChargeHistory
        fields = "__all__"
