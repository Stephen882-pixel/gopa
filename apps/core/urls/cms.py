from rest_framework.routers import DefaultRouter
from django.urls import path, include
from apps.core.views.cms import CMSPageViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'pages', CMSPageViewSet, basename='cms-page')

# URL patterns include both router URLs and any additional custom URLs
urlpatterns = [
    # Include all router URLs
    path('', include(router.urls)),
]

# The router automatically creates the following URLs:
# GET    /api/cms/pages/                    - List all pages (with permissions)
# POST   /api/cms/pages/                    - Create a new page
# GET    /api/cms/pages/{slug}/             - Retrieve a specific page
# PUT    /api/cms/pages/{slug}/             - Update a specific page
# PATCH  /api/cms/pages/{slug}/             - Partially update a specific page
# DELETE /api/cms/pages/{slug}/             - Delete a specific page
#
# Custom action URLs:
# GET    /api/cms/pages/my_pages/           - Get current user's pages
# GET    /api/cms/pages/drafts/             - Get unpublished pages
# GET    /api/cms/pages/public/             - Get published pages (public access)
# GET    /api/cms/pages/stats/              - Get CMS statistics
# POST   /api/cms/pages/{slug}/publish/     - Publish a page
# POST   /api/cms/pages/{slug}/unpublish/   - Unpublish a page
