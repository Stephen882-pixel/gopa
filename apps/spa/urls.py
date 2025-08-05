from django.urls import include, path

from apps.core.urls.pages import urlpatterns as core_urls
from apps.restrictions.urls.pages import urlpatterns as restriction_urls
from .views import index

app_name = "spa"

urlpatterns = [
    path("", index, name="home"),
    path("auth/<path:resource>", index, name="auth"),
    path("public/<path:resource>", index, name="public"),
    path("api/pages/", include(core_urls + restriction_urls)),
]
