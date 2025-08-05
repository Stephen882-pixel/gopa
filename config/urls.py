"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from apps.core.views import schema_view

handler400 = "apps.core.views.error_400"
handler404 = "apps.spa.views.error_404"
handler500 = "apps.core.views.error_500"

urlpatterns = [
    
    
    path("api/cache/", include("apps.core.urls.cache")),
    path("api/auth/", include("apps.core.urls.auth")),
    path("api/report/", include("apps.core.urls.report")),
    path("api/profile/", include("apps.core.urls.profile")),
    path("api/restrictions/", include("apps.restrictions.urls.admin")),
    path("api/cms/", include("apps.core.urls.cms")),
]

if settings.DEBUG:
    # Enable the API docs url in the development server
    urlpatterns.append(
        path(
            "api/docs/",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="swagger-ui",
        )
    )
    # Enable the Media URL's in the Django Development Server
    # https://djangocentral.com/managing-media-files-in-django/
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
