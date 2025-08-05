from django.conf import settings
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.bones.drf.serializers import (
    DTSerializer,
    DocumentListField,
    DocumentMixin,
    DocumentsMixin,
    error_handle,
)
from apps.core.serializers.core import CountrySerializer
from ..models import (
    RESTRICTION_STATUS,
    Commitment,
    CommitmentLine,
    Complaint,
    ComplaintDocument,
    ComplaintLog,
    ComplaintLogDocument,
    Notification,
    Policy,
    Restriction,
    RestrictionAccess,
    RestrictionUpdate,
    Sector,
)

DATE_FORMATS = ["%d/%m/%Y", "%Y-%m-%d", "iso-8601"]


class SettingModelI18nMixin:
    STATIC_COLS = ["id", "slug", "label", "description"]

    @staticmethod
    def get_label(obj: models.Model):
        return obj.label_i18n

    @staticmethod
    def get_description(obj: models.Model):
        return obj.description_i18n

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=False)
        kw = {}
        if not self.initial_data.get("label", "").strip():
            kw["label"] = _("This field can not be empty")
        error_handle(self._errors, raise_exception, kw)


class SectorSerializer(SettingModelI18nMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Sector
        fields = "__all__"
        read_only_fields = ["id", "slug", "parent"]

    def as_i18n(self) -> dict:
        kw = {
            "id": self.data["id"],
            "slug": self.data["slug"],
            "parent": self.data["parent"],
        }
        for col in ["label", "description"]:
            kw[col] = self.data[f"{col}_i18n"]
            for k, v in settings.LANGUAGES:
                kw[f"{col}_{k}"] = self.data[f"{col}_{k}"]
        return kw


class SectorI18nSerializer(SettingModelI18nMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Sector
        fields = SettingModelI18nMixin.STATIC_COLS
        read_only_fields = ["id", "slug"]


class SectorViewSerializer(SettingModelI18nMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    parent = SectorI18nSerializer()

    class Meta:
        model = Sector
        fields = SettingModelI18nMixin.STATIC_COLS + ["parent"]
        read_only_fields = ["id", "slug"]


class DTSectorSerializer(DTSerializer):
    results = SectorViewSerializer(many=True)


class RestrictionAccessSerializer(SettingModelI18nMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = RestrictionAccess
        fields = "__all__"
        read_only_fields = ["id"]


class DTRestrictionAccessSerializer(DTSerializer):
    results = RestrictionAccessSerializer(many=True)


class PolicySerializer(SettingModelI18nMixin, serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Policy
        fields = "__all__"
        read_only_fields = ["id"]


class DTPolicySerializer(DTSerializer):
    results = PolicySerializer(many=True)


class RestrictionSerializer(serializers.ModelSerializer):
    year_introduced = serializers.IntegerField(required=True)
    review_status = serializers.ChoiceField(
        choices=RESTRICTION_STATUS, required=False, read_only=True
    )
    mode_of_supply_affected = serializers.CharField(required=True)
    details = serializers.CharField(required=False, read_only=True)
    remarks = serializers.CharField(required=False, read_only=True)
    text_of_measure = serializers.SerializerMethodField()
    type_of_measure = serializers.SerializerMethodField()

    class Meta:
        model = Restriction
        fields = "__all__"
        read_only_fields = ["id", "slug", "details", "remarks", "review_status"]

    @staticmethod
    def get_text_of_measure(obj: Restriction):
        return obj.text_of_measure_i18n

    @staticmethod
    def get_type_of_measure(obj: Restriction):
        return obj.type_of_measure_i18n

    def check_lang(self, col: str):
        sms = _("Make sure to include the following translations: %s")
        missing = [
            k.upper()
            for k, v in settings.LANGUAGES
            if not self.initial_data.get(f"{col}_{k}", False)
        ]
        return {} if 0 == len(missing) else {col: sms % ",".join(missing)}

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=False)
        kw = {}
        if self.instance and self.instance.deleted:
            kw["detail"] = _("This record has been archived and can not be modified")
        if not self.initial_data.get("details", False):
            if self.instance:
                kw["details"] = _("Specify the reason for updating this restriction")
            else:
                kw["details"] = _("Specify the reason for creating this restriction")
        elif self.instance:
            kw.update(self.check_lang("details"))
        if not self.initial_data.get("type_of_measure", "").strip():
            kw["type_of_measure"] = _("Specify the name/brief of this restriction")
        if self.instance and self.initial_data.get("remarks", False):
            kw.update(self.check_lang("remarks"))
        error_handle(self._errors, raise_exception, kw)

    def create_update(self, instance: Restriction, update: bool):
        kw = dict(
            user=self.context["request"].user,
            restriction=instance,
            status="New",
        )
        if update:
            kw["previous_state"] = RestrictionViewSerializer(instance).data
            kw["status"] = self.initial_data["review_status"] or "Initial"
        for col in ["details", "remarks"]:
            for k, v in settings.LANGUAGES:
                kw[f"{col}_{k}"] = self.initial_data[f"{col}_{k}"]
        return RestrictionUpdate.objects.create(**kw)

    def create(self, validated_data):
        with transaction.atomic():
            validated_data["status"] = "New"
            instance = super().create(validated_data)
            self.create_update(instance, False)
            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            self.create_update(instance, True)
            return super().update(instance, validated_data)


class RestrictionViewSerializer(RestrictionSerializer):
    restriction_access = RestrictionAccessSerializer(many=True)
    policy = PolicySerializer()
    country = CountrySerializer()
    sector = SectorI18nSerializer()
    latest = serializers.SerializerMethodField()

    @staticmethod
    def get_latest(obj: Restriction) -> None | dict:
        for res in obj.updates.order_by("-id"):
            return {
                "update": res.details_i18n,
                "remarks": res.remarks_i18n,
            }


class DTRestrictionSerializer(DTSerializer):
    results = RestrictionViewSerializer(many=True)


class UserDisplayNameMixin:

    def get_user(self, obj: models.Model):
        kw = {"current": self.context["request"].user.id == obj.user.id}
        if self.context["request"].user.is_staff or kw["current"]:
            s = f"{obj.user.first_name} {obj.user.last_name}"
            s = " ".join(s.split()).strip()
            kw["display_name"] = s if s else obj.user.username
        return kw


class RestrictionUpdateSerializer(UserDisplayNameMixin, serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = RestrictionUpdate
        fields = "__all__"
        read_only_fields = ["id", "user", "created_on"]


class DTRestrictionUpdateSerializer(DTSerializer):
    results = RestrictionUpdateSerializer(many=True)


class ComplaintSerializer(
    DocumentsMixin, UserDisplayNameMixin, serializers.ModelSerializer
):
    date_of_occurrence = serializers.DateField(
        required=True, input_formats=DATE_FORMATS
    )
    date_resolved = serializers.DateField(required=False, input_formats=DATE_FORMATS)
    documents_trash = serializers.CharField(read_only=True, required=False)
    documents = DocumentListField(
        read_only=True,
        required=False,
        child=serializers.FileField(
            max_length=2000, allow_empty_file=False, use_url=False
        ),
    )
    user = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = "__all__"
        read_only_fields = ["id", "slug", "user", "date_resolved", "status"]

    def is_valid(self, *, raise_exception=False):
        super().is_valid(raise_exception=False)
        kw = {}
        if not self.instance and self.context["request"].user.is_staff:
            kw["detail"] = kw["is_staff"] = _(
                "Please note that staff accounts are not allowed to register "
                "new complaints."
            )
        error_handle(self._errors, raise_exception, kw)

    def create(self, validated_data):
        with transaction.atomic():
            validated_data["user_id"] = self.context["request"].user.id
            instance = super().create(validated_data)
            self.save_documents(ComplaintDocument, instance, "complaint")
            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            self.save_documents(ComplaintDocument, instance, "complaint")
            return instance


class ComplaintViewSerializer(ComplaintSerializer):
    origin_country = CountrySerializer()
    target_country = CountrySerializer()
    policy = PolicySerializer()
    sector = SectorI18nSerializer()
    is_reviewed = serializers.SerializerMethodField()
    expected = serializers.SerializerMethodField()
    restriction = RestrictionSerializer()

    @staticmethod
    def get_is_reviewed(obj: Complaint) -> bool:
        return obj.is_reviewed

    @staticmethod
    def get_expected(obj: Complaint) -> list:
        if "New" == obj.status:
            return ["Status", "Review", "Rejected"]
        elif "Review" == obj.status:
            return ["Status", "Resolved", "Regional Review"]
        elif "Regional Review" == obj.status:
            return ["Status", "Resolved", "Council Review"]
        elif "Council Review" == obj.status:
            return ["Status", "Resolved", "Rejected"]
        else:
            return []


class DTComplaintSerializer(DTSerializer):
    results = ComplaintViewSerializer(many=True)


class ComplaintLogSerializer(
    DocumentsMixin, UserDisplayNameMixin, serializers.ModelSerializer
):
    date_resolved = serializers.DateField(required=False, input_formats=DATE_FORMATS)
    documents_trash = serializers.CharField(read_only=True, required=False)
    documents = DocumentListField(
        read_only=True,
        required=False,
        child=serializers.FileField(
            max_length=2000, allow_empty_file=False, use_url=False
        ),
    )
    user = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintLog
        fields = "__all__"
        read_only_fields = ["id", "user", "created_on"]

    def get_data(self, key: str):
        return self._validated_data.get(key, self.initial_data.get(key, None))

    def is_valid(self, *, raise_exception=False):
        kw = {}
        super().is_valid(raise_exception=False)
        to_status = self.get_data("to_status")
        from_status = self.get_data("from_status")
        date_resolved = self.get_data("date_resolved")
        if date_resolved and isinstance(date_resolved, str):
            try:
                fmt = serializers.DateField(input_formats=DATE_FORMATS)
                date_resolved = fmt.to_internal_value(date_resolved)
            except ValidationError as err:
                kw["date_resolved"] = " ".join([d for d in err.detail])
                date_resolved = "is_invalid"
        ref = self._validated_data.get("complaint", False)
        if not ref:
            ref = Complaint.objects.filter(
                id=self.initial_data.get("complaint")
            ).first()
        if from_status != ref.status:
            kw["detail"] = _("The status supplied is invalid")
        if not ref.can_move_to(to_status):
            kw["to_status"] = _(
                "The application can not be moved to the specified status"
            )
        if not date_resolved and to_status in ["Resolved", "Rejected"]:
            kw["date_resolved"] = _("Specify the date the complaint was resolved")
        elif (
            date_resolved
            and not isinstance(date_resolved, str)
            and ref.date_of_occurrence > date_resolved
        ):
            kw["date_resolved"] = _(
                "The date a complaint is resolved can not be in the past."
            )
        error_handle(self._errors, raise_exception, kw)

    def create(self, validated_data):
        with transaction.atomic():
            date_resolved = None
            if "date_resolved" in validated_data:
                date_resolved = validated_data.pop("date_resolved")
            ref = validated_data["complaint"]
            if "Status" != validated_data["to_status"]:
                ref.status = validated_data["to_status"]
            if ref.is_reviewed and date_resolved:
                ref.date_resolved = date_resolved
            ref.save()
            validated_data["user_id"] = self.context["request"].user.id
            instance = super().create(validated_data)
            self.save_documents(ComplaintLogDocument, instance, "log")
            return instance

    def update(self, instance, validated_data):
        return instance


class DTComplaintLogSerializer(DTSerializer):
    results = ComplaintLogSerializer(many=True)


class NotificationSerializer(DocumentMixin, serializers.ModelSerializer):
    notification_date = serializers.DateField(input_formats=DATE_FORMATS)
    document = serializers.SerializerMethodField(read_only=True, required=False)
    applicability = serializers.SerializerMethodField()
    requirement = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["id", "document"]

    @staticmethod
    def get_document(obj: Notification) -> dict:
        return obj.document

    @staticmethod
    def get_applicability(obj: Notification) -> dict:
        return obj.applicability_i18n

    @staticmethod
    def get_requirement(obj: Notification) -> dict:
        return obj.requirement_i18n


class NotificationViewSerializer(NotificationSerializer):
    country = CountrySerializer()
    sector = SectorI18nSerializer()


class DTNotificationSerializer(DTSerializer):
    results = NotificationViewSerializer(many=True)


class CommitmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commitment
        fields = "__all__"
        read_only_fields = ["id"]


class DTCommitmentSerializer(DTSerializer):
    results = CommitmentSerializer(many=True)


class CommitmentLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommitmentLine
        fields = "__all__"
        read_only_fields = ["id"]


class CommitmentLineViewSerializer(CommitmentLineSerializer):
    country = CountrySerializer()
    sector = SectorI18nSerializer()


class DTCommitmentLineSerializer(DTSerializer):
    results = CommitmentLineViewSerializer(many=True)
