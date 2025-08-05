import os
import shutil
import uuid
from datetime import datetime

from countries_plus.models import Country
from django.conf import settings
from django.db import models, transaction
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from modeltrans.fields import TranslationField
from modeltrans.manager import MultilingualManager

from apps.bones.drf.models import AbstractDocumentModel, get_upload_path

RESTRICTION_TYPE = (
    ("Quantitative", _("Quantitative")),
    ("Qualitative", _("Qualitative")),
    ("Full", _("Quantitative and Qualitative")),
)

NON_COMPLIANCE = (
    ("De Jure", _("De Jure")),
    ("De Facto", _("De Facto")),
)

MODE_OF_SUPPLY = (
    ("1", _("Mode 1: Cross-border trade")),
    ("2", _("Mode 2: Consumption abroad")),
    ("3", _("Mode 3: Commercial presence")),
    ("4", _("Mode 4: Movement of natural persons")),
)

YES_NO = (
    ("Yes", _("Yes")),
    ("No", _("No")),
)

NATIONAL_TREATMENT = (
    ("Fair", _("Non-Discriminatory")),
    ("Discriminatory", _("Discriminatory")),
)

TYPE_OF_MEASURE_CODE = (
    ("Law", _("Law")),
    ("Decision", _("Decision")),
    ("Administrative", _("Administrative Practice")),
    ("Other", _("Other")),
)

COMPLAINT_DOC_ROOT = os.path.join("documents", "complaint_document")
COMPLAINT_STATUS = (
    ("New", _("New")),
    ("Status", _("Update Status")),
    ("Review", _("Review")),
    ("Regional Review", _("Regional Review")),
    ("Council Review", _("Council Review")),
    ("Resolved", _("Resolved")),
    ("Rejected", _("Rejected")),
)

RESTRICTION_STATUS = (
    ("Intact", _("Neither Removed nor Amended")),
    ("New", _("Newly Introduced")),
    ("Major", _("Major Amendment")),
    ("Minor", _("Minor Amendment")),
    ("Removed", _("Completely Removed")),
)

COMPLAINT_TYPE = (
    ("Access", _("Restriction on Market Entry")),
    ("Treatment", _("Restriction while Operating")),
)

NOTIFICATION_STATUS = (
    ("Draft", _("Draft")),
    ("Review", _("Review")),
    ("Active", _("Active")),
)


class Sector(models.Model):
    slug = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    label = models.CharField(max_length=250)
    parent = models.ForeignKey(
        "self", null=True, on_delete=models.RESTRICT, related_name="sectors"
    )
    description = models.TextField(null=True)
    i18n = TranslationField(fields=("label", "description"))

    class Meta:
        ordering = ["label"]


class AbstractSettingModel(models.Model):
    slug = models.CharField(unique=True, max_length=250)
    label = models.CharField(max_length=250)
    description = models.TextField(null=True)
    i18n = TranslationField(fields=("label", "description"))

    class Meta:
        ordering = ["label"]
        abstract = True


class RestrictionAccess(AbstractSettingModel):
    pass


class Policy(AbstractSettingModel):
    sequence = models.IntegerField(null=True)

    class Meta:
        ordering = ["sequence"]


class RestrictionManager(models.Manager):
    def get_sectors_display(self):
        sectors = dict(
            (v["sector__id"], v["total"])
            for v in self.values("sector__id").annotate(total=Count("id"))
        )
        data = {}
        for s in Sector.objects.filter(id__in=[k for k in sectors.keys()]):
            p = s if not s.parent_id else s.parent
            while p.parent_id:
                p = p.parent
            if not data.get(p.id):
                data[p.id] = {
                    "slug": p.slug,
                    "label": p.label.title(),
                    "description": p.description,
                    "total": 0,
                }
            data[p.id]["total"] += sectors[s.id]
        return [v for v in data.values()]


