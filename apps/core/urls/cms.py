from rest_framework.routers import DefaultRouter
from apps.core.views.cms import CMSPageViewSet
from django.urls import path,include

router = DefaultRouter()
router.register(r'pages', CMSPageViewSet, basename='cms-page')

# urlpatterns = router.urls


urlpatterns = [
    path('',include(router.urls))
]