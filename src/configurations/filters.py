from django_filters import rest_framework as filters

from configurations.models import ServiceChargeHistory


class ServiceChargeHistoryFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="start_date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="end_date", lookup_expr="lte")

    class Meta:
        model = ServiceChargeHistory
        fields = ("start_date", "end_date")
