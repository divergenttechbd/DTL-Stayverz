import json
from typing import Any

from starlette.datastructures import MutableHeaders
from starlette.types import ASGIApp, Message, Receive, Scope, Send

STATUS_MESSAGES = {
    200: "Status OK",
    201: "Created",
    204: "Deleted",
    302: "Found",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request Uri Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "Http Version Not Supported",
    507: "Insufficient Storage",
    511: "Network Authentication Required",
}


class CustomResponseMiddleware:
    application_generic_urls = [
        "/api/v1/openapi.json",
        "/docs",
        "/docs/oauth2-redirect",
        "/redoc",
        "/openapi.json",
    ]

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http" and not any(
            scope["path"].startswith(endpoint)
            for endpoint in CustomResponseMiddleware.application_generic_urls
        ):
            responder = MetaDataAdderMiddlewareResponder(self.app)
            await responder(scope, receive, send)
            return

        await self.app(scope, receive, send)


class MetaDataAdderMiddlewareResponder:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        self.initial_message: Message = {}

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        self.send = send
        await self.app(scope, receive, self.send_with_meta_response)

    async def send_with_meta_response(self, message: Message) -> None:
        message_type = message["type"]
        if message_type == "http.response.start":
            self.initial_message = message

        elif message_type == "http.response.body":
            try:
                response_body = json.loads(message["body"].decode())
                data: dict[str, Any] = {
                    "success": (self.initial_message["status"] // 100) not in (4, 5)
                }
                data["message"] = STATUS_MESSAGES[self.initial_message["status"]]
                if data["success"]:
                    data["data"] = (
                        response_body["data"]
                        if type(response_body.get("data")) == list
                        else response_body
                    )
                else:
                    if isinstance(response_body["detail"], list):
                        data["errors"] = {
                            "field_errors": response_body["detail"],
                            "non_field_errors": None,
                        }
                    else:
                        data["errors"] = {
                            "non_field_errors": response_body["detail"],
                            "field_errors": None,
                        }

                    data["data"] = None
                data["extra_data"] = response_body.get("extra_data")
                data["meta_info"] = response_body.get("meta_info")

                data_to_be_sent_to_user = json.dumps(data, default=str).encode("utf-8")
                headers = MutableHeaders(raw=self.initial_message["headers"])
                headers["Content-Length"] = str(len(data_to_be_sent_to_user))
                message["body"] = data_to_be_sent_to_user
                await self.send(self.initial_message)
                await self.send(message)
            except Exception:
                await self.send(self.initial_message)
                await self.send(message)
