from drf_yasg.utils import swagger_auto_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf.permissions import IsAuthorized
from apps.restrictions.serializers.pages import HomeSerializer


class HomeView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Pages"],
        operation_id="page_home",
        operation_summary=(
            "The endpoint used to fetch the information needed to show the " "home page"
        ),
        responses=sg.response(
            description="The home page data",
            schema=HomeSerializer,
            has_validation=False,
        ),
    )
    def get(self, req: Request) -> Response:
        return Response(HomeSerializer.instance())
