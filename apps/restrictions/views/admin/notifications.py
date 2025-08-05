from django.db.models import Q
from django.utils.decorators import method_decorator

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTNotificationSerializer,
    Notification,
    NotificationSerializer,
    NotificationViewSerializer,
)

SEARCH_FIELDS = [
    "sector__label_i18n",
    "country__name",
    "applicability_i18n",
    "requirement_i18n",
    "status",
]
ORDERING_FIELDS = SEARCH_FIELDS + ["notification_date"]


class NotificationCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_notification"
    exclude = ["view"]


class NotificationQuerySetMixin:
    def get_queryset(self):
        domain = Q()
        iso = self.request.GET.get("iso", "").strip()
        if iso and "all" != iso:
            domain &= Q(country__iso=iso)
        status = self.request.GET.get("status", "").strip()
        if status:
            domain &= Q(status=status)
        return Notification.objects.filter(domain)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Notification",
        schema=DTNotificationSerializer,
        has_validation=False,
        operation_summary="a paginated view for the notifications",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Notification",
        schema=NotificationSerializer,
        status=201,
        operation_summary="add a new notification",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Notification",
        schema=NotificationViewSerializer,
        has_validation=False,
        operation_summary="fetch the notification using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Notification",
        schema=NotificationSerializer,
        operation_summary="update the notification using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Notification",
        schema=NotificationSerializer,
        operation_summary="update the notification using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Notification",
        status=204,
        has_validation=False,
        operation_summary="delete the notification using the specified index",
    ),
)
class NotificationView(NotificationQuerySetMixin, SFModelViewSet):
    permission_classes = [IsSecured & NotificationCRUDPermission]
    search_fields = SEARCH_FIELDS
    ordering_fields = ORDERING_FIELDS
    queryset = Notification.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return NotificationSerializer
        return NotificationViewSerializer


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTNotificationSerializer,
        has_validation=False,
        operation_summary="a paginated view of the notifications",
    ),
)
class NotificationPublicView(NotificationQuerySetMixin, SFListViewSet):
    permission_classes = [IsAuthorized]
    search_fields = SEARCH_FIELDS + ["requirement_i18n"]
    ordering_fields = ORDERING_FIELDS + ["requirement_i18n"]
    serializer_class = NotificationViewSerializer
