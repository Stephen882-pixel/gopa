from rest_framework import serializers

from ..models import Restriction


class HomeSectorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    label = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField()


class HomeSerializer(serializers.Serializer):
    sectors = HomeSectorSerializer(many=True)

    @classmethod
    def instance(cls):
        return {"sectors": Restriction.objects.get_sectors_display()}
