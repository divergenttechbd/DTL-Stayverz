import logging
import logging.config
import sys

logging_config = {
    "version": 1,
    "formatters": {
        "json": {
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(process)s %(levelname)s %(name)s %(module)s %(funcName)s %(lineno)s %(message)s",
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "json",
            "stream": sys.stderr,
        }
    },
    "root": {"level": "WARNING", "handlers": ["console"], "propagate": False},
    "loggers": {
        "my_app": {
            "level": "DEBUG",
            "handlers": ["console"],
            "propagate": False,
        }
    },
}


logging.config.dictConfig(logging_config)
logger = logging.getLogger("my_app")
