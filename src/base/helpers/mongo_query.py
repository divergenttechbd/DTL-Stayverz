from django.contrib.auth import get_user_model
from base.mongo.connection import connect_mongo

User = get_user_model()


def create_user(data: dict) -> None:
    with connect_mongo() as collections:
        collection = collections["User"]
        data["user_id"] = data.pop("id")
        data["role"] = data.get("role")
        collection.insert_one(data)
        return


def mongo_update_user(data: dict) -> None:
    username = data.pop("username")
    with connect_mongo() as collections:
        collection = collections["User"]
        collection.update_one(
            {"username": username},
            {"$set": data},
        )
        return
