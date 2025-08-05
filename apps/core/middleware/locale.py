from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils import translation


class LocaleMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Get the locale
        locale = request.COOKIES.get(
            settings.LANGUAGE_COOKIE_NAME,
            translation.get_language_from_request(request),
        )
        if (
            hasattr(request, "user")
            and request.user.is_authenticated
            and request.user.profile
            and "default" != request.user.profile.locale
        ):
            locale = request.user.profile.locale or locale
        # Activate the translation
        translation.activate(locale)
        request.LANGUAGE_CODE = translation.get_language()
        # Return the response
        return self.get_response(request)
