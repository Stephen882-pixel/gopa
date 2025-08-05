from datetime import datetime

from django.db.models import Q
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.response import Response

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTRestrictionSerializer,
    DTRestrictionUpdateSerializer,
    Restriction,
    RestrictionUpdate,
    RestrictionSerializer,
    RestrictionViewSerializer,
    RestrictionUpdateSerializer,
)

SEARCH_FIELDS = [
    "sector__label_i18n",
    "country__name",
    "restriction_type",
    "type_of_measure_i18n",
]
LOG_SEARCH_FIELDS = [
    "restriction__type_of_measure",
    "created_on",
    "details",
    "remarks",
]


class RestrictionCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_restriction"


class RestrictionUpdateCRUDPermission(CRUDPermission):
    syntax = RestrictionCRUDPermission.syntax


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Restrictions",
        schema=DTRestrictionSerializer,
        has_validation=False,
        operation_summary="a paginated view for the restrictions",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Restrictions",
        schema=RestrictionViewSerializer,
        operation_summary="add a new restriction",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Restrictions",
        schema=RestrictionViewSerializer,
        has_validation=False,
        operation_summary="fetch a restriction using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Restrictions",
        schema=RestrictionSerializer,
        operation_summary="update a restriction using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Restrictions",
        schema=RestrictionSerializer,
        operation_summary="update a restriction using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Restrictions",
        status=204,
        has_validation=False,
        operation_summary="delete a restriction using the specified index",
    ),
)
class RestrictionView(SFModelViewSet):
    permission_classes = [IsSecured & RestrictionCRUDPermission]
    search_fields = SEARCH_FIELDS

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return RestrictionSerializer
        return RestrictionViewSerializer

    def get_queryset(self):
        domain = Q()
        flag = self.request.GET.get("flag", False)
        if flag:
            domain &= Q(deleted=("archived" == flag))
        iso = self.request.GET.get("iso", False)
        if iso and "all" != iso:
            domain &= Q(country__iso=iso)
        return Restriction.objects.filter(domain)

    def destroy(self, request, *args, **kwargs):
        self.get_object().archive(self.request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTRestrictionSerializer,
        has_validation=False,
        operation_summary="A paginated view of the restrictions for the general public",
    ),
)
class RestrictionPublicView(SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS
    serializer_class = RestrictionViewSerializer

    def get_queryset(self):
        domain = Q(deleted=False)
        iso = self.request.GET.get("iso", False)
        if iso and "all" != iso:
            domain &= Q(country__iso=iso)
        slug = self.request.GET.get("slug", "").strip()
        if slug:
            domain &= Q(slug=slug)
        sector = self.request.GET.get("sector", "").strip()
        if sector:
            sector = sector.split(",")
            sdomain = Q(sector__slug__in=sector)
            sdomain |= Q(sector__parent__slug__in=sector)
            sdomain |= Q(sector__parent__parent__slug__in=sector)
            domain &= sdomain
        return Restriction.objects.filter(domain)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Restriction Updates",
        schema=DTRestrictionUpdateSerializer,
        has_validation=False,
        operation_summary="a paginated view of the restriction updates within the application",
    ),
)
class RestrictionUpdateView(SFListViewSet):
    permission_classes = [IsSecured & RestrictionUpdateCRUDPermission]
    serializer_class = RestrictionUpdateSerializer
    search_fields = LOG_SEARCH_FIELDS
    ordering_fields = ["id"] + LOG_SEARCH_FIELDS

    def get_queryset(self):
        index = self.request.GET.get("index", False)
        return RestrictionUpdate.objects.filter(restriction_id=index)
