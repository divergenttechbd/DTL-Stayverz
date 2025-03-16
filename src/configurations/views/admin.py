from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from base.helpers.pagination import CustomPagination
from base.permissions import IsStaff, IsSuperUser
from rest_framework.generics import views
from configurations.filters import ServiceChargeHistoryFilter
from configurations.models import ServiceCharge, ServiceChargeHistory

from configurations.serializers import (
    ServiceChargeHistorySerializer,
    ServiceChargeSerializer,
)


class AdminServiceChargeListCreateAPIView(views.APIView):
    permission_classes = (IsStaff,)
    pagination_class = CustomPagination
    filterset_class = ServiceChargeHistoryFilter
    swagger_tags = ["Admin Configurations"]

    def post(self, request, *args, **kwargs):
        serializer = ServiceChargeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            obj, created = ServiceCharge.objects.update_or_create(
                sc_type=request.data["sc_type"],
                defaults={
                    "value": request.data["value"],
                    "calculation_type": request.data["calculation_type"],
                },
            )

            return Response(
                {"message": "Service submitted"},
                status=status.HTTP_200_OK,
            )

    def get(self, request, *args, **kwargs):
        filter_param = {"sc_type": request.GET["sc_type"]}
        qs = ServiceChargeHistory.objects.filter(**filter_param).order_by("-id")

        # Apply filtering
        filtered_qs = self.filterset_class(request.GET, queryset=qs).qs

        paginator = self.pagination_class()
        paginated_qs = paginator.paginate_queryset(filtered_qs, request)
        data = ServiceChargeHistorySerializer(paginated_qs, many=True).data
        return paginator.get_paginated_response(data)
