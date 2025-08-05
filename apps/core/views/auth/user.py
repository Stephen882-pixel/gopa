from django.contrib.auth.models import Group, User
from django.db.models import Q
from django.utils.decorators import method_decorator

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet, SFModelViewSet
from apps.bones.drf.permissions import IsSecured, CRUDPermission
from apps.core.serializers import (
    DTGroupSerializer,
    DTUserSerializer,
    GroupSerializer,
    UserSerializer,
    UserViewSerializer,
)


class UserCRUDPermission(CRUDPermission):
    syntax = "auth.%s_user"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="User",
        schema=DTUserSerializer,
        has_validation=False,
        operation_summary="a paginated view for the users within the app",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="User",
        schema=UserSerializer,
        status=201,
        operation_summary="add a new user",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="User",
        schema=UserSerializer,
        has_validation=False,
        operation_summary="fetch user information using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="User",
        schema=UserSerializer,
        operation_summary="update user information using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="User",
        schema=UserSerializer,
        operation_summary="update user information using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="User",
        status=204,
        has_validation=False,
        operation_summary="delete a user using the specified index",
    ),
)
class UserView(SFModelViewSet):
    permission_classes = [IsSecured & UserCRUDPermission]
    ordering_fields = ["username", "is_active", "last_login"]
    search_fields = ["username"]

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return UserSerializer
        return UserViewSerializer

    def get_queryset(self):
        flag = self.request.GET.get("flag", "staff")
        domain = ~Q(id=self.request.user.id)
        domain &= Q(is_staff=("staff" == flag))
        return User.objects.filter(domain)

    def perform_create(self, serializer):
        serializer.save()
        serializer.instance.profile.send_activation_email(self.request)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="User",
        schema=DTGroupSerializer,
        has_validation=False,
        operation_summary="Allow one the one editing the users to be able to view the group list",
    ),
)
class UserGroupView(SFListViewSet):
    permission_classes = [IsSecured & UserCRUDPermission]
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    search_fields = ["name"]
