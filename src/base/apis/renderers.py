from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response

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


class DefaultRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response: Response = renderer_context["response"]
        response_data = {"success": (response.status_code // 100) not in (4, 5)}
        data = data if not isinstance(data, type(None)) else {}

        response_data["status_code"] = response.status_code
        response_data["message"] = (
            data.get("message")
            if isinstance(data, dict) and data.get("message")
            else STATUS_MESSAGES[response.status_code]
        )
        if response_data.get("success"):
            if "meta_data" in data or "data" in data:
                response_data.update(data)
            else:
                response_data["data"] = data

        else:
            if "details" in data:
                response_data["errors"] = {"non_field_errors": [data["details"]]}
                del data["details"]
            elif "detail" in data:
                response_data["errors"] = {"non_field_errors": [data["detail"]]}
                del data["detail"]
            elif "message" in data:
                response_data["errors"] = {"non_field_errors": [data["message"]]}
            else:
                errors = []
                if isinstance(data, list):
                    for item in data:
                        errors.append({list(item)[0]: list(item.values())[0][0]})
                elif isinstance(data, dict):
                    for key, value in data.items():
                        errors.append({key: value[0]})
                response_data["errors"] = {"field_errors": errors}
        return super().render(response_data, accepted_media_type, renderer_context)


class OnlyRawBrowsableAPIRenderer(BrowsableAPIRenderer):
    def render_form_for_serializer(self, serializer):
        return ""

    def get_raw_data_form(self, data, view, method, request):
        return ""
