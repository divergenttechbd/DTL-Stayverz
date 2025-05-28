from typing import Optional
from beanie import Document
from datetime import datetime
from src.core.helpers.enum import (
    UserRoleOption,
    UserStatusOption,
    UserTypeOption,
    IdentityVerificationStatusOption,
    IdentityVerificationMethodOption,
)


class User(Document):
    user_id: int
    username: str
    first_name: str
    last_name: str
    full_name: str
    email: str | None = None
    image: str | None = None
    phone_number: str
    is_active: bool = True
    status: UserStatusOption
    u_type: UserTypeOption
    role: Optional[UserRoleOption] = None
    is_phone_verified: bool = False
    is_email_verified: bool = False
    identity_verification_status: Optional[IdentityVerificationStatusOption] = None
    identity_verification_method: IdentityVerificationMethodOption | None | str
    identity_verification_images: dict = {}
    identity_verification_reject_reason: Optional[str]
    country_code: str
    last_online: Optional[datetime] = None
    online_status: bool = False
    fcm_token: str | None = None

    def __str__(self) -> str:
        return self.username
