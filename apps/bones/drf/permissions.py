from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.bones.token import Token


class IsAuthorized(BasePermission):
    def has_permission(self, req: Request, view: APIView) -> bool:
        key = req.headers.get("Authorization", "").split(" ")[-1]
        check = Token.verify(key)
        if check and req.user.is_authenticated:
            return check.get("user", False) == req.user.username
        if check and req.user.is_anonymous:
            return check.get("user", False) == "anonymous"
        return False


class IsSecured(IsAuthorized):
    def has_permission(self, req: Request, view: APIView) -> bool:
        if not super().has_permission(req, view):
            return False
        return bool(req.user and req.user.is_authenticated)


class IsSuperUser(BasePermission):
    def has_permission(self, req: Request, view: APIView) -> bool:
        return bool(req.user and req.user.is_superuser)


class IsStaff(BasePermission):
    def has_permission(self, req: Request, view: APIView) -> bool:
        return bool(req.user and req.user.is_staff)


class CRUDPermission(BasePermission):
    syntax = None
    exclude = None

    def has_permission(self, req: Request, view: APIView) -> bool:
        return self.check_permission(req)

    def check_permission(self, req: Request) -> bool:
        if not isinstance(self.syntax, str):
            raise NotImplementedError(
                "You must specify the syntax to use with the given permission"
            )
        check = self.get_action(req)
        if self.exclude and check in self.exclude:
            return True
        return req.user.has_perm(self.syntax % check)

    @staticmethod
    def get_action(req: Request) -> str:
        if "GET" == req.method:
            return "view"
        elif "POST" == req.method:
            return "add"
        elif "PUT" == req.method or "PATCH" == req.method:
            return "change"
        elif "DELETE" == req.method:
            return "delete"
        return "none"


class HasPermissions(BasePermission):
    permissions = []
    condition = "OR"

    def has_permission(self, req: Request, view: APIView) -> bool:
        i = 0
        is_or = "OR" == self.condition
        for perm in self.permissions:
            i += 1
            has_perm = req.user.has_perm(perm)
            if is_or and has_perm:
                return True
            elif not is_or and not has_perm:
                return False
        return True if 0 == i else not is_or
