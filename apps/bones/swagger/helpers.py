from typing import Callable, Union

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers


def response(
    schema: Union[
        type[serializers.Serializer], serializers.Serializer, openapi.Schema
    ] = None,
    status: int = 200,
    description: str = "",
    has_validation: bool = False,
    has_auth: bool = True,
) -> dict:
    if status in [400, 403, 429]:
        status = 200
    err_schema = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={"detail": openapi.Schema(type=openapi.TYPE_STRING)},
    )
    res = {
        status: openapi.Response(description=description, schema=schema),
        400: openapi.Response(
            description="When a validation error occurs",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={},
            ),
            examples={
                "application/json": {
                    "field_a": "error message",
                    "field_b": "error message",
                }
            },
        ),
        403: openapi.Response(
            description="When one does not have access to the specified resource",
            schema=err_schema,
        ),
        429: openapi.Response(
            description="When the request has been rate limited",
            schema=err_schema,
        ),
    }
    if not has_validation:
        del res[400]
    if not has_auth:
        del res[403]
    return res


def decorator(
    tag: str,
    operation_summary: str,
    schema: Union[
        type[serializers.Serializer], serializers.Serializer, openapi.Schema
    ] = None,
    status: int = 200,
    description: str = "",
    has_validation: bool = True,
) -> Callable:
    return swagger_auto_schema(
        security=[{"Bearer": []}],
        tags=[tag],
        operation_summary=operation_summary,
        responses=response(schema, status, description, has_validation),
    )
