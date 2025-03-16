import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        print(self.user, "-----------------")
        self.room_group_name = f"{self.user.id}_notify"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        count = text_data_json["count"]
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "notifications", "message": message, "count": count},
        )

    async def notifications(self, event):
        message = event["message"]
        count = event["count"]
        await self.send(text_data=json.dumps({"message": message, "count": count}))
