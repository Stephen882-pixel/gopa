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


# CMS-specific permission classes
class CMSPermission(CRUDPermission):
    """
    Base CMS permission class that uses Django's built-in permission system
    for CMS content management.
    """
    syntax = "core.%s_cmspage"


class CMSContentManager(BasePermission):
    """
    Permission class for CMS content managers.
    Allows content managers to create, read, and update CMS pages but not delete them.
    """
    def has_permission(self, req: Request, view: APIView) -> bool:
        if not req.user or not req.user.is_authenticated:
            return False
        
        # Allow read access to all authenticated users
        if req.method == "GET":
            return True
        
        # Allow content managers to create and update
        if req.method in ["POST", "PUT", "PATCH"]:
            return (req.user.is_staff or 
                   req.user.has_perm("core.add_cmspage") or 
                   req.user.has_perm("core.change_cmspage"))
        
        # Only superusers can delete
        if req.method == "DELETE":
            return req.user.is_superuser
        
        return False


class CMSEditor(BasePermission):
    """
    Permission class for CMS editors.
    Allows editors to read and update existing CMS pages but not create or delete them.
    """
    def has_permission(self, req: Request, view: APIView) -> bool:
        if not req.user or not req.user.is_authenticated:
            return False
        
        # Allow read access
        if req.method == "GET":
            return True
        
        # Allow editors to update existing content
        if req.method in ["PUT", "PATCH"]:
            return (req.user.is_staff or 
                   req.user.has_perm("core.change_cmspage"))
        
        # Only content managers and above can create
        if req.method == "POST":
            return (req.user.is_superuser or 
                   req.user.has_perm("core.add_cmspage"))
        
        # Only superusers can delete
        if req.method == "DELETE":
            return req.user.is_superuser
        
        return False


class CMSPublisher(BasePermission):
    """
    Permission class for publishing/unpublishing CMS content.
    Only allows users with specific publish permissions to change the published status.
    """
    def has_permission(self, req: Request, view: APIView) -> bool:
        if not req.user or not req.user.is_authenticated:
            return False
        
        # Check if user is trying to modify published status
        if req.method in ["PUT", "PATCH", "POST"]:
            # This will be further validated in the view/serializer
            return (req.user.is_staff or 
                   req.user.has_perm("core.change_cmspage") or
                   req.user.has_perm("core.add_cmspage"))
        
        return True


class CMSViewOnly(BasePermission):
    """
    Permission class for read-only access to CMS content.
    """
    def has_permission(self, req: Request, view: APIView) -> bool:
        if req.method == "GET":
            return req.user and req.user.is_authenticated
        return False
