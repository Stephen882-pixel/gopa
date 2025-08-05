from django.utils.decorators import method_decorator
from rest_framework import mixins

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsAuthorized, IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTPolicySerializer,
    Policy,
    PolicySerializer,
)

SEARCH_FIELDS = ["label_i18n", "description_i18n"]


class PolicyCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_policy"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Policy",
        schema=DTPolicySerializer,
        has_validation=False,
        operation_summary="a paginated view for the policies a restriction can have",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Policy",
        schema=PolicySerializer,
        status=201,
        operation_summary="add a new policy",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Policy",
        schema=PolicySerializer,
        has_validation=False,
        operation_summary="fetch the policy using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Policy",
        schema=PolicySerializer,
        operation_summary="update the policy using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Policy",
        schema=PolicySerializer,
        operation_summary="update the policy using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Policy",
        status=204,
        has_validation=False,
        operation_summary="delete the policy using the specified index",
    ),
)
class PolicyView(SFModelViewSet):
    permission_classes = [IsSecured & PolicyCRUDPermission]
    serializer_class = PolicySerializer
    search_fields = SEARCH_FIELDS
    queryset = Policy.objects.all()


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTPolicySerializer,
        has_validation=False,
        operation_summary="a paginated view of the policies a restriction can have",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Pages",
        schema=PolicySerializer,
        has_validation=False,
        operation_summary="fetch the policy using the specified index",
    ),
)
class PolicyPublicView(mixins.RetrieveModelMixin, SFListViewSet):
    permission_classes = [IsAuthorized]
    serializer_class = PolicySerializer
    search_fields = SEARCH_FIELDS
    queryset = Policy.objects.all()
