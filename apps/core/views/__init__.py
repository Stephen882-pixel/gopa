from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from .errors import error_400, error_403, error_500, empty

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version="v1",
        # description="Test description",
        # terms_of_service="https://www.google.com/policies/terms/",
        # contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(
            name="BSD 3-clause License",
            url="https://www.tldrlegal.com/license/bsd-3-clause-license-revised",
        ),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)
