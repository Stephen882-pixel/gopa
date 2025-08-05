from rest_framework.routers import DefaultRouter
from apps.core.views.cms import CMSPageViewSet

router = DefaultRouter()
router.register(r'pages', CMSPageViewSet, basename='cms-page')

urlpatterns = router.urls
