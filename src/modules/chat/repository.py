from datetime import datetime
from beanie import PydanticObjectId
import beanie
from bson import ObjectId
import pymongo
from beanie.odm.operators.find.logical import Or
from fastapi import HTTPException
from src.modules.chat.schemas import (
    ChatRoomMessageResponse,
    ChatRoomResponse,
    ChatRoomStatusUpdate,
)
from src.core.helpers.enum import ChatRoomStatus, RoomStatusEnum, UserTypeOption
from src.modules.users.models import User
from src.core.schemas.common import QueryParam
from src.core.repository.base_repository import BaseRepository
from src.modules.chat.models import ChatRoom, Message


class ChatRepository(BaseRepository):

    async def get_chat_rooms(
        self,
        param: QueryParam,
        filter_param: dict | tuple = {},
        sorting: list = [],
    ) -> tuple[list[ChatRoom], int]:
        offset = (param.page - 1) * param.offset_limit
        limit = param.limit
        data = (
            await ChatRoom.find(
                *filter_param, limit=limit, skip=offset, fetch_links=True
            )
            .sort(sorting)
            .to_list()
        )
        total_count = await ChatRoom.find(*filter_param).count()
        return data, total_count

    async def get_room_messages(
        self, room_id: str, query_param: QueryParam
    ) -> tuple[list[Message], int]:
        try:
            offset = (query_param.page - 1) * query_param.offset_limit
            limit = query_param.limit
            data = await Message.find(
                Message.chat_room.id == room_id,
                limit=limit,
                skip=offset,
                fetch_links=True,
            ).to_list()

            count = await Message.find(
                Message.chat_room.id == room_id,
            ).count()
            return data, count
        except (ValueError, beanie.exceptions.DocumentNotFound):
            raise HTTPException(status_code=400, detail="Not found")

    async def update_chat_message(
        self, chat_room: ChatRoom, other_user_id: PydanticObjectId
    ) -> None:
        try:
            await Message.find(
                Message.chat_room.id == chat_room.id, Message.user.id == other_user_id
            ).update({"$set": {Message.is_read: True}})

            await chat_room.set(
                {
                    ChatRoom.latest_message.is_read: True,
                }
            )
            return None
        except Exception as err:
            print(err)

    async def create_message(
        self, data: dict, chat_room_update_data: dict, chat_room=ChatRoom
    ) -> Message:
        created_object = Message(**data)  # type: ignore
        created_message = await created_object.create()
        await chat_room.set(
            {
                ChatRoom.latest_message: chat_room_update_data.get("latest_message"),
                ChatRoom.created_at: datetime.now(),
                ChatRoom.updated_at: datetime.now(),
                # ChatRoom.booking_data: chat_room_update_data.get("booking_data"),
                # ChatRoom.listing: chat_room_update_data.get("listing"),
            }
        )
        return created_message

    async def update_chat_room_status(
        self, current_user: User, chat_room: ChatRoom, status: ChatRoomStatusUpdate
    ) -> ChatRoomResponse:
        created_object = Message(
            chat_room=chat_room.id,
            content=(
                f"Room is closed"
                if status == ChatRoomStatus.CLOSED
                else "Room is Open by admin"
            ),
            user=current_user.id,
            m_type="system",
            meta=None,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        await created_object.create()
        await chat_room.set(
            {
                ChatRoom.status: status,
                ChatRoom.updated_at: datetime.now(),
                ChatRoom.latest_message: created_object.model_dump(),
            }
        )

        return chat_room

    async def get_latest_message(
        self, chat_room: ChatRoom, number_of_message: int
    ) -> tuple[list[Message], int]:
        messages = (
            await Message.find(
                Message.chat_room.id == chat_room.id,
                limit=number_of_message,
                fetch_links=True,
            )
            .sort(
                [
                    (ChatRoom.updated_at, pymongo.DESCENDING),
                ]
            )
            .to_list()
        )

        total_message = await Message.find(
            Message.chat_room.id == chat_room.id,
        ).count()

        return messages, total_message

    async def get_user_all_room(
        self,
        filter_param: dict | tuple = {},
    ) -> list[ChatRoom]:
        return await ChatRoom.find(*filter_param).to_list()

    async def update_user_last_seen(
        self,
        current_user: User,
        online_status: bool,
    ) -> None:
        if online_status:
            update_query = {User.online_status: online_status}
        else:
            update_query = {
                User.last_online: datetime.now(),
                User.online_status: online_status,
            }
        await current_user.set(update_query)

    async def count_user_all_message(
        self,
        filter_param: dict | tuple = {},
    ) -> int:
        return await Message.find(*filter_param).count()

    async def count_user_unread_message(
        self, user_id: str, u_type: UserTypeOption, is_read: bool = False
    ) -> int:
        if u_type == UserTypeOption.GUEST:
            user_all_chat_room = await ChatRoom.find(
                ChatRoom.from_user.id == PydanticObjectId(user_id)
            ).to_list()
        else:
            user_all_chat_room = await ChatRoom.find(
                ChatRoom.to_user.id == PydanticObjectId(user_id)
            ).to_list()

        # print(len(user_all_chat_room), "----------user_all_chat_room--------")

        total_unread_msg_count = 0
        for room in user_all_chat_room:
            # if is_read:
            #     other_user_id = room.from_user.to_dict()["id"]
            # else:
            # other_user_id = (
            #     room.from_user.to_dict()["id"]
            #     if user_id == room.to_user.to_dict()["id"]
            #     else room.to_user.to_dict()["id"]
            # )

            chat_room_user_ids = [
                room.from_user.to_dict()["id"],
                room.to_user.to_dict()["id"],
            ]
            other_user_id = (
                chat_room_user_ids[1]
                if chat_room_user_ids[0] == str(user_id)
                else chat_room_user_ids[0]
            )

            # print(other_user_id, chat_room_user_ids, user_id, "----------dddd-------")
            individual_chat_room_msg_count = await Message.find(
                Message.chat_room.id == room.id,
                Message.user.id == PydanticObjectId(other_user_id),
                Message.is_read == False,
            ).count()

            # print(individual_chat_room_msg_count, "--------count")

            if individual_chat_room_msg_count > 0:
                total_unread_msg_count += 1

        # print(total_unread_msg_count, "--------------------------")
        return total_unread_msg_count
