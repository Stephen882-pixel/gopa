from rest_framework import routers

from apps.restrictions.views import admin

app_name = "restriction"
router = routers.SimpleRouter()

router.register(
    r"restriction-access", admin.RestrictionAccessView, basename="restriction-access"
)
router.register(r"notifications", admin.NotificationView, basename="notifications")
router.register(
    r"commitment-lines", admin.CommitmentLineView, basename="commitment-lines"
)
router.register(r"commitments", admin.CommitmentView, basename="commitments")
router.register(r"complaints", admin.ComplaintView, basename="complaints")
router.register(r"complaint-logs", admin.ComplaintLogView, basename="complaint-logs")
router.register(r"policies", admin.PolicyView, basename="policies")
router.register(r"sectors", admin.SectorView, basename="sectors")
router.register(r"updates", admin.RestrictionUpdateView, basename="restriction-updates")
router.register(r"", admin.RestrictionView, basename="restrictions")

urlpatterns = [] + router.urls
