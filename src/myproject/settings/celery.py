import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")

celery_app = Celery("myproject")

celery_app.config_from_object("django.conf:settings", namespace="CELERY")

celery_app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

celery_app.conf.beat_schedule = {
    'check-for-post-booking-notifications-daily': {
        'task': 'notifications.tasks.check_and_send_post_booking_notifications_periodic',
        'schedule': crontab(hour='3', minute='30'),
    },
    'assess-superhost-statuses-quarterly': {
        'task': 'achievements.tasks.assess_and_log_quarterly_superhost_status',
        'schedule': crontab(day_of_month='1', month_of_year='1,4,7,10', hour=2, minute=0),
    },
}
celery_app.conf.timezone = settings.TIME_ZONE
