from django.db.models import Q
from django.utils.decorators import method_decorator
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTSectorSerializer,
    Sector,
    SectorSerializer,
    SectorViewSerializer,
)

SEARCH_FIELDS = ["label_i18n"]


class SectorCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_sector"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Restriction Sector",
        schema=DTSectorSerializer,
        has_validation=False,
        operation_summary="a paginated view for the sectors used to categorise a restriction",
    ),
)
# @method_decorator(
#     name="create",
#     decorator=sg.decorator(
#         tag="Restriction Sector",
#         schema=SectorSerializer,
#         operation_summary="add a new sector",
#     ),
# )
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Restriction Sector",
        schema=SectorViewSerializer,
        has_validation=False,
        operation_summary="fetch a sector using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Restriction Sector",
        schema=SectorSerializer,
        operation_summary="update a sector using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Restriction Sector",
        schema=SectorSerializer,
        operation_summary="update a sector using the specified index (partial = True)",
    ),
)
# @method_decorator(
#     name="destroy",
#     decorator=sg.decorator(
#         tag="Restriction Sector",
#         status=204,
#         has_validation=False,
#         operation_summary="delete a sector using the specified index",
#     ),
# )
class SectorView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, SFListViewSet):
    permission_classes = [IsSecured & SectorCRUDPermission]
    search_fields = SEARCH_FIELDS

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return SectorSerializer
        return SectorViewSerializer

    def get_queryset(self):
        try:
            skip = int(self.request.GET.get("skip", False))
            if skip:
                return Sector.objects.filter(~Q(id=skip))
        except ValueError:
            pass
        return Sector.objects.all()


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTSectorSerializer,
        has_validation=False,
        operation_summary="A paginated view of the sectors for the general public",
    ),
)
@method_decorator(
    name="all_sectors",
    decorator=sg.decorator(
        tag="Pages",
        schema=SectorSerializer(many=True),
        has_validation=False,
        operation_summary="All the sectors that have been defined in the application",
    ),
)
class SectorPublicView(SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS
    serializer_class = SectorViewSerializer

    def get_queryset(self):
        domain = {}
        slug = self.request.GET.get("slug", "").strip()
        if slug:
            domain["slug"] = slug
        return Sector.objects.filter(**domain)

    @action(detail=False, methods=["GET"])
    def all_sectors(self, req: Request = None) -> Response:
        data = [
            SectorSerializer(s).as_i18n() for s in Sector.objects.all().order_by("id")
        ]
        return Response(data)
