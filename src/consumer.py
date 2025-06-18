import asyncio
import json
import logging
import aio_pika
import motor.motor_asyncio


async def main() -> None:
    # logging.basicConfig(level=logging.DEBUG)
    connection = await aio_pika.connect_robust(
        "amqp://user:password@192.168.7.172:5672/"
    )

    queue_name = "main"

    # MongoDB setup
    # mongo_client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
    mongo_client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://192.168.7.172:27017")
    db = mongo_client["chat_service"]
    collection = db["User"]

    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=10)
        queue = await channel.declare_queue(queue_name, auto_delete=False)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    print(message.body, message.properties.content_type)
                    # message_body = message.body.decode()
                    data = json.loads(message.body)
                    await collection.insert_one(data)
                    if queue.name in message.body.decode():
                        break


if __name__ == "__main__":
    asyncio.run(main())


# {
#     "first_name": "Zayed",
#     "last_name": "Khasssssssssn",
#     "username": "01630811324_host",
#     "phone_number": "01630811324",
#     "email": "",
#     "is_active": true,
#     "status": "active",
#     "is_phone_verified": false,
#     "is_email_verified": false,
#     "u_type": "host",
#     "country_code": "BD",
#     "image": "",
#     "date_joined": "2023-10-19T00:32:27.672588+06:00",
#     "full_name": "Zayed Khan",
#     "identity_verification_status": "not_verified",
#     "identity_verification_images": {},
#     "identity_verification_method": "",
#     "identity_verification_reject_reason": "",
# }
