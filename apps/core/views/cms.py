from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from apps.core.models import CMSPage
from apps.core.serializers.core import (
    CMSPageSerializer,
    CMSPageListSerializer,
    CMSPagePublicSerializer
)
from apps.bones.drf.permissions import (
    IsSuperUser,
    CMSContentManager,
    CMSEditor,
    CMSPublisher,
    CMSViewOnly
)


class CMSPageViewSet(viewsets.ModelViewSet):
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageSerializer
    permission_classes = [IsSuperUser]
    lookup_field = 'slug'

    def get_permissions(self):
    


    
    
    