from django.utils.decorators import method_decorator

from django.db.models import Q
from apps.bones import swagger as sg
from apps.bones.drf import SFModelViewSet
from apps.bones.drf.permissions import IsSecured, CRUDPermission
from apps.restrictions.serializers.admin import (
    DTCommitmentLineSerializer,
    DTCommitmentSerializer,
    Commitment,
    CommitmentLine,
    CommitmentLineSerializer,
    CommitmentLineViewSerializer,
    CommitmentSerializer,
)

SEARCH_FIELDS = ["label", "description"]


class CommitmentCRUDPermission(CRUDPermission):
    syntax = "restrictions.%s_commitment"


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Commitments",
        schema=DTCommitmentSerializer,
        has_validation=False,
        operation_summary="a paginated view for the commitments made",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Commitments",
        schema=CommitmentSerializer,
        status=201,
        operation_summary="add a new commitment",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Commitments",
        schema=CommitmentSerializer,
        has_validation=False,
        operation_summary="fetch the commitment using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Commitments",
        schema=CommitmentSerializer,
        operation_summary="update the commitment using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Commitments",
        schema=CommitmentSerializer,
        operation_summary="update the commitment using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Commitments",
        status=204,
        has_validation=False,
        operation_summary="delete the commitment using the specified index",
    ),
)
class CommitmentView(SFModelViewSet):
    permission_classes = [IsSecured & CommitmentCRUDPermission]
    serializer_class = CommitmentSerializer
    queryset = Commitment.objects.all()
    search_fields = SEARCH_FIELDS
    ordering_fields = SEARCH_FIELDS + ["created_on"]


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Commitment Lines",
        schema=DTCommitmentLineSerializer,
        has_validation=False,
        operation_summary="a paginated view for the commitment lines",
    ),
)
@method_decorator(
    name="create",
    decorator=sg.decorator(
        tag="Commitment Lines",
        schema=CommitmentLineSerializer,
        status=201,
        operation_summary="add a new commitment line",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Commitment Lines",
        schema=CommitmentLineViewSerializer,
        has_validation=False,
        operation_summary="fetch the commitment line using the specified index",
    ),
)
@method_decorator(
    name="update",
    decorator=sg.decorator(
        tag="Commitment Lines",
        schema=CommitmentLineSerializer,
        operation_summary="update the commitment line using the specified index (partial = False)",
    ),
)
@method_decorator(
    name="partial_update",
    decorator=sg.decorator(
        tag="Commitment Lines",
        schema=CommitmentLineSerializer,
        operation_summary="update the commitment line using the specified index (partial = True)",
    ),
)
@method_decorator(
    name="destroy",
    decorator=sg.decorator(
        tag="Commitment Lines",
        status=204,
        has_validation=False,
        operation_summary="delete the commitment line using the specified index",
    ),
)
class CommitmentLineView(SFModelViewSet):
    permission_classes = [IsSecured & CommitmentCRUDPermission]
    search_fields = ["country__name", "sector__label_i18n", "value"]

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return CommitmentLineSerializer
        return CommitmentLineViewSerializer

    def get_queryset(self):
        index = self.request.GET.get("index", False)
        domain = Q(commitment_id=index)
        iso = self.request.GET.get("iso", False)
        if iso and "all" != iso:
            domain &= Q(country__iso=iso)
        return CommitmentLine.objects.filter(domain)
