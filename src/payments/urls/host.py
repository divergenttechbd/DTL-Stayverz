from django.urls import path

from payments.views.host import (
    HostPayMethodListCreateAPIView,
    HostPayMethodRetrieveUpdateAPIView,
    HostPaymentListAPIView,
    HostPaymentDetailAPIView, HostFinanceReportAPIView, HostLast6MonthsPayoutBreakdownAPIView,
    HostMonthlyEarningsDetailAPIView,
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
    path('host/payout-breakdown-last-6months/', HostLast6MonthsPayoutBreakdownAPIView.as_view(), name='host-payout-breakdown-6months'),

    path(
        'host/monthly-earnings-detail/<int:year>/<int:month>/',
        HostMonthlyEarningsDetailAPIView.as_view(),
        name='host-monthly-earnings-detail'
    )
]
