from django.urls import path

from payments.views.admin import (
    AdminHostPaymentListCreateAPIView,
    AdminHostPaymentRetrieveUpdateAPIView,
    AdminHostPayMethodListAPIView,
)

app_name = "admin"

urlpatterns = [
    path(
        "host-pay-methods/",
        AdminHostPayMethodListAPIView.as_view(),
        name="host_pay_method_list",
    ),
    path(
        "host-payments/",
        AdminHostPaymentListCreateAPIView.as_view(),
        name="host_payment_list_create",
    ),
    path(
        "host-payments/<str:invoice_no>/",
        AdminHostPaymentRetrieveUpdateAPIView.as_view(),
        name="host_payment_retrieve_update",
    ),
]
