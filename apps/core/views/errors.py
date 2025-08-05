from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse


def _error(status: int, title: str, message: str, **kw) -> JsonResponse:
    kw.update({"title": title, "message": message})
    return JsonResponse(kw, status=status)


def error_400(request: WSGIRequest, exception: Exception = None) -> JsonResponse:
    return _error(
        400,
        "Bad Request",
        "Your browser sent a request that this server could not understand",
    )


def error_403(request: WSGIRequest, reason: str = "") -> JsonResponse:
    kw = {}
    if settings.DEBUG:
        kw["reason"] = str(reason)
    return _error(
        403,
        "Access Denied",
        "You do not have permission to view this directory or page using the credentials that you supplied",
        **kw
    )


def error_500(request: WSGIRequest, exception: Exception = None) -> JsonResponse:
    return _error(
        500,
        "Internal Server Error",
        "Sorry, something went wrong. Please try again later",
    )


def empty(request: WSGIRequest) -> JsonResponse:
    return _error(200, "42", "The meaning to life the universe and everything.")
