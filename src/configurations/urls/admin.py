from django.urls import path

from configurations.views.admin import AdminServiceChargeListCreateAPIView

app_name = "admin"

urlpatterns = [
    path(
        "service-charges/",
        AdminServiceChargeListCreateAPIView.as_view(),
        name="service_charge_list",
    ),
]
