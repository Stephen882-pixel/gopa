from rest_framework import viewsets, status
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
    """
    ViewSet for managing CMS pages with role-based permissions.
    
    Permissions:
    - Superusers: Full access to all operations
    - Content Managers: Can create, read, update (not delete)
    - Editors: Can read and update existing content (not create or delete)
    - Publishers: Can modify published status
    - View Only: Read-only access
    """
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageSerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        """
        Instantiate and return the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [CMSContentManager]
        elif self.action == 'destroy':
            permission_classes = [IsSuperUser]
        elif self.action in ['publish', 'unpublish']:
            permission_classes = [CMSPublisher]
        elif self.action in ['my_pages', 'drafts']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'public':
            permission_classes = []  # Public access
        else:
            permission_classes = [IsSuperUser]
        
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """
        Return the serializer class to use depending on the action.
        """
        if self.action == 'list':
            return CMSPageListSerializer
        elif self.action == 'public':
            return CMSPagePublicSerializer
        return CMSPageSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions and action.
        """
        queryset = CMSPage.objects.all()
        
        if self.action == 'public':
            # Only published pages for public access
            return queryset.filter(published=True)
        
        if not self.request.user.is_authenticated:
            return queryset.none()
        
        # Superusers and users with manage_all_cmspages permission see everything
        if (self.request.user.is_superuser or 
            self.request.user.has_perm('core.manage_all_cmspages')):
            return queryset
        
        # Regular users see only their own content and published content
        if self.action in ['list', 'retrieve']:
            return queryset.filter(
                Q(author=self.request.user) | Q(published=True)
            )
        
        # For other actions, users can only work with their own content
        return queryset.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        """Set the author when creating a new page."""
        serializer.save(
            author=self.request.user,
            last_modified_by=self.request.user
        )
    
    def perform_update(self, serializer):
        """Track who last modified the page."""
        serializer.save(last_modified_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        """Publish a CMS page."""
        page = self.get_object()
        
        if not page.published:
            page.published = True
            page.published_at = timezone.now()
            page.last_modified_by = request.user
            page.save()
            
            return Response({
                'status': 'published',
                'message': f'Page "{page.title}" has been published.',
                'published_at': page.published_at
            })
        else:
            return Response({
                'status': 'already_published',
                'message': f'Page "{page.title}" is already published.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, slug=None):
        """Unpublish a CMS page."""
        page = self.get_object()
        
        if page.published:
            page.published = False
            page.last_modified_by = request.user
            page.save()
            
            return Response({
                'status': 'unpublished',
                'message': f'Page "{page.title}" has been unpublished.'
            })
        else:
            return Response({
                'status': 'already_unpublished',
                'message': f'Page "{page.title}" is already unpublished.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_pages(self, request):
        """Get pages authored by the current user."""
        queryset = self.get_queryset().filter(author=request.user)
        
        # Apply search and filtering
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(body__icontains=search) |
                Q(slug__icontains=search)
            )
        
        published_filter = request.query_params.get('published', None)
        if published_filter is not None:
            queryset = queryset.filter(published=published_filter.lower() == 'true')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CMSPageListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CMSPageListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def drafts(self, request):
        """Get unpublished pages (drafts)."""
        queryset = self.get_queryset().filter(published=False)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CMSPageListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CMSPageListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def public(self, request):
        """Get published pages for public consumption."""
        queryset = self.get_queryset()  # Already filtered for published=True
        
        # Apply search
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(body__icontains=search) |
                Q(meta_description__icontains=search)
            )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = CMSPagePublicSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CMSPagePublicSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get CMS statistics for the current user."""
        if request.user.is_superuser or request.user.has_perm('core.manage_all_cmspages'):
            total_pages = CMSPage.objects.count()
            published_pages = CMSPage.objects.filter(published=True).count()
            draft_pages = CMSPage.objects.filter(published=False).count()
            user_pages = CMSPage.objects.filter(author=request.user).count()
        else:
            user_queryset = CMSPage.objects.filter(author=request.user)
            total_pages = user_queryset.count()
            published_pages = user_queryset.filter(published=True).count()
            draft_pages = user_queryset.filter(published=False).count()
            user_pages = total_pages
        
        return Response({
            'total_pages': total_pages,
            'published_pages': published_pages,
            'draft_pages': draft_pages,
            'user_pages': user_pages,
            'user_permissions': {
                'can_create': request.user.has_perm('core.add_cmspage') or request.user.is_staff,
                'can_publish': (request.user.has_perm('core.publish_cmspage') or 
                              request.user.is_staff or request.user.is_superuser),
                'can_manage_all': (request.user.has_perm('core.manage_all_cmspages') or 
                                 request.user.is_superuser),
                'can_delete': request.user.is_superuser
            }
        })
    


    
    
    