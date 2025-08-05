from rest_framework import routers

from apps.core.views import reports, country

app_name = "pages"
router = routers.SimpleRouter()

router.register(r"report-tags", reports.ReportTagPublicView, basename="report-tags")
router.register(r"reports", reports.ReportPublicView, basename="reports")
router.register(r"countries", country.CountryView, basename="countries")

urlpatterns = [] + router.urls
