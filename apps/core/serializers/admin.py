from django.contrib.auth.models import User, Group, Permission
from django.db.utils import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.bones.drf.serializers import DTSerializer
from apps.bones.drf.serializers import error
from ..models import CSP, Profile


class CSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSP
        fields = "__all__"
        read_only_fields = ["id"]


class DTCSPSerializer(DTSerializer):
    results = CSPSerializer(many=True)


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "name", "codename"]
        read_only_fields = ["id", "name", "codename"]


class DTPermissionSerializer(DTSerializer):
    results = PermissionSerializer(many=True)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name", "permissions"]
        read_only_fields = ["id"]


class DTGroupSerializer(DTSerializer):
    results = GroupSerializer(many=True)


USER_READ_ONLY_FIELDS = ["id", "is_staff", "is_superuser", "last_login"]


class UserSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "is_staff",
            "is_active",
            "is_superuser",
            "username",
            "first_name",
            "last_name",
            "last_login",
            "groups",
        ]
        read_only_fields = USER_READ_ONLY_FIELDS

    def create(self, validated_data):
        try:
            return Profile.objects.create_staff(**validated_data).user
        except IntegrityError:
            error(**{"username": _("The email specified is already in use")})

    def update(self, instance, validated_data):
        for key in ["password", "email", "username", "is_superuser", "is_staff"]:
            if key in validated_data:
                validated_data.pop(key)
        return super().update(instance, validated_data)


class UserViewSerializer(UserSerializer):
    groups = GroupSerializer(many=True)


class DTUserSerializer(DTSerializer):
    results = UserSerializer(many=True)


class UserPreviewSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    @staticmethod
    def get_permissions(obj: User) -> list:
        def _key(s):
            x = s.split(".")
            y = x[1].split("_")
            return "%s.%s_%s" % (x[0], y[1], y[0])

        return sorted(obj.get_all_permissions(), key=_key)

    class Meta:
        model = User
        fields = ["is_staff", "is_superuser", "permissions"]
        read_only_fields = USER_READ_ONLY_FIELDS
