from django.contrib.auth import login, logout
from django.utils.translation import gettext_lazy as _
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.bones import swagger as sg
from apps.bones.drf.permissions import IsAuthorized, IsSecured, IsSuperUser
from apps.core import serializers
from apps.core.serializers import (
    LoginSerializer,
    RegisterClientSerializer,
    RegisterConfirmSerializer,
    RegisterResetSerializer,
    StateSerializer,
    SessionSerializer,
    DTSessionSerializer
)
from apps.bones.drf import SFListViewSet, SFModelViewSet,SFPageNumberPagination

from django.contrib.sessions.models import Session
from rest_framework.pagination import PageNumberPagination
from django.utils.decorators import method_decorator




class LoginView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Auth"],
        operation_id="auth_login",
        operation_summary="Use this endpoint to log into the application",
        request_body=LoginSerializer,
        responses=sg.response(
            description="The API state", schema=StateSerializer, has_validation=True
        ),
    )
    def post(self, req: Request) -> Response:
        user = LoginSerializer(data=req.data).is_valid()
        if user is None or not user.is_active:
            raise ValidationError({"error": _("The credentials supplied are invalid.")})
        if user.profile.activation_code is not None:
            raise ValidationError(
                {"error": _("Complete the registration process to use this account.")}
            )
        login(req, user)
        return Response(StateSerializer.get_state(req))


class LogoutView(APIView):
    permission_classes = [IsSecured]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Auth"],
        operation_id="auth_logout",
        operation_summary="Use this endpoint to log out of the application",
        responses=sg.response(description="The API state", schema=StateSerializer),
    )
    def post(self, req: Request) -> Response:
        logout(req)
        return Response(StateSerializer.get_state(req))


class RegisterResetView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Auth"],
        operation_id="auth_register_reset",
        operation_summary="Use this endpoint to send the password reset link",
        request_body=RegisterResetSerializer,
        responses=sg.response(
            description="The API state",
            has_validation=True,
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"detail": openapi.Schema(type=openapi.TYPE_STRING)},
            ),
        ),
    )
    def post(self, req: Request) -> Response:
        user = RegisterResetSerializer(data=req.data).is_valid(raise_exception=True)
        user.profile.send_reset_email(req)
        return Response({"detail": "success"})


class RegisterClientView(APIView):
    permission_classes = [IsSuperUser]
    

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Auth"],
        operation_id="auth_register_client",
        operation_summary="Use this endpoint to initiate the registration process of a client account",
        request_body=RegisterClientSerializer,
        responses=sg.response(
            description="The API state",
            has_validation=True,
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"detail": openapi.Schema(type=openapi.TYPE_STRING)},
            ),
        ),
    )
    def post(self, req: Request) -> Response:
        serializer = RegisterClientSerializer(data=req.data)
        serializer.is_valid(raise_exception=True)
        serializer.save().profile.send_activation_email(req)
        return Response({"detail": "success"})


class RegisterConfirmView(APIView):
    permission_classes = [IsAuthorized]

    @swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=["Auth"],
        operation_id="auth_register_confirm",
        operation_summary="Use this endpoint to complete the registration process",
        request_body=RegisterConfirmSerializer,
        responses=sg.response(
            description="The API state", schema=StateSerializer, has_validation=True
        ),
    )
    def post(self, req: Request) -> Response:
        user = RegisterConfirmSerializer(data=req.data).is_valid()
        login(req, user)
        return Response(StateSerializer.get_state(req))
    




# @method_decorator(
#     name="list",
#     decorator=sg.decorator(
#         tag="Pages",
#         schema=DTSessionSerializer,
#         has_validation=False,
#         operation_summary="a paginated view of the report tags a report can have",
#     ),
# )
class SessionListView(APIView):
    permission_classes = [IsAuthorized]
    search_fields = ["session_key", "expire_date"]
    serializer_class = SessionSerializer
    queryset = Session.objects.all()


    # @swagger_auto_schema(
    #     security=[{"Bearer": []}],
    #     tags=["Auth"],
    #     operation_id="auth_session_list",
    #     operation_summary="List all active sessions for the authenticated user",
    #     responses = "List of active sessions", schema=SessionSerializer
    # )
    def get(self, request: Request) -> Response:
        qs = Session.objects.all().order_by('-expire_date')
        paginator = SFPageNumberPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = SessionSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    

    


