from django.urls import path

from apps.core.views import cache

app_name = "cache"

urlpatterns = [
    path("token/", cache.TokenView.as_view(), name="token"),
    path("constants/", cache.ConstantsView.as_view(), name="constants"),
]
