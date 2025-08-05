from django.urls import path

from apps.core.views import profile

app_name = "profile"

urlpatterns = [
    path("image/", profile.ImageView.as_view(), name="image"),
    path("creds/", profile.ProfileCredsView.as_view(), name="creds"),
    path("update/", profile.ProfileUpdateView.as_view(), name="update"),
]
