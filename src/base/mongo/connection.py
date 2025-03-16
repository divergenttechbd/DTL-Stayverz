from django.conf import settings
from contextlib import contextmanager
from pymongo import MongoClient


@contextmanager
def connect_mongo(*args, **kwargs):
    client = MongoClient(settings.MONGO_URL)
    db = client[kwargs.get("database", settings.MONGO_DB)]
    collections = {}
    for coll in ["User", "ChatRoom", "Message"]:
        collections[coll] = db[coll]
    try:
        yield collections
    finally:
        client.close()
