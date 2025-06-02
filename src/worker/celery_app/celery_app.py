# src/worker/celery_app.py
from celery import Celery

celery = Celery('bkash_disbursement', broker='redis://redis:6379/0')

# Optionally configure celery here
celery.config_from_object('celery_config')

@celery.task
def example_task():
    print('Example task executed!')
