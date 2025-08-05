from countries_plus.models import Country
from rest_framework import serializers
from apps.bones.drf.serializers import DTSerializer
from apps.core.models import CMSPage


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = [
            "iso",
            "iso3",
            "name",
            "capital",
            "currency_code",
            "currency_symbol",
            "currency_name",
        ]


class DTCountrySerializer(DTSerializer):
    results = CountrySerializer(many=True)





class CMSPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSPage
        fields = '__all__'