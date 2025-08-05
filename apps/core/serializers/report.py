import time

import jwt
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.bones.drf.serializers import DTSerializer, ModelListField, error
from ..models import Report, ReportTag


class ReportTokenSerializer(serializers.Serializer):
    index = serializers.IntegerField(required=True)
    minutes = serializers.IntegerField(required=False)

    def is_valid(self, raise_exception=False):
        super().is_valid(raise_exception=True)
        if not settings.METABASE_SITE_URL or not settings.METABASE_SECRET_KEY:
            error(**{"config": _("Make sure metabase has been properly configured")})
        res = Report.objects.filter(id=self._validated_data["index"]).first()
        if not res:
            error(**{"index": _("The index specified could not be found")})
        payload = {
            "resource": {res.display_type.lower(): res.display_index},
            "params": res.params or {},
            "exp": round(time.time()) + (self._validated_data["minutes"] * 10),
        }
        token = jwt.encode(payload, settings.METABASE_SECRET_KEY, algorithm="HS256")
        return (
            settings.METABASE_SITE_URL
            + ("/embed/%s/" % res.display_type.lower())
            + token
            + "#bordered=true&titled=true"
        )


class ReportTagSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = ReportTag
        fields = "__all__"
        read_only_fields = ["id"]

    @staticmethod
    def get_label(obj: ReportTag):
        return obj.label_i18n


class DTReportTagSerializer(DTSerializer):
    results = ReportTagSerializer(many=True)


class ReportSerializer(serializers.ModelSerializer):
    tags = ModelListField(required=False)

    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_data["sequence"] = instance.sequence
            if not validated_data.get("tags", False):
                instance.tags.clear()
            return super().update(instance, validated_data)


class ReportViewSerializer(ReportSerializer):
    tags = ReportTagSerializer(many=True)


class DTReportSerializer(DTSerializer):
    results = ReportViewSerializer(many=True)


class ReportFeatureSerializer(serializers.Serializer):
    feature = serializers.ListField(required=True, child=serializers.IntegerField())

    def save(self):
        super().is_valid(raise_exception=True)
        with transaction.atomic():
            domain = Q(id__in=self._validated_data["feature"])
            for report in Report.objects.filter(domain):
                report.sequence = self._validated_data["feature"].index(report.id)
                report.save()
            res = []
            for report in Report.objects.filter(~domain):
                res.append(ReportViewSerializer(report).data)
                report.sequence = None
                report.save()
            return res
