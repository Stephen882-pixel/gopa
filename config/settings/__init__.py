################################################################################
# Consolidate all the imports
################################################################################

from .common import *
from .environment import *

# API Rate limits
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["anon"] = env.str(
    "ANON_THROTTLE_RATE", "30/minute"
)
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["user"] = env.str(
    "USER_THROTTLE_RATE", "50/minute"
)

# Redis
REDIS_SERVER = env.str("REDIS_SERVER", False)
if REDIS_SERVER:
    CACHES["default"]["LOCATION"] = f"{REDIS_SERVER}/2"
else:
    # https://docs.djangoproject.com/en/4.2/topics/cache/#creating-the-cache-table
    # python manage.py createcachetable
    CACHES["default"]["BACKEND"] = "django.core.cache.backends.db.DatabaseCache"
    CACHES["default"]["LOCATION"] = "django_cache_table"
