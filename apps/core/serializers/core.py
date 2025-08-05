from countries_plus.models import Country
from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
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
    author_username = serializers.CharField(source='author.username', read_only=True)
    last_modified_by_username = serializers.CharField(source='last_modified_by.username', read_only=True)
    
    class Meta:
        model = CMSPage
        fields = [
            'id', 'slug', 'title', 'body', 'published', 'meta_description', 
            'meta_keywords', 'author', 'author_username', 'last_modified_by', 
            'last_modified_by_username', 'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['author', 'last_modified_by', 'created_at', 'updated_at', 'published_at']
    
    def validate_slug(self, value):
        """Ensure slug is URL-safe and unique"""
        import re
        if not re.match(r'^[a-z0-9-]+$', value):
            raise serializers.ValidationError(
                "Slug must contain only lowercase letters, numbers, and hyphens."
            )
        return value
    
    def validate_published(self, value):
        """Check if user has permission to publish content"""
        request = self.context.get('request')
        if request and value:  # If trying to publish
            user = request.user
            if not (user.is_superuser or 
                   user.has_perm('core.publish_cmspage') or
                   user.is_staff):
                raise serializers.ValidationError(
                    "You don't have permission to publish content."
                )
        return value
    
    def create(self, validated_data):
        """Set author when creating a new page"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
            validated_data['last_modified_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Track who last modified the page"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['last_modified_by'] = request.user
        
        # Handle publishing timestamp
        if 'published' in validated_data and validated_data['published'] and not instance.published_at:
            validated_data['published_at'] = timezone.now()
        
        return super().update(instance, validated_data)


class CMSPageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = CMSPage
        fields = [
            'id', 'slug', 'title', 'published', 'author_username', 
            'created_at', 'updated_at'
        ]


class CMSPagePublicSerializer(serializers.ModelSerializer):
    """Serializer for public-facing content (no sensitive fields)"""
    
    class Meta:
        model = CMSPage
        fields = ['id', 'slug', 'title', 'body', 'meta_description', 'published_at']