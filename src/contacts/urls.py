from django.urls import path
from contacts.views import contact_us

app_name = "contacts"

urlpatterns = [
    path(
        "messages/",
        contact_us,
        name="contact_us",
    ),
]
