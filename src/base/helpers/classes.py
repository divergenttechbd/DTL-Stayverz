from decimal import Decimal
import json
from datetime import date, datetime, time
import uuid


class DTEncoder(json.JSONEncoder):
    def default(self, obj):
        # 👇️ if passed in object is datetime object
        # convert it to a string
        if isinstance(obj, datetime):
            return str(obj)
        if isinstance(obj, date):
            return str(obj)
        if isinstance(obj, time):
            return str(obj)
        if isinstance(obj, uuid.UUID):
            return str(obj)
        if isinstance(obj, Decimal):
            return float(obj)
        # 👇️ otherwise use the default behavior
        return json.JSONEncoder.default(self, obj)
