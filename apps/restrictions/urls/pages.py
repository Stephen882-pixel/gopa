from django.urls import path
from rest_framework import routers

from apps.restrictions.views import client, admin

app_name = "pages"
router = routers.SimpleRouter()

router.register(
    r"restriction-access",
    admin.RestrictionAccessPublicView,
    basename="restriction-access",
)
router.register(r"restrictions", admin.RestrictionPublicView, basename="restrictions")
router.register(
    r"notifications", admin.NotificationPublicView, basename="notifications"
)
router.register(r"complaints", admin.ComplaintPublicView, basename="complaints")
router.register(r"policies", admin.PolicyPublicView, basename="policies")
router.register(r"sectors", admin.SectorPublicView, basename="sectors")

urlpatterns = [
    path("home/", client.HomeView.as_view(), name="home"),
] + router.urls
