from datetime import datetime
from beanie import PydanticObjectId
from fastapi import HTTPException
import pymongo
from src.modules.chat.schemas import (
    ChatRoomMessageResponse,
    ChatRoomResponse,
    ChatRoomStatusUpdate,
)
from src.core.helpers.enum import ChatRoomStatus, RoomStatusEnum, UserTypeOption
from src.core.helpers.utils import paginateResponse
from src.core.schemas.common import PaginatedResponse, QueryParam
from src.modules.chat.repository import ChatRepository
from src.modules.users.models import User
from src.modules.chat.models import ChatRoom, Message
from src.core.service import BaseService
from src.core.logging import logger


class ChatService(BaseService):
    def __init__(self, chat_repository: ChatRepository):
        super().__init__(repository=chat_repository)

    async def check_user_has_room_permission(
        self, room_id: str, current_user: User
    ) -> tuple[ChatRoom | None, bool]:
        chat_room = await self.repository.get_by_id(model=ChatRoom, id=room_id)

        if not chat_room:
            return None, False

        if current_user.id not in [
            chat_room.from_user.id,
            chat_room.to_user.id,
        ]:
            return None, False

        return chat_room, True

    async def get_room_messages(
        self, current_user: User, room_id: str, query_param: QueryParam
    ) -> PaginatedResponse[Message]:
        chat_room = await self.repository.get_by_id(model=ChatRoom, id=room_id)

        if not chat_room:
            raise HTTPException(status_code=400, detail="Room does not exists")

        # if chat_room.status == RoomStatusEnum.CLOSED:
        #     raise HTTPException(status_code=400, detail="Room is closed by admin")

        if current_user.u_type != UserTypeOption.SYSTEM and current_user.id not in [
            chat_room.from_user.id,
            chat_room.to_user.id,
        ]:
            raise HTTPException(
                status_code=400, detail="You are not member of this chat room"
            )

        messages, count = await self.repository.get_room_messages(
            room_id=chat_room.id, query_param=query_param
        )

        user_unread_message_count = await self.repository.count_user_unread_message(
            user_id=current_user.id, u_type=current_user.u_type
        )

        return paginateResponse(
            data=messages,
            total=count,
            page=query_param.page,
            limit=query_param.offset_limit,
            extra_data={
                "chat_room": ChatRoomResponse(**chat_room.model_dump()),
                "unread_message_count": user_unread_message_count,
            },
        )

    async def get_chat_rooms(
        self, query_param: QueryParam, current_user: User
    ) -> PaginatedResponse[ChatRoom]:
        if current_user.u_type == UserTypeOption.GUEST:
            filter = (ChatRoom.from_user.id == PydanticObjectId(current_user.id),)
        elif current_user.u_type == UserTypeOption.HOST:
            filter = (ChatRoom.to_user.id == PydanticObjectId(current_user.id),)
        elif current_user.u_type == UserTypeOption.SYSTEM:
            filter = {}
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")

        sorting = [
            (ChatRoom.updated_at, pymongo.DESCENDING),
        ]
        chat_rooms, count = await self.repository.get_chat_rooms(
            param=query_param, filter_param=filter, sorting=sorting
        )

        filter_param = (Message.user.id == PydanticObjectId(current_user.id),)
        all_message_count = await self.repository.count_user_all_message(
            filter_param=filter_param
        )
        return paginateResponse(
            data=chat_rooms,
            total=count,
            page=query_param.page,
            limit=query_param.offset_limit,
            extra_data={"all_message_count": all_message_count},
        )

    async def update_chat_room_message(
        self, chat_room: ChatRoom, other_user_id: PydanticObjectId
    ) -> None:
        await self.repository.update_chat_message(
            chat_room=chat_room, other_user_id=other_user_id
        )
        return None

    async def save_message(
        self, data: dict, chat_room: ChatRoom, current_user: User
    ) -> Message:
        formatted_data = {
            "chat_room": chat_room.id,
            "user": current_user.id,
            "content": data.get("message", ""),
            # "created_at": datetime.now(),
            "file": data.get("file"),
            "m_type": "normal",
        }

        chat_room_update_data = {
            "latest_message": {
                "content": data.get("message", ""),
                "created_at": datetime.now(),
                "user": {
                    # "id":  need to mongo user id here MUST
                    "username": current_user.username,
                    "full_name": current_user.full_name,
                    "image": current_user.image,
                    "user_id": current_user.user_id,
                },
                "m_type": "normal",
                "is_read": False,
            },
            "booking_data": chat_room.latest_message,
            "listing": chat_room.booking_data,
            "status": chat_room.status,
        }
        saved_message = await self.repository.create_message(
            data=formatted_data,
            chat_room_update_data=chat_room_update_data,
            chat_room=chat_room,
        )
        return saved_message

    async def update_chat_room_status(
        self, current_user: User, room_id: str, data: ChatRoomStatusUpdate
    ) -> ChatRoomResponse:
        chat_room = await self.repository.get_by_id(model=ChatRoom, id=room_id)
        if not chat_room:
            raise HTTPException(status_code=400, detail="Room does not exists")

        return await self.repository.update_chat_room_status(
            current_user=current_user, chat_room=chat_room, status=data.status
        )

    async def get_latest_message(
        self, chat_room: ChatRoom, number_of_message: int
    ) -> tuple[list[Message], int]:
        return await self.repository.get_latest_message(
            chat_room=chat_room, number_of_message=number_of_message
        )

    async def get_user_all_room_partner(self, current_user: User) -> list:
        if current_user.u_type == UserTypeOption.GUEST:
            filter = (ChatRoom.from_user.id == PydanticObjectId(current_user.id),)
        elif current_user.u_type == UserTypeOption.HOST:
            filter = (ChatRoom.to_user.id == PydanticObjectId(current_user.id),)
        elif current_user.u_type == UserTypeOption.SYSTEM:
            filter = {}
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")

        data = await self.repository.get_user_all_room(filter_param=filter)

        partner_list = []

        for item in data:
            if current_user.u_type == UserTypeOption.GUEST:
                partner_list.append(item.to_user.to_dict().get("id"))
            else:
                partner_list.append(item.from_user.to_dict().get("id"))

        return partner_list

    async def update_user_last_seen(
        self, current_user: User, online_status: bool
    ) -> None:
        return await self.repository.update_user_last_seen(
            current_user=current_user, online_status=online_status
        )

    async def get_user_unread_message_count(
        self, user_id: str, u_type: UserTypeOption
    ) -> int:
        return await self.repository.count_user_unread_message(
            user_id=user_id, u_type=u_type
        )

    async def get_by_id(self, id: str) -> User | None:
        return await self.repository.get_by_id(model=User, id=id)
