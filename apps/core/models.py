import uuid

from countries_plus.models import Country
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from modeltrans.fields import TranslationField
from rest_framework.request import Request

from apps.bones.mail import send_email
from apps.bones.token import Token

DISPLAY_TYPES = (
    ("Question", _("Question")),
    ("Dashboard", _("Dashboard")),
)


class CSP(models.Model):
    document_uri = models.TextField()
    referrer = models.TextField()
    violated_directive = models.CharField(max_length=500)
    effective_directive = models.CharField(max_length=500)
    original_policy = models.TextField()
    blocked_uri = models.TextField()
    line_number = models.SmallIntegerField(null=True)
    column_number = models.SmallIntegerField(null=True)
    source_file = models.TextField(null=True)
    status_code = models.SmallIntegerField(null=True)
    created_on = models.DateTimeField(auto_now_add=True)


class ProfileManager(models.Manager):

    @staticmethod
    def get_activation_code(u: User, token_type: str = "token") -> str:
        seconds = 60 * 60 * 24 * 3
        return Token.create(u.username, seconds, token_type)

    @staticmethod
    def send_activation_email(pro: "Profile", req: Request) -> bool:
        return send_email(
            subject=_("User Registration"),
            to_emails=[pro.user.email],
            html_template="core/emails/confirm_signup.html",
            context={
                "BASE_URL": req.build_absolute_uri("/")[:-1],
                "profile": pro,
            },
        )

    @classmethod
    def resend_activation_email(cls, pro: "Profile", req: Request) -> bool:
        pro.activation_code = cls.get_activation_code(pro.user)
        pro.save()
        return cls.send_activation_email(pro, req)

    @classmethod
    def send_reset_email(cls, pro: "Profile", req: Request) -> bool:
        pro.activation_code = cls.get_activation_code(pro.user, "reset")
        pro.save()
        return send_email(
            subject=_("Password Reset"),
            to_emails=[pro.user.email],
            html_template="core/emails/confirm_reset.html",
            context={
                "BASE_URL": req.build_absolute_uri("/")[:-1],
                "profile": pro,
            },
        )

    def create_account(self, **kwargs) -> "Profile":
        with transaction.atomic():
            kwargs["username"] = kwargs["username"].lower()
            kwargs["email"] = kwargs["username"]
            kwargs["is_superuser"] = False
            kwargs["is_active"] = False
            if "password" in kwargs:
                kwargs.pop("password")
            country = None
            if "country" in kwargs:
                country = kwargs.pop("country")
            groups = None
            if "groups" in kwargs:
                groups = [g for g in kwargs["groups"]]
                del kwargs["groups"]
            u = User.objects.create(**kwargs)
            if groups:
                u.groups.set(groups)
            u.set_password(str(uuid.uuid4()))
            u.save()
            return self.create(
                user=u, country_id=country, activation_code=self.get_activation_code(u)
            )

    def create_staff(self, **kwargs) -> "Profile":
        kwargs["is_staff"] = True
        return self.create_account(**kwargs)

    def create_user(self, **kwargs) -> "Profile":
        kwargs["is_staff"] = False
        if "groups" in kwargs:
            kwargs["groups"].pop()
        return self.create_account(**kwargs)


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="profile",
    )
    locale = models.CharField(default="en", max_length=250)
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    dark_mode = models.BooleanField(null=True)
    phone = models.CharField(null=True, max_length=250)
    activation_code = models.CharField(null=True, max_length=250)
    country = models.ForeignKey(
        Country, null=True, on_delete=models.RESTRICT, related_name="profiles"
    )

    objects = ProfileManager()

    def resend_activation_email(self, req: Request) -> bool:
        return ProfileManager.resend_activation_email(self, req)

    def send_activation_email(self, req: Request) -> bool:
        return ProfileManager.send_activation_email(self, req)

    def send_reset_email(self, req: Request) -> bool:
        if self.user.is_active:
            return ProfileManager.send_reset_email(self, req)
        if self.activation_code:
            return ProfileManager.resend_activation_email(self, req)
        return False


class ReportTag(models.Model):
    slug = models.CharField(max_length=250, unique=True)
    label = models.CharField(max_length=250)
    i18n = TranslationField(fields=("label",))

    class Meta:
        ordering = ["label"]


class Report(models.Model):
    tags = models.ManyToManyField(ReportTag)
    sequence = models.IntegerField(null=True)
    display_height = models.IntegerField(null=True, default=550)
    params = models.JSONField(null=True)
    display_index = models.IntegerField(null=False)
    display_type = models.CharField(max_length=50, choices=DISPLAY_TYPES)
    label = models.CharField(max_length=250, unique=True)
    brief = models.CharField(max_length=250)
    description = models.TextField(null=True)
    i18n = TranslationField(fields=("label", "brief", "description"))

    class Meta:
        ordering = ["label"]




class CMSPage(models.Model):
    slug = models.SlugField(unique=True, help_text="URL-friendly identifier for the page")
    title = models.CharField(max_length=255, help_text="Page title")
    body = models.TextField(help_text="Page content")
    published = models.BooleanField(default=False, help_text="Whether the page is publicly visible")
    
    # Author tracking
    author = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='authored_cms_pages',
        help_text="User who created this page"
    )
    last_modified_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='modified_cms_pages',
        help_text="User who last modified this page"
    )
    
    # Metadata
    meta_description = models.CharField(
        max_length=160, 
        blank=True, 
        help_text="SEO meta description"
    )
    meta_keywords = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="SEO meta keywords (comma-separated)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True, help_text="When the page was first published")

    class Meta:
        ordering = ['-created_at']
        permissions = [
            ("publish_cmspage", "Can publish/unpublish CMS pages"),
            ("manage_all_cmspages", "Can manage all CMS pages regardless of author"),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.slug})"
    
    def save(self, *args, **kwargs):
        # Set published_at when first published
        if self.published and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


