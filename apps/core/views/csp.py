import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet
from apps.bones.drf.permissions import IsSecured, IsSuperUser
from apps.core.models import CSP
from apps.core.serializers import CSPSerializer, DTCSPSerializer


@csrf_exempt
def csp_report_view(request):
    report = json.loads(request.body)["csp-report"]
    kwargs = {}
    kmap = {
        "document_uri": "document-uri",
        "referrer": "referrer",
        "violated_directive": "violated-directive",
        "effective_directive": "effective-directive",
        "original_policy": "original-policy",
        "blocked_uri": "blocked-uri",
        "line_number": "line-number",
        "column_number": "column-number",
        "source_file": "source-file",
        "status_code": "status-code",
    }
    for key, val in kmap.items():
        kwargs[key] = None if val not in report else report[val]
    CSP.objects.create(**kwargs)
    return JsonResponse(report)


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="CSP",
        schema=DTCSPSerializer,
        has_validation=False,
        operation_summary="a paginated view of the CSP violations",
    ),
)
class CSPView(SFListViewSet):
    permission_classes = [IsSecured & IsSuperUser]
    serializer_class = CSPSerializer
    queryset = CSP.objects.all()
