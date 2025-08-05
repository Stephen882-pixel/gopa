from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf.permissions import IsAuthorized, IsSecured
from apps.core.serializers import (
    LocaleSerializer,
    ProfileCredsSerializer,
    ProfileUpdateSerializer,
    StateSerializer,
)


class ProfileCredsView(APIView):
    permission_classes = [IsSecured]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Profile"],
        operation_id="profile_creds",
        operation_summary="Update the credentials used to log into the portal",
        request_body=ProfileCredsSerializer,
        responses=sg.response(
            description="The API state", schema=StateSerializer, has_validation=True
        ),
    )
    def post(self, req: Request) -> Response:
        serializer = ProfileCredsSerializer(req.user, data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(StateSerializer.get_state(req))


class ProfileUpdateView(APIView):
    permission_classes = [IsSecured | IsAuthorized]
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Profile"],
        operation_id="profile_update",
        operation_summary="Update the profile details associated with the user who has logged in",
        request_body=ProfileUpdateSerializer,
        responses=sg.response(
            description="The API state", schema=StateSerializer, has_validation=True
        ),
    )
    def post(self, req: Request) -> Response:
        if req.user.is_authenticated:
            serializer = ProfileUpdateSerializer(
                req.user.profile, data=req.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
        # from django.views.i18n import set_language
        data = LocaleSerializer(data=req.data).get_state(req)
        res = Response(data)
        res.set_cookie(
            settings.LANGUAGE_COOKIE_NAME,
            data["profile"]["locale"],
            max_age=settings.LANGUAGE_COOKIE_AGE,
            path=settings.LANGUAGE_COOKIE_PATH,
            domain=settings.LANGUAGE_COOKIE_DOMAIN,
            secure=settings.LANGUAGE_COOKIE_SECURE,
            httponly=settings.LANGUAGE_COOKIE_HTTPONLY,
            samesite=settings.LANGUAGE_COOKIE_SAMESITE,
        )
        return res
