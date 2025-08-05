import json

from django.http import HttpRequest, HttpResponse
from django.urls import reverse

from apps.bones import choice


class CSPRules:

    def __init__(self, authenticated: bool = False):
        self.allowed_rules = [
            "default-src",
            "child-src",
            "worker-src",
            "connect-src",
            "frame-ancestors",
            "object-src",
            "script-src",
            "style-src",
            "font-src",
            "img-src",
            "form-action",
        ]
        self._authenticated = authenticated
        self._nonce = choice.gen(70)
        self._rules = {"default-src": ["'self'"], "form-action": ["'self'"]}

    def __str__(self) -> str:
        if self._rules is None:
            return ""

        nones = ["object-src", "child-src", "frame-ancestors", "base-uri"]
        for key in nones:
            if key not in self._rules or 0 == len(self._rules[key]):
                self._rules[key] = ["'none'"]

        csp = []
        if self._authenticated:
            csp.append("report-to csp-endpoint")
        for key, rules in self._rules.items():
            cc = " ".join(rules)
            if key not in nones and 0 > cc.find("'self'"):
                cc = "'self' " + cc
            csp.append(key + " " + cc)

        return "; ".join(csp)

    def enable_google(self, service: str) -> None:
        if "fonts" == service:
            self.enable(
                "font-src",
                ["https://fonts.googleapis.com/css", "https://fonts.gstatic.com/"],
            )
            self.enable(
                "style-src",
                [
                    "'unsafe-inline'",
                    "https://fonts.gstatic.com",
                    "https://fonts.googleapis.com/css",
                ],
            )
        elif "maps" == service:
            self.enable(
                "script-src",
                ["https://maps.googleapis.com/", "https://csi.gstatic.com/"],
            )
            self.enable(
                "img-src",
                [
                    "https://maps.googleapis.com/maps/",
                    "https://mts.googleapis.com/maps/",
                    "https://maps.gstatic.com/",
                    "https://csi.gstatic.com/",
                ],
            )

    def enable_cdn(self, link: str) -> None:
        self.enable("script-src", [link])
        self.enable("style-src", [link])
        self.enable("font-src", [link])
        self.enable("img-src", [link])

    def enable(self, key: str, values: list) -> None:
        if key not in self.allowed_rules:
            return

        if key not in self._rules:
            self._rules[key] = []

        for val in values:
            if val not in self._rules[key]:
                val = " ".join(val.strip().split())
                self._rules[key].append(val)

    def nonce(self) -> str:
        self.enable("script-src", ["'nonce-%s'" % self._nonce])
        return self._nonce


class CSPMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Set the CSPRules object
        request.csp = CSPRules(
            hasattr(request, "user") and request.user.is_authenticated
        )

        # Get the response object
        response = self.get_response(request)

        # If this is an error response do not set the CSP
        if response.status_code in [400, 403, 404, 500, 503]:
            return response

        csp = "%s" % request.csp
        is_html = False
        is_response = isinstance(response, HttpResponse)
        try:
            is_html = is_response and "text/html" in response["content-type"]
        except KeyError:
            pass

        if not is_response or not is_html or "" == csp:
            return response

        # Some security features
        response["X-Permitted-Cross-Domain-Policies"] = "none"
        response["X-Xss-Protection"] = "1; mode=block"

        # CSP for Normal Browsers
        response["Content-Security-Policy"] = csp
        response["Report-To"] = json.dumps(
            {
                "group": "csp-endpoint",
                "max_age": 10886400,
                "endpoints": [{"url": reverse("auth:csp-report")}],
            }
        )

        # CSP for IE and Safari
        response["X-Content-Security-Policy"] = csp
        response["X-WebKit-CSP"] = csp

        # Return the response object
        return response
