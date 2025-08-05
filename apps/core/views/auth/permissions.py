from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.utils.decorators import method_decorator
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet
from apps.bones.drf.permissions import IsSecured, IsSuperUser
from apps.core.serializers import (
    DTPermissionSerializer,
    PermissionSerializer,
)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Permission",
        schema=DTPermissionSerializer,
        has_validation=False,
        operation_summary="a paginated view for the permissions within the app",
    ),
)
@method_decorator(
    name="available",
    decorator=sg.decorator(
        tag="Permission",
        schema=PermissionSerializer(many=True),
        has_validation=False,
        operation_summary="Get the list of permissions to display on the group editor",
    ),
)
class PermissionView(SFListViewSet):
    permission_classes = [IsSecured & IsSuperUser]
    serializer_class = PermissionSerializer
    queryset = Permission.objects.all()
    search_fields = ["model", "app_label"]

    @action(detail=False, methods=["GET"])
    def available(self, req: Request = None) -> Response:
        domain = (
            Q(app_label="auth", model="user")
            | Q(app_label="core", model__in=["report", "reporttag"])
            | Q(
                app_label="restrictions",
                model__in=[
                    "sector",
                    "complaint",
                    "policy",
                    "restrictionaccess",
                    "restriction",
                    "commitment",
                    "notification",
                ],
            )
        )
        domain = Q(
            content_type_id__in=[x.id for x in ContentType.objects.filter(domain)]
        )
        keys = {}
        for p in Permission.objects.filter(domain).order_by("id"):
            if not keys.get(p.content_type_id, False):
                keys[p.content_type_id] = " ".join(p.name.title().split(" ")[2:])
        res = {}
        for p in Permission.objects.filter(domain).order_by("-id"):
            s = keys[p.content_type_id]
            if s in res:
                res[s].append(PermissionSerializer(p).data)
            else:
                res[s] = [PermissionSerializer(p).data]
        return Response(res)
