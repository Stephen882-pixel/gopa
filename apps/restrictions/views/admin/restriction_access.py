from django.utils.decorators import method_decorator

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTRestrictionAccessSerializer,
    RestrictionAccess,
    RestrictionAccessSerializer,
)

SEARCH_FIELDS = ["label_i18n", "description_i18n"]


class RestrictionAccessCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_restrictionaccess"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Restriction Access",
        schema=DTRestrictionAccessSerializer,
        has_validation=False,
        operation_summary="a paginated view of the restrictions on market access",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Restriction Access",
        schema=RestrictionAccessSerializer,
        status=201,
        operation_summary="add a new access restriction",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Restriction Access",
        schema=RestrictionAccessSerializer,
        has_validation=False,
        operation_summary="fetch the access restriction using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Restriction Access",
        schema=RestrictionAccessSerializer,
        operation_summary="update the access restriction using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Restriction Access",
        schema=RestrictionAccessSerializer,
        operation_summary="update the access restriction using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Restriction Access",
        status=204,
        has_validation=False,
        operation_summary="delete the access restriction using the specified index",
    ),
)
class RestrictionAccessView(SFModelViewSet):
    permission_classes = [IsSecured & RestrictionAccessCRUDPermission]
    serializer_class = RestrictionAccessSerializer
    search_fields = SEARCH_FIELDS
    queryset = RestrictionAccess.objects.all()


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTRestrictionAccessSerializer,
        has_validation=False,
        operation_summary="a paginated view of the restrictions on market access",
    ),
)
class RestrictionAccessPublicView(SFListViewSet):
    permission_classes = [IsAuthorized]
    serializer_class = RestrictionAccessSerializer
    search_fields = SEARCH_FIELDS
    queryset = RestrictionAccess.objects.all()
