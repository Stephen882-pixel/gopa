from django.urls import path
from rest_framework import routers

from apps.core.views import auth, csp

from apps.core.views.auth.auth import SessionListView

app_name = "auth"
router = routers.SimpleRouter()

router.register(r"users", auth.UserView, basename="users")
router.register(r"user-groups", auth.UserGroupView, basename="user-groups")
router.register(r"groups", auth.GroupView, basename="groups")
router.register(r"permissions", auth.PermissionView, basename="permissions")
router.register(r"csp", csp.CSPView, basename="csp")
#router.register(r"sessions", SessionListView, basename="sessions")

urlpatterns = [
    path("csp-report/", csp.csp_report_view, name="csp-report"),
    path("login/", auth.LoginView.as_view(), name="login"),
    path("logout/", auth.LogoutView.as_view(), name="logout"),
    path(
        "register/confirm/",
        auth.RegisterConfirmView.as_view(),
        name="confirm-registration",
    ),
    path(
        "register/client/",
        auth.RegisterClientView.as_view(),
        name="client-registration",
    ),
    path(
        "register/reset/",
        auth.RegisterResetView.as_view(),
        name="reset-registration",
    ),
    path(
        "sessions/",
        SessionListView.as_view(),
        name="session-list",
    ),
] + router.urls
