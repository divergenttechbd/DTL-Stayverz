from django.urls import path

from payments.views.user import (
    UserSSLCommerzOrderPaymentView,
    CustomerSSLCommerzIPNView,
    PaymentRedirectAPIView,
)

app_name = "user"

urlpatterns = [
    path(
        "ssl-order-payment/",
        UserSSLCommerzOrderPaymentView.as_view(),
        name="user-ssl-order-payment",
    ),
    path(
        "booking/sslcommerz/ipn/",
        CustomerSSLCommerzIPNView.as_view(),
        name="customer-ssl-ipn",
    ),
    path(
        "booking/<str:status>/<str:invoice_no>/",
        PaymentRedirectAPIView.as_view(),
        name="payment_redirect",
    ),
]
