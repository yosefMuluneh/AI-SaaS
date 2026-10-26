from celery import Celery

from app.core.config import settings

# Upstash requires TLS (rediss://), so configure SSL options if enabled
ssl_options = (
    {"ssl_cert_reqs": None}
    if settings.REDIS_URL and settings.REDIS_URL.startswith("rediss://")
    else None
)

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.intelligence"],  # Registers your background tasks
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    broker_connection_retry_on_startup=True,
    broker_use_ssl=ssl_options,
    redis_backend_use_ssl=ssl_options,
)
