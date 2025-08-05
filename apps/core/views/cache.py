from countries_plus.models import Country
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf.permissions import IsAuthorized
from apps.core.models import DISPLAY_TYPES
from apps.core.serializers import StateSerializer
from apps.restrictions import models


class TokenView(APIView):

    @swagger_auto_schema(
        security=[],
        tags=["Cache"],
        operation_summary=(
            "Retrieve the api state and/or refresh the JWT used by all "
            "secured requests"
        ),
        responses=sg.response(
            description="The API state",
            schema=StateSerializer,
            has_validation=False,
            has_auth=False,
        ),
    )
    def get(self, req: Request) -> Response:
        req.session.modified = True
        return Response(StateSerializer.get_state(req))


class ConstantsView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Cache"],
        operation_summary="Get the list of constants used within the react app",
        responses=sg.response(
            description="The API state",
            has_validation=False,
            schema=openapi.Schema(type=openapi.TYPE_OBJECT),
        ),
    )
    def get(self, req: Request) -> Response:
        return Response(self.get_constants())

    @classmethod
    def get_constants(cls):
        return {
            "countries": [c for c in cls.get_countries()],
            "restrictionTypes": cls.get_list(models.RESTRICTION_TYPE),
            "nonComplianceTypes": cls.get_list(models.NON_COMPLIANCE),
            "modeOfSupply": cls.get_list(models.MODE_OF_SUPPLY),
            "discriminativeList": cls.get_list(models.NATIONAL_TREATMENT),
            "typeOfMeasureList": cls.get_list(models.TYPE_OF_MEASURE_CODE),
            "yesNo": cls.get_list(models.YES_NO),
            "notificationStatus": cls.get_list(models.NOTIFICATION_STATUS),
            "complaintTypes": cls.get_list(models.COMPLAINT_TYPE),
            "complaintStatus": cls.get_list(models.COMPLAINT_STATUS),
            "restrictionStatus": cls.get_list(models.RESTRICTION_STATUS),
            "reportDisplayTypes": cls.get_list(DISPLAY_TYPES),
        }

    @staticmethod
    def get_list(CONST):
        return [{"slug": s[0], "label": str(s[1])} for s in CONST]

    @staticmethod
    def get_countries():
        keys = ["BI", "CD", "KE", "RW", "SO", "SS", "TZ", "UG"]
        for co in Country.objects.filter(iso__in=keys).order_by("name"):
            yield {
                "slug": co.iso,
                "label": co.name,
                "capital": co.capital,
                "currency": {
                    "name": co.currency_name,
                    "code": co.currency_code,
                    "symbol": co.currency_symbol,
                },
            }
