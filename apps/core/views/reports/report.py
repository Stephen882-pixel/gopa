from django.utils.decorators import method_decorator
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.core.models import Report
from apps.core.serializers import (
    DTReportSerializer,
    ReportFeatureSerializer,
    ReportSerializer,
    ReportViewSerializer,
)

SEARCH_FIELDS = ["display_type", "label_i18n", "brief_i18n"]


class ReportCRUDPermission(CRUDPermission):
    syntax = "core.%s_report"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Reports",
        schema=DTReportSerializer,
        has_validation=False,
        operation_summary="a paginated view of the reports within the app",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Reports",
        schema=ReportSerializer,
        status=201,
        operation_summary="add a new report",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Reports",
        schema=ReportViewSerializer,
        has_validation=False,
        operation_summary="fetch the report using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Reports",
        schema=ReportSerializer,
        operation_summary="update the report using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Reports",
        schema=ReportSerializer,
        operation_summary="update the report using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Reports",
        status=204,
        has_validation=False,
        operation_summary="delete the report using the specified index",
    ),
)
@method_decorator(
    name="feature",
    decorator=sg.decorator(
        tag="Reports",
        schema=ReportViewSerializer(many=True),
        has_validation=False,
        operation_summary="Define the featured reports to display on the dashboard",
    ),
)
class ReportView(SFModelViewSet):
    permission_classes = [IsSecured & ReportCRUDPermission]
    search_fields = SEARCH_FIELDS
    queryset = Report.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return ReportSerializer
        return ReportViewSerializer

    @action(detail=False, methods=["POST"])
    def feature(self, req: Request = None) -> Response:
        return Response(ReportFeatureSerializer(data=req.data).save())


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTReportSerializer,
        has_validation=False,
        operation_summary="a paginated view of the reports within the app",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Pages",
        schema=ReportViewSerializer,
        has_validation=False,
        operation_summary="fetch the report using the specified index",
    ),
)
@method_decorator(
    name="feature",
    decorator=sg.decorator(
        tag="Pages",
        schema=ReportViewSerializer(many=True),
        has_validation=False,
        operation_summary="Get the featured report to display on the dashboard",
    ),
)
class ReportPublicView(mixins.RetrieveModelMixin, SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS
    queryset = Report.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return ReportSerializer
        return ReportViewSerializer

    @action(detail=False, methods=["GET"])
    def feature(self, req: Request = None) -> Response:
        qs = Report.objects.filter(sequence__isnull=False).order_by("sequence")
        return Response([ReportViewSerializer(feat).data for feat in qs])
