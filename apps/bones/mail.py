import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from html2text import html2text

logger = logging.getLogger(__name__)


def send_email(
    subject: str,
    to_emails: list[str],
    html_template: str,
    context: dict = None,
    cc_emails: list[str] = None,
    headers: dict = None,
) -> bool:
    try:
        # https://docs.djangoproject.com/en/4.2/topics/email/
        ctx = {
            "ORGANISATION_NAME": settings.ORGANISATION_NAME,
        }
        if isinstance(context, dict):
            ctx.update(context)
        html_content = render_to_string(html_template, context=ctx)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=html2text(html_content),
            from_email=settings.ORGANISATION_EMAIL,
            to=to_emails,
            cc=cc_emails,
            headers=headers,
        )
        msg.attach_alternative(html_content, "text/html")
        return 0 < msg.send()
    except Exception as err:
        logger.error(str(err))
        return False
