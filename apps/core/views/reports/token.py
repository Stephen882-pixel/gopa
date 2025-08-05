from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf.permissions import IsAuthorized
from apps.core.serializers import ReportTokenSerializer


class ReportTokenView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Reports"],
        operation_summary="Retrieve the metabase report URL",
        request_body=ReportTokenSerializer,
        responses=sg.response(
            description="The Report URL",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"url": openapi.Schema(type=openapi.TYPE_STRING)},
            ),
            has_validation=True,
        ),
    )
    def post(self, req: Request) -> Response:
        return Response({"url": ReportTokenSerializer(data=req.data).is_valid()})
