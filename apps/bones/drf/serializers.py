import json

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from rest_framework import serializers
from rest_framework.exceptions import ErrorDetail, ValidationError


def error(**kwargs):
    raise ValidationError(error_detail(**kwargs))


def error_handle(errors: dict, raise_exception: bool, kw: dict = None):
    if kw and 0 < len(kw):
        errors.update(error_detail(**kw))
    if errors and raise_exception:
        raise ValidationError(errors)
    return not bool(errors)


def error_detail(**kwargs):
    return {k: ErrorDetail(v, code="invalid") for k, v in kwargs.items()}


class DTSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    next = serializers.URLField()
    previous = serializers.URLField()
    total = serializers.IntegerField()


class ModelListField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.IntegerField()
        super().__init__(**kwargs)

    def to_representation(self, data):
        if isinstance(data, models.Manager):
            return [d.id for d in data.all()]
        return super().to_representation(data)


class DocumentListField(serializers.ListField):
    def to_representation(self, data):
        if isinstance(data, models.Manager):
            return [d.document for d in data.all() if d.document]
        return super().to_representation(data)


class DocumentMixin:
    def update(self, instance, validated_data):
        trash = json.loads(self.initial_data.get("_document_trash", "[]"))
        size = len([item["id"] for item in trash if item["trash"]])
        if 0 < size:
            instance.clear()
        elif 0 == size and not isinstance(
            validated_data["_document"], InMemoryUploadedFile
        ):
            validated_data["_document"] = instance._document
        return super().update(instance, validated_data)


class DocumentsMixin:
    def save_documents(self, Model, instance, parent):
        try:
            ids = [
                item["id"]
                for item in json.loads(self.initial_data.get("documents_trash", "[]"))
                if item["trash"]
            ]
            for doc in Model.objects.filter(id__in=ids):
                doc.delete()
        except json.decoder.JSONDecodeError:
            pass
        kw = {parent: instance}
        for doc in self.initial_data.getlist("documents", []):
            Model.objects.create(_document=doc, **kw)
