from django.urls import path
from rest_framework import routers

from apps.core.views import reports

app_name = "report"
router = routers.SimpleRouter()

router.register(r"report-tags", reports.ReportTagView, basename="report-tags")
router.register(r"reports", reports.ReportView, basename="reports")

urlpatterns = [
    path("token/", reports.ReportTokenView.as_view(), name="token"),
] + router.urls
