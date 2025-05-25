import firebase_admin
from django.apps import AppConfig
from django.conf import settings
from firebase_admin import credentials

class NotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "notifications"

    # def ready(self):
    #     if not firebase_admin._apps:
    #         try:
    #             cred_path = settings.FCM_SERVER_KEY_PATH
    #             cred = credentials.Certificate(cred_path)
    #             firebase_admin.initialize_app(cred)
    #             print("NotificationsApp: Firebase Admin SDK initialized successfully.")
    #         except AttributeError:
    #             print(
    #                 "NotificationsApp: FIREBASE_ADMIN_SDK_JSON_PATH not set in Django settings. Firebase not initialized.")
    #         except FileNotFoundError:
    #             print(
    #                 f"NotificationsApp: Firebase service account key not found at {getattr(settings, 'FIREBASE_ADMIN_SDK_JSON_PATH', 'MISSING_PATH')}. Firebase not initialized.")
    #         except Exception as e:
    #             print(f"NotificationsApp: Error initializing Firebase Admin SDK: {e}")
