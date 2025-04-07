import uuid

import requests
from celery import shared_task
from celery.utils.log import get_task_logger
from django.conf import settings

logger = get_task_logger(__name__)


# @shared_task(name="myproject.users.send_sms")
# def send_sms(username: str, message: str) -> None:
#     data = {
#         "api_token": settings.SSL_TOKEN,
#         "sid": settings.SSL_SID,
#         "csms_id": uuid.uuid1().hex[:20],
#         "sms": message,
#         "msisdn": username,
#     }
#     res = requests.post(settings.SSL_URL, data=data)
#     print(res.json())
#     return

def send_sms(username: str, message: str) -> None:
    # Construct the SMS URL using the provided msisdn and message
    sms_url = f"http://192.168.7.180:8080/bulk_sms_bd/sms_send_2?msisdn={username}&message={message}"

    # Send the request to the Bulk SMS URL
    res = requests.get(sms_url)  # Using GET since the URL is formatted for GET requests

    print(message)
    # Optionally, check for successful response
    if res.status_code == 200:
        print("SMS sent successfully.")
    else:
        print(f"Failed to send SMS. Status Code: {res.status_code}")

    return
