from django.utils.decorators import method_decorator

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.core.models import ReportTag
from apps.core.serializers import DTReportTagSerializer, ReportTagSerializer

SEARCH_FIELDS = ["label_i18n"]


class ReportTagCRUDPermission(CRUDPermission):
    syntax = "core.%s_reporttag"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Report Tags",
        schema=DTReportTagSerializer,
        has_validation=False,
        operation_summary="a paginated view of the report tags a report can have",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Report Tags",
        schema=ReportTagSerializer,
        status=201,
        operation_summary="add a new report tag",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Report Tags",
        schema=ReportTagSerializer,
        has_validation=False,
        operation_summary="fetch the report tag using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Report Tags",
        schema=ReportTagSerializer,
        operation_summary="update the report tag using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Report Tags",
        schema=ReportTagSerializer,
        operation_summary="update the report tag using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Report Tags",
        status=204,
        has_validation=False,
        operation_summary="delete the report tag using the specified index",
    ),
)
class ReportTagView(SFModelViewSet):
    permission_classes = [IsSecured & ReportTagCRUDPermission]
    search_fields = SEARCH_FIELDS
    serializer_class = ReportTagSerializer
    queryset = ReportTag.objects.all()


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTReportTagSerializer,
        has_validation=False,
        operation_summary="a paginated view of the report tags a report can have",
    ),
)
class ReportTagPublicView(SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS
    serializer_class = ReportTagSerializer
    queryset = ReportTag.objects.all()
