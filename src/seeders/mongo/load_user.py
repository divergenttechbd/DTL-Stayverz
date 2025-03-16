from django.contrib.auth import get_user_model
from base.mongo.connection import connect_mongo

User = get_user_model()


def run():
    users = User.objects.all()
    try:
        with connect_mongo() as collections:
            for user in users:
                user_document = {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "phone_number": user.phone_number,
                    "email": user.email,
                    "is_active": user.is_active,
                    "status": user.status,
                    "is_phone_verified": user.is_phone_verified,
                    "is_email_verified": user.is_email_verified,
                    "u_type": user.u_type,
                    "country_code": user.country_code,
                    "image": user.image,
                    "date_joined": user.date_joined.isoformat(),
                    "full_name": user.get_full_name(),
                    "identity_verification_status": user.identity_verification_status,
                    "identity_verification_images": user.identity_verification_images,
                    "identity_verification_method": user.identity_verification_method,
                    "identity_verification_reject_reason": user.identity_verification_reject_reason,
                    "user_id": user.id,
                }
                collections["User"].insert_one(user_document)
        print("Data inserted successfully into MongoDB.")
    except Exception as e:
        print("Failed to insert data into MongoDB:", e)
