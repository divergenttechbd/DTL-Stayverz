import json


from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError
import jwt


User = get_user_model()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    @database_sync_to_async
    def get_user(self, data):
        try:
            user_data = User.objects.get(username=data.get("username"))
            user = user_data
            if not user.is_active:
                return False
            return user
        except User.DoesNotExist:
            return False

    async def __call__(self, scope, receive, send):
        close_old_connections()
        try:
            # subprotocols = scope.get("subprotocols", [])
            # auth_header = subprotocols[0]

            headers = dict(scope["headers"])
            cookie_header = headers.get(b"cookie").decode("utf-8")

            cookies = cookie_header.split("; ")

            # Find and extract the cookie_token value
            auth_header = None
            for cookie in cookies:
                if cookie.startswith("cookie_token="):
                    auth_header = cookie.split("=")[1].strip('"')
                    break

            payload: dict = jwt.decode(
                jwt=auth_header.split(" ")[1],
                key=settings.SECRET_KEY,
                algorithms="HS256",
                verify=True,
            )
            user_obj = await self.get_user(data=payload)

            if not user_obj:
                response = {"error": "Unauthorized"}
                await send(
                    {
                        "type": "websocket.close",
                        "code": 401,
                        "text": json.dumps(response),
                    }
                )
                return
            scope["user"] = user_obj
        except (
            InvalidSignatureError,
            KeyError,
            ExpiredSignatureError,
            DecodeError,
        ) as err:
            scope["user"] = AnonymousUser()
        except:
            scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)


def JWTAuthMiddlewareStack(app):
    return JWTAuthMiddleware(AuthMiddlewareStack(app))
