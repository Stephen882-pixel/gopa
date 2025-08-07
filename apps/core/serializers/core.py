from countries_plus.models import Country
from rest_framework import serializers
from apps.bones.drf.serializers import DTSerializer
from apps.core.models import CMSPage
from django.contrib.auth.models import User
from django.utils import timezone


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
        fields = [
            'id','slug','title','body','published','author',
            'last_modified_by','created_at','updated_at','published_at'
        ]
        read_only_fields = [
            'author','last_modified_by','slug','created_at','updated_at','published_at'
        ]

    def validate_slug(self,value):
        import re
        if not re.match(r'^[a-z0-9-]+$',value):
            raise serializers.ValidationError(
                "Slug must contain only lowercase letters, numbers, and hyphens"
            )
        return value

    def validate_published(self,value):
        request = self.context.get('request')
        if request and value:
            user = request.user
            if not (user.is_superuser or
            user.has_perm('core.publish_cmspage') or
            user.is_staff):
                raise serializers.ValidationError(
                    "You do not have permission to publish content"
                )
            return value

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
            validated_data['last_modified_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['published_at'] = timezone.now()
        return super().update(instance,validated_data)

class CMSPageListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username',read_only=True)

    class Meta:
        model = CMSPage
        fields = [
            'id','slug','title','published','author_username',
            'created_at','updated_at'
        ]

class CMSPagePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSPage
        fields = [
            'id','slug','title','body','published_at'
        ]
