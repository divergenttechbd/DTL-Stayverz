from django.urls import path

from payments.views.host import (
    HostPayMethodListCreateAPIView,
    HostPayMethodRetrieveUpdateAPIView,
    HostPaymentListAPIView,
    HostPaymentDetailAPIView, HostFinanceReportAPIView,
)

app_name = "host"

urlpatterns = [
    path(
        "pay-methods/",
        HostPayMethodListCreateAPIView.as_view(),
        name="pay_method_list_create",
    ),
    path(
        "pay-methods/<int:pk>/",
        HostPayMethodRetrieveUpdateAPIView.as_view(),
        name="pay_method_retrieve_update",
    ),
    path(
        "pay-outs/",
        HostPaymentListAPIView.as_view(),
        name="payment_list",
    ),
    path(
        "pay-outs/<invoice_no>/",
        HostPaymentDetailAPIView.as_view(),
        name="payment_retrieve",
    ),

    path('host/finance-report/', HostFinanceReportAPIView.as_view(), name='host-finance-report'),
]
