import re

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.db import transaction
from django.db.utils import IntegrityError
from django.middleware.csrf import get_token
from django.utils.translation import activate, get_language, gettext_lazy as _
from requests import Session
from rest_framework import serializers
from rest_framework.request import Request

from apps.bones.drf.serializers import error
from apps.bones.token import Token
from .admin import UserPreviewSerializer
from .core import CountrySerializer
from ..models import Profile
from apps.bones.drf.serializers import DTSerializer

def _check_password(pass_a: str, pass_b: str) -> str:
    if pass_a != pass_b:
        return _("The two passwords do not match.")
    check = re.compile(r"^(?=.*?\d)(?=.*?\w)(?=.*?\W)[\d\w\W]{8,}$").match(pass_a)
    if not check:
        return _(
            "Make sure your password has at least 8 characters has one "
            "numeric character and has at least one non-word character."
        )
    return "ok"


class LoginSerializer(serializers.Serializer):
    username = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=True)
        return authenticate(**self._validated_data)


class RegisterResetSerializer(serializers.Serializer):
    username = serializers.EmailField(required=True)

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=raise_exception)
        u = User.objects.filter(username=self.validated_data["username"]).first()
        sms = False
        if not u:
            sms = _("The email specified could not be found within the portal.")
        if not u.is_active and u.profile.activation_code is None:
            sms = _("This account has been deactivated.")
        if sms:
            error(**{"username": sms})
        return u


class RegisterClientSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(required=True)
    country = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "country"]

    def create(self, validated_data):
        try:
            return Profile.objects.create_user(**validated_data).user
        except IntegrityError:
            error(**{"username": _("The username specified is already in use")})


class RegisterConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    pass_a = serializers.CharField(required=True)
    pass_b = serializers.CharField(required=True)

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=True)
        detail = self._validated_data["token"]
        args = Token.verify(detail.encode("utf-8"))
        if not args:
            error(**{"detail": _("The token specified is invalid")})
        user = get_user_model().objects.filter(username=args["user"]).first()
        if not user:
            error(**{"detail": _("The token specified is invalid")})
        if detail != user.profile.activation_code:
            error(**{"detail": _("The token specified is invalid")})
        check = _check_password(
            self._validated_data["pass_a"], self._validated_data["pass_b"]
        )
        if "ok" != check:
            error(**{"detail": check})
        with transaction.atomic():
            user.set_password(self._validated_data["pass_a"])
            user.is_active = True
            user.save()
            user.profile.activation_code = None
            user.profile.save()
            return user


class ProfileCredsSerializer(serializers.Serializer):
    old_pass = serializers.CharField(min_length=3)
    pass_a = serializers.CharField(min_length=8)
    pass_b = serializers.CharField(min_length=8)

    def update(self, instance: User, validated_data: dict) -> User:
        instance.set_password(validated_data["pass_a"])
        instance.save()
        return instance

    def is_valid(self, raise_exception=False):
        if not super().is_valid(raise_exception=raise_exception):
            return False
        user = authenticate(
            username=self.instance.username, password=self._validated_data["old_pass"]
        )
        if user is None:
            check = _(
                "You must specify your current password to make changes on this form."
            )
            error(**{"old_pass": check})
        check = _check_password(
            self._validated_data["pass_a"], self._validated_data["pass_b"]
        )
        if "ok" != check:
            error(**{"new_pass": check})
        return True


class LocaleSerializer(serializers.Serializer):
    locale = serializers.ChoiceField(choices=[l[0] for l in settings.LANGUAGES])

    def get_state(self, req: Request):
        self.is_valid(raise_exception=True)
        activate(self.data["locale"])
        req.LANGUAGE_CODE = get_language()
        return StateSerializer.get_state(req)


class ProfileUpdateSerializer(LocaleSerializer, serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = Profile
        fields = [
            "locale",
            "dark_mode",
            "avatar",
            "phone",
            "first_name",
            "last_name",
            "country",
        ]

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_data["dark_mode"] = "Yes" == self.initial_data.get(
                "dark_mode", "No"
            )
            keys = ["first_name", "last_name"]
            for attr, value in validated_data.items():
                if attr not in keys:
                    setattr(instance, attr, value)
            instance.save()
            user = instance.user
            for attr in keys:
                if validated_data.get(attr, False):
                    setattr(user, attr, validated_data[attr])
            user.save()
        return instance


class ProfileViewSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    country = CountrySerializer()

    @staticmethod
    def get_email(obj: Profile) -> str:
        return obj.user.email

    @staticmethod
    def get_username(obj: Profile) -> str:
        return obj.user.username

    @staticmethod
    def get_first_name(obj: Profile) -> str:
        return obj.user.first_name

    @staticmethod
    def get_last_name(obj: Profile) -> str:
        return obj.user.last_name

    @staticmethod
    def get_display_name(obj: Profile) -> str:
        s = f"{obj.user.first_name} {obj.user.last_name}"
        return " ".join(s.split()).strip()

    class Meta:
        model = Profile
        fields = [
            "locale",
            "avatar",
            "dark_mode",
            "phone",
            "email",
            "username",
            "first_name",
            "last_name",
            "display_name",
            "country",
        ]


class StateSerializer(serializers.Serializer):
    csrf = serializers.CharField()
    token = serializers.CharField()
    profile = ProfileViewSerializer()
    user = UserPreviewSerializer()

    @staticmethod
    def get_state(req: Request):
        kw = {
            "csrf": get_token(req),
            "token": Token.create(),
            "profile": {"locale": get_language()},
            "user": None,
        }
        if req.user.is_authenticated:
            kw["profile"] = ProfileViewSerializer(req.user.profile).data
            kw["user"] = UserPreviewSerializer(req.user).data
            kw["token"] = Token.create(req.user.username)
        return kw


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['session_key', 'expire_date', 'session_data']

class DTSessionSerializer(DTSerializer):
    results = SessionSerializer(many=True)
