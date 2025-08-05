from django.contrib.auth.models import Group
from django.utils.decorators import method_decorator

from apps.bones import swagger as sg
from apps.bones.drf import SFModelViewSet
from apps.bones.drf.permissions import IsSecured, IsSuperUser
from apps.core.serializers import DTGroupSerializer, GroupSerializer


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Group",
        schema=DTGroupSerializer,
        has_validation=False,
        operation_summary="a paginated view for the user groups within the app",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Group",
        schema=GroupSerializer,
        status=201,
        operation_summary="add a new user group",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Group",
        schema=GroupSerializer,
        has_validation=False,
        operation_summary="fetch user group information using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Group",
        schema=GroupSerializer,
        operation_summary="update user group information using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Group",
        schema=GroupSerializer,
        operation_summary="update user group information using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Group",
        status=204,
        has_validation=False,
        operation_summary="delete a user group using the specified index",
    ),
)
class GroupView(SFModelViewSet):
    permission_classes = [IsSecured & IsSuperUser]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    search_fields = ["name"]
