import asyncio
import os, sys

current2 = os.path.dirname(os.path.realpath(__file__))
current1 = os.path.dirname(current2)
parent = os.path.dirname(current1)
sys.path.append(parent)


from src.core.db.connector import Database
from src.core.helpers.enum import (
    IdentityVerificationStatusOption,
    IdentityVerificationMethodOption,
    UserStatusOption,
    UserTypeOption,
)

from src.modules.users.models import User


async def main() -> None:
    db = Database(mongo_uri="mongodb://localhost:27017/chat_service")
    await db.connect_to_database()
    user = User(
        username="user3",
        email="user3@example.com",
        phone_number="1334567890",
        status=UserStatusOption.ACTIVE,
        u_type=UserTypeOption.HOST,
        is_phone_verified=True,
        is_email_verified=True,
        identity_verification_method=IdentityVerificationMethodOption.PASSPORT,
        identity_verification_status=IdentityVerificationStatusOption.VERIFIED,
        country_code="BD",
    )
    await user.insert()


if __name__ == "__main__":
    asyncio.run(main())
