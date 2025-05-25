import json
import logging
from json import JSONDecodeError
from urllib.parse import parse_qs
from decimal import Decimal  # Import Decimal
from datetime import date, datetime  # Import date and datetime

logger = logging.getLogger(__name__)  # It's good practice to name your logger, e.g., __name__ or a custom name


# Custom default function to handle non-serializable types for JSON
def json_log_serializer(obj):
    """JSON serializer for objects not serializable by default json code, for logging."""
    if isinstance(obj, Decimal):
        return str(obj)  # Convert Decimal to string
    if isinstance(obj, (datetime, date)):  # Handle date/datetime objects
        return obj.isoformat()  # Convert to ISO 8601 string format

    raise TypeError(f"Type {type(obj)} not serializable for JSON logging")


class RequestResponseLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # --- Log Request ---
        request_log_data = {
            'method': request.method,
            'headers': dict(request.headers),  # Be cautious logging all headers in production (sensitive info)
            'query_params': dict(request.GET),
            'path': request.path,  # Original path
            'full_path': request.get_full_path(),  # Path with query params
        }

        # Your endpoint naming logic
        # path_identifier = str(request.get_full_path()).replace(
        #     '/api/v1.0/', '').replace('/', '-').upper() # Assuming v1.0, adjust if needed
        # request_log_data['requested_endpoint_identifier'] = path_identifier

        if request.body:
            try:
                # Try to decode as UTF-8 first, then handle potential binary data or other encodings
                decoded_body = request.body.decode('utf-8')
                if 'application/json' in request.content_type:
                    request_log_data['request_body'] = json.loads(decoded_body)
                elif 'application/x-www-form-urlencoded' in request.content_type:
                    request_log_data['request_body'] = parse_qs(decoded_body)
                else:
                    # For other content types or if unsure, log a snippet or type
                    request_log_data['request_body_preview'] = decoded_body[:250] + (
                        '...' if len(decoded_body) > 250 else '')
                    request_log_data['request_content_type'] = request.content_type
            except UnicodeDecodeError:
                request_log_data['request_body'] = "[Binary data or undecodable body]"
            except JSONDecodeError:  # If content_type was json but body was malformed
                request_log_data['request_body'] = "[Malformed JSON body]"
            except Exception as e:  # Catch-all for other parsing issues
                request_log_data['request_body'] = f"[Error parsing request body: {e}]"

        # Log request information (using the custom serializer for safety, though less likely needed for request parts)
        # try:
        #     logger.info(f"Request: {json.dumps(request_log_data, default=json_log_serializer)}")
        # except Exception as e:
        #     logger.error(f"Error logging request details: {e}")

        # --- Get Response ---
        response = self.get_response(request)

        # --- Log Response ---
        response_log_data = {
            'status_code': response.status_code,
            # You can add response headers if needed: 'response_headers': dict(response.headers),
        }

        # Add request details to the response log entry for context
        response_log_data.update(
            request_log_data)  # Merge request data for a complete log entry per request-response cycle

        # response.data is specific to DRF Response objects and contains parsed data (with Decimals, etc.)
        if hasattr(response, 'data') and response.data is not None:
            response_log_data['response_payload'] = response.data
        elif response.content:  # For non-DRF or if .data is not available
            try:
                decoded_response_content = response.content.decode('utf-8')
                if 'application/json' in response.get('Content-Type', ''):
                    response_log_data['response_content_parsed'] = json.loads(decoded_response_content)
                else:
                    response_log_data['response_content_preview'] = decoded_response_content[:250] + (
                        '...' if len(decoded_response_content) > 250 else '')
            except (UnicodeDecodeError, JSONDecodeError):
                response_log_data['response_content'] = "[Binary or undecodable/malformed response content]"
            except Exception as e:
                response_log_data['response_content'] = f"[Error parsing response content: {e}]"

        # Log based on status code
        log_message_json = ""
        try:
            log_message_json = json.dumps(response_log_data, default=json_log_serializer,
                                          indent=2)  # Added indent for readability if logged to console/file
        except Exception as e:
            logger.error(
                f"CRITICAL: Could not serialize log message for path {request.path}. Error: {e}. Partial data: { {k: str(v)[:100] for k, v in response_log_data.items()} }")  # Log a snippet
            return response  # Return original response even if logging fails

        if response.status_code // 100 == 5:  # Server errors
            logger.error(log_message_json)
        elif response.status_code // 100 == 4:  # Client errors
            logger.warning(log_message_json)  # Or logger.info, depending on verbosity preference
        else:  # Successful responses (2xx, 3xx)
            logger.info(log_message_json)

        return response
