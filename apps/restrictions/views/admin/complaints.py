from django.db.models import Q
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from rest_framework import mixins
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.bones.drf.serializers import error
from apps.restrictions.serializers.admin import (
    Complaint,
    ComplaintLog,
    ComplaintLogSerializer,
    ComplaintSerializer,
    ComplaintViewSerializer,
    DTComplaintSerializer,
    DTComplaintLogSerializer,
)

SEARCH_FIELDS = [
    "origin_country__name",
    "target_country__name",
    "sector__label_i18n",
    "policy__label_i18n",
    "mode_of_supply_affected",
    "status",
]
LOG_SEARCH_FIELDS = [
    "complaint__description",
    "from_status",
    "to_status",
    "created_on",
    "comments",
]


class ComplaintCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_complaint"
    exclude = ["view", "add", "delete"]


class ComplaintLogCRUDPermission(CRUDPermission):
    syntax = ComplaintCRUDPermission.syntax
    exclude = ["view", "add"]

    def has_permission(self, req: Request, view: APIView) -> bool:
        if "add" != self.get_action(req):
            return self.check_permission(req)
        ref = Complaint.objects.filter(id=req.data.get("complaint", False)).first()
        return False if not ref else ref.has_access(req.user)


class ComplaintQuerysetMixin:
    def get_queryset(self):
        domain = Q()
        iso = self.request.GET.get("iso", False)
        if iso and "all" != iso:
            sdomain = Q(origin_country__iso=iso)
            sdomain |= Q(target_country__iso=iso)
            domain &= sdomain
        sector = self.request.GET.get("sector", "").strip()
        if sector:
            sector = sector.split(",")
            sdomain = Q(sector__slug__in=sector)
            sdomain |= Q(sector__parent__slug__in=sector)
            sdomain |= Q(sector__parent__parent__slug__in=sector)
            domain &= sdomain
        if self.request.user.id and "current" == self.request.GET.get("user", 0):
            domain &= Q(user_id=self.request.user.id)
        elif not self.request.user.is_staff:
            sdomain = Q(status="Resolved")
            if self.request.user.id:
                sdomain |= Q(user_id=self.request.user.id)
            domain &= sdomain
        return Complaint.objects.filter(domain)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Complaints",
        schema=DTComplaintSerializer,
        has_validation=False,
        operation_summary="a paginated view of the complaints within the application",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Complaints",
        schema=ComplaintSerializer,
        status=201,
        operation_summary="add a new complaint",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Complaints",
        schema=ComplaintSerializer,
        has_validation=False,
        operation_summary="fetch the complaint using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Complaints",
        schema=ComplaintSerializer,
        operation_summary="update the complaint using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Complaints",
        schema=ComplaintSerializer,
        operation_summary="update the complaint using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Complaints",
        status=204,
        operation_summary="delete a complaint using the specified index",
    ),
)
class ComplaintView(ComplaintQuerysetMixin, SFModelViewSet):
    permission_classes = [IsSecured & ComplaintCRUDPermission]
    search_fields = SEARCH_FIELDS

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return ComplaintSerializer
        return ComplaintViewSerializer

    def perform_destroy(self, instance):
        can_delete = self.request.user.has_perm(
            ComplaintCRUDPermission.syntax % "delete"
        )
        sms = None
        if self.request.user.is_staff:
            if not can_delete:
                sms = _("One can not delete this record.")
            elif "Rejected" != instance.status:
                sms = _("One can only delete rejected complaints.")
        else:
            if instance.user.id != self.request.user.id:
                sms = _("One can only delete their own complaints.")
            elif "New" != instance.status:
                sms = _("One can only delete new complaints.")
        if sms:
            error(**{"detail": sms})
        instance.delete()


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTComplaintSerializer,
        has_validation=False,
        operation_summary="a paginated view of the complaints within the application",
    ),
)
class ComplaintPublicView(ComplaintQuerysetMixin, SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS
    serializer_class = ComplaintViewSerializer


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Complaint Logs",
        schema=DTComplaintLogSerializer,
        has_validation=False,
        operation_summary="a paginated view of the complaint logs within the application",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Complaint Logs",
        schema=ComplaintLogSerializer,
        status=201,
        operation_summary="add a new complaint log",
    ),
)
class ComplaintLogView(mixins.CreateModelMixin, SFListViewSet):
    permission_classes = [IsSecured & ComplaintLogCRUDPermission]
    serializer_class = ComplaintLogSerializer
    search_fields = LOG_SEARCH_FIELDS
    ordering_fields = ["id"] + LOG_SEARCH_FIELDS

    def get_queryset(self):
        index = self.request.GET.get("index", False)
        return ComplaintLog.objects.filter(complaint_id=index)
