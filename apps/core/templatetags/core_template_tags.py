from django import template

register = template.Library()


@register.simple_tag(takes_context=True)
def csp_enable_google(context, service):
    if "request" in context:
        context["request"].csp.enable_google(service)
    return ""


@register.simple_tag(takes_context=True)
def csp_enable_cdn(context, link):
    if "request" in context:
        context["request"].csp.enable_cdn(link)
    return ""


@register.simple_tag(takes_context=True)
def csp_enable(context, key, *args):
    if "request" in context:
        context["request"].csp.enable(key, args)
    return ""


@register.simple_tag(takes_context=True)
def csp_nonce(context):
    if "request" in context:
        return context["request"].csp.nonce()
    return ""
