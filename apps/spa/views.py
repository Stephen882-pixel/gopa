import json

from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from django.shortcuts import render

from apps.core.serializers import StateSerializer


def index(req: WSGIRequest, *args, **kwargs) -> HttpResponse:
    ctx = {
        "DEBUG_MODE": settings.DEBUG,
        "state": json.dumps(StateSerializer.get_state(req)),
    }
    if settings.METABASE_SITE_URL and settings.METABASE_SECRET_KEY:
        ctx["REPORT_URL"] = settings.METABASE_SITE_URL
    return render(req, "spa/react_base.html", context=ctx)


def error_404(request: WSGIRequest, exception: Exception = None) -> HttpResponse:
    return index(request)
