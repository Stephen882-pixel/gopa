from rest_framework import viewsets
from apps.core.models import CMSPage
from apps.core.serializers.core import CMSPageSerializer
from apps.bones.drf.permissions import IsSuperUser 


class CMSPageViewSet(viewsets.ModelViewSet):
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageSerializer
    permission_classes = [IsSuperUser] 
    


    
    
    