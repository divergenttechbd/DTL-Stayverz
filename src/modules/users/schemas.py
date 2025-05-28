from typing import Optional
from datetime import datetime, timedelta
from beanie import PydanticObjectId
from pydantic import BaseModel, field_serializer


class UserLiteBase(BaseModel):
    id: PydanticObjectId
    username: str
    full_name: str
    user_id: int
    email: Optional[str]
    image: Optional[str]
    phone_number: Optional[str]
    last_online: Optional[datetime] = None
    online_status: bool = False

    # @field_serializer("last_online")
    # def serialize_created_at(self, last_online: datetime, _info):
    #     return last_online + timedelta(hours=6) if last_online else None

    class Config:
        from_attributes = True
