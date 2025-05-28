import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
from src.core.config import settings

server_key = settings.FCM_SERVER_KEY_PATH
cred = credentials.Certificate(server_key)
firebase_admin.initialize_app(cred)


def send_fcm_notification(device_token, title, body, data=None):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body), token=device_token
    )
    if data:
        message.data = data
    response = messaging.send(message)
    print("Successfully sent notification:", response)