class Restriction(models.Model):
    slug = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    country = models.ForeignKey(
        Country, on_delete=models.RESTRICT, related_name="restrictions"
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="restrictions"
    )
    policy = models.ForeignKey(
        Policy, null=True, on_delete=models.RESTRICT, related_name="restrictions"
    )
    text_of_measure = models.TextField(null=True)
    type_of_measure = models.TextField()
    type_of_measure_code = models.CharField(
        max_length=50, choices=TYPE_OF_MEASURE_CODE, default=TYPE_OF_MEASURE_CODE[0][0]
    )
    restriction_type = models.CharField(
        max_length=50, choices=RESTRICTION_TYPE, default=RESTRICTION_TYPE[0][0]
    )
    restriction_access = models.ManyToManyField(RestrictionAccess)
    restriction_on_national_treatment = models.CharField(
        max_length=50, choices=NATIONAL_TREATMENT, null=True
    )
    non_compliance = models.CharField(
        max_length=50, choices=NON_COMPLIANCE, default=NON_COMPLIANCE[0][0]
    )
    mode_of_supply_affected = models.CharField(
        max_length=50, choices=MODE_OF_SUPPLY, null=True
    )
    responsible_ministry = models.CharField(max_length=250)
    committed_to_liberalise = models.CharField(max_length=5, choices=YES_NO, null=True)
    year_introduced = models.IntegerField(null=True)
    year_of_removal_proposal = models.IntegerField(null=True)
    year_of_removal = models.IntegerField(null=True)
    deleted_on = models.DateTimeField(null=True)
    deleted = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50, choices=RESTRICTION_STATUS, default=RESTRICTION_STATUS[0][0]
    )
    i18n = TranslationField(fields=("text_of_measure", "type_of_measure"))

    objects = RestrictionManager()

    class Meta:
        ordering = ["type_of_measure"]

    def archive(self, user: "User"):
        with transaction.atomic():
            details = f"The record has been archived. Previous status: {self.status}"
            RestrictionUpdate.objects.create(
                user=user,
                restriction=self,
                details=details,
            )
            self.deleted_on = datetime.now().replace(microsecond=0)
            self.status = "Removed"
            self.deleted = True
            return self.save()


class RestrictionUpdate(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="restrictionupdates",
    )
    restriction = models.ForeignKey(
        Restriction, related_name="updates", on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=50, choices=RESTRICTION_STATUS, default=RESTRICTION_STATUS[0][0]
    )
    created_on = models.DateTimeField(auto_now_add=True)
    previous_state = models.JSONField(null=True)
    details = models.TextField()
    remarks = models.TextField(null=True)
    i18n = TranslationField(fields=("details", "remarks"))

    class Meta:
        ordering = ["restriction"]


class Complaint(models.Model):
    slug = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    date_of_occurrence = models.DateField(null=False)
    date_resolved = models.DateField(null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name="complaints"
    )
    origin_country = models.ForeignKey(
        Country, on_delete=models.RESTRICT, related_name="complaints_origin"
    )
    target_country = models.ForeignKey(
        Country, on_delete=models.RESTRICT, related_name="complaints_target"
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="complaints"
    )
    restriction = models.ForeignKey(
        Restriction, null=True, on_delete=models.RESTRICT, related_name="complaints"
    )
    policy = models.ForeignKey(
        Policy, on_delete=models.RESTRICT, related_name="complaints"
    )
    mode_of_supply_affected = models.CharField(max_length=50)
    restriction_type = models.CharField(
        max_length=50,
        choices=COMPLAINT_TYPE,
        null=False,
    )
    agency = models.CharField(null=True, max_length=250)
    description = models.TextField()
    status = models.CharField(
        max_length=50, choices=COMPLAINT_STATUS, default=COMPLAINT_STATUS[0][0]
    )
    objects = MultilingualManager()

    class Meta:
        ordering = ["sector"]
        permissions = [
            ("can_review", "Can review complaint"),
            ("can_approve", "Can approve complaint (regulator)"),
            ("can_approve_regional", "Can approve complaint (regional)"),
            ("can_approve_council", "Can approve complaint (council)"),
        ]

    def can_move_to(self, status: str) -> bool:
        if "New" == self.status and status in ["Review", "Rejected"]:
            return True
        elif "Review" == self.status and status in ["Resolved", "Regional Review"]:
            return True
        elif "Regional Review" == self.status and status in [
            "Resolved",
            "Council Review",
        ]:
            return True
        elif "Council Review" == self.status and status in ["Resolved", "Rejected"]:
            return True
        elif "Status" == status and ("New" == self.status or "Review" in self.status):
            return True
        else:
            return False

    def has_access(self, user: "User") -> bool:
        syntax = "restrictions.can_%s"
        if "New" == self.status:
            return user.has_perm(syntax % "review")
        if "Review" == self.status:
            return user.has_perm(syntax % "approve")
        if "Regional Review" == self.status:
            return user.has_perm(syntax % "approve_regional")
        if "Council Review" == self.status:
            return user.has_perm(syntax % "approve_council")
        return False

    @property
    def is_reviewed(self):
        return self.status in ["Resolved", "Rejected"]

    def delete(self, using=None, keep_parents=False):
        with transaction.atomic():
            pth = os.path.join(settings.MEDIA_ROOT, COMPLAINT_DOC_ROOT, str(self.slug))
            res = super().delete(using, keep_parents)
            if os.path.isdir(pth):
                shutil.rmtree(pth)
            return res


