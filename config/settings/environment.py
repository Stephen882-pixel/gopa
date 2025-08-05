"""
House configuration that makes use of django-environ module
"""

import environ

env = environ.Env()


# Metabase Integration
METABASE_SITE_URL = env.str("METABASE_SITE_URL", default=False)
METABASE_SECRET_KEY = env.str("METABASE_SECRET_KEY", default=False)


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

if env.str("DATABASE_URL", default=False):
    DATABASES = {"default": env.db("DATABASE_URL")}


# Email
# https://docs.djangoproject.com/en/4.2/ref/settings/#email-backend

email_config = env.email_url("EMAIL_URL", default="smtp://user:password@localhost:25")
EMAIL_BACKEND = email_config.get(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = email_config.get("EMAIL_HOST", "127.0.0.1")
EMAIL_PORT = email_config.get("EMAIL_PORT", 25)
EMAIL_HOST_USER = email_config.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = email_config.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = email_config.get("EMAIL_USE_TLS", False)
EMAIL_TIMEOUT = env.int("EMAIL_TIMEOUT", default=60)


# Items used to identify the setup
ORGANISATION_NAME = env.str("ORGANISATION_NAME", default="My Organisation")
ORGANISATION_EMAIL = env.str("ORGANISATION_EMAIL", default="info@example.com")


################################################################################
# Some production settings
################################################################################

# Set the application timezone
TIME_ZONE = env.str("TIME_ZONE", default="Africa/Nairobi")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY", default="django-secure-key")

# The url allowed to serve the application
ALLOWED_HOSTS = [
    h.strip()
    for h in env.str("ALLOWED_HOSTS", default="").split(",")
    if h and h.strip()
]
CSRF_TRUSTED_ORIGINS = [
    h.strip()
    for h in env.str("CSRF_TRUSTED_ORIGINS", default="").split(",")
    if h and h.strip()
]
CORS_ALLOWED_ORIGINS = [
    h.strip()
    for h in env.str("CORS_ALLOWED_ORIGINS", default="").split(",")
    if h and h.strip()
]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=True)

# Redirects all non-HTTPS requests to HTTPS
SECURE_SSL_REDIRECT = env.bool("SSL_ENABLED", default=False)

# If your entire site is served only over SSL, you may want to consider setting
# a value and enabling HTTP Strict Transport Security. If set to a non-zero
# integer value, the SecurityMiddleware sets the HTTP Strict Transport Security
# header on all responses that do not already have it.
SECURE_HSTS_SECONDS = (
    env.int("SECURE_HSTS_SECONDS", default=31536000) if SECURE_SSL_REDIRECT else 0
)

# Ensure that the csrf and language cookies are sent under an HTTPS connection.
CSRF_COOKIE_SECURE = SECURE_SSL_REDIRECT
LANGUAGE_COOKIE_SECURE = SECURE_SSL_REDIRECT

# Ensure that the session cookie is only sent under an HTTPS connection.
SESSION_COOKIE_SECURE = SECURE_SSL_REDIRECT

# Specify the duration of a given session
SESSION_COOKIE_AGE = env.int("SESSION_COOKIE_AGE", default=3607)
