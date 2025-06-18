import urllib.parse
from typing import Any
import jwt
from fastapi import Request, HTTPException, WebSocket, WebSocketException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security.utils import get_authorization_scheme_param
from pydantic import BaseModel
from src.modules.users.models import User
from src.core.config import settings
from src.core.logging import logger


class TokenData(BaseModel):
    username: str
    user_id: str


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def verify_access_token(self, jwt_token: str) -> dict | bool:
        try:
            decoded_token = jwt.decode(
                jwt_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            username: str = decoded_token.get("username")
            if username is None:
                return False

            db_user = await User.find_one(User.username == username)
            if not db_user:
                return False
            return db_user
        except Exception as e:
            logger.info(str(e))
            return False

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme."
                )
            verification_jwt = await self.verify_jwt(credentials.credentials)
            if not verification_jwt:
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token."
                )
            # print(credentials.credentials)
            request.state.user = verification_jwt
            return True
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    async def verify_jwt(self, jwt_token: str) -> dict | bool:
        try:
            payload = await self.verify_access_token(jwt_token)
        except:
            payload = False

        return payload


class JWTWebSocketBearer:
    async def verify_access_token(self, jwt_token: str) -> dict | bool:
        try:
            decoded_token = jwt.decode(
                jwt_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            username: str = decoded_token.get("username")
            if username is None:
                return False
            db_user = await User.find_one(User.username == username)
            if not db_user:
                return False
            return db_user
        except Exception as e:
            print(e)
            return False

    async def verify_jwt(self, jwt_token: str) -> dict | bool:
        try:
            payload = await self.verify_access_token(jwt_token)
        except:
            payload = False

        return payload

    async def __call__(self, websocket: WebSocket) -> Any:

        print("=== WebSocket Cookie Debug ===")
        print("All cookies:", dict(websocket.cookies))
        print("Cookie keys:", list(websocket.cookies.keys()))
        print("Raw cookie header:", websocket.headers.get("cookie"))
        print("============================")
        access_token = websocket.cookies.get("access_token")
        access_token = "bearer " + access_token
        # urllib.parse.unquote(access_token)
        # access_token = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiTXIiLCJsYXN0X25hbWUiOiJIb3N0IiwidXNlcm5hbWUiOiIwMTk3NTk5MTQxNF9ob3N0IiwidV90eXBlIjoiaG9zdCIsInBob25lX251bWJlciI6IjAxOTc1OTkxNDE0IiwiaXNfYWN0aXZlIjp0cnVlLCJleHAiOjE3NTAyNTkxMTAsInRva2VuX3R5cGUiOiJhY2Nlc3MifQ.rn7edSSz7FlDGBqRUBaA4rX0pwtbJf-g9E6VioY4g7k"
        print(access_token, " access token")
        scheme, credentials = get_authorization_scheme_param(access_token)

        if not (access_token and scheme and credentials):
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

        if scheme.lower() != "bearer":
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

        if credentials:
            verification_jwt = await self.verify_jwt(credentials)
            if not verification_jwt:
                raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

            websocket.state.user = verification_jwt
            return True
        else:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