class ComplaintDocument(AbstractDocumentModel):
    complaint = models.ForeignKey(
        Complaint, related_name="documents", on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["complaint"]

    def get_upload_path(self, instance: "ComplaintDocument", filename: str) -> str:
        return os.path.join(COMPLAINT_DOC_ROOT, str(instance.complaint.slug), filename)


class ComplaintLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        related_name="complaintlogs",
    )
    complaint = models.ForeignKey(
        Complaint, related_name="logs", on_delete=models.CASCADE
    )
    from_status = models.CharField(max_length=50, choices=COMPLAINT_STATUS, null=True)
    to_status = models.CharField(max_length=50, choices=COMPLAINT_STATUS, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    comments = models.TextField()

    class Meta:
        ordering = ["complaint"]


class ComplaintLogDocument(AbstractDocumentModel):
    log = models.ForeignKey(
        ComplaintLog, related_name="documents", on_delete=models.CASCADE
    )

    class Meta:
        ordering = ["log"]

    def get_upload_path(self, instance: "ComplaintLogDocument", filename: str) -> str:
        return os.path.join(
            COMPLAINT_DOC_ROOT, str(instance.log.complaint.slug), filename
        )


class Commitment(models.Model):
    label = models.CharField(max_length=250, unique=True, null=False)
    description = models.TextField(null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["label"]


class CommitmentLine(models.Model):
    commitment = models.ForeignKey(
        Commitment, related_name="lines", on_delete=models.CASCADE
    )
    country = models.ForeignKey(
        Country, on_delete=models.RESTRICT, related_name="commitments"
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="commitments"
    )
    value = models.IntegerField(null=True)

    class Meta:
        unique_together = ["commitment", "country", "sector"]
        ordering = ["commitment"]


class Notification(AbstractDocumentModel):
    sector = models.ForeignKey(
        Sector, on_delete=models.RESTRICT, related_name="notifications"
    )
    country = models.ForeignKey(
        Country, on_delete=models.RESTRICT, related_name="notifications"
    )
    applicability = models.CharField(max_length=250, null=True)
    requirement = models.TextField(null=True)
    status = models.CharField(
        max_length=50, choices=NOTIFICATION_STATUS, default=NOTIFICATION_STATUS[0][0]
    )
    notification_date = models.DateField(null=True)
    _document = models.FileField(
        null=True, db_column="document", upload_to=get_upload_path
    )
    i18n = TranslationField(fields=("applicability", "requirement"))

    class Meta:
        ordering = ["sector"]

    def get_upload_path(self, instance: "Notification", filename: str) -> str:
        return f"documents/notification/{filename}"
