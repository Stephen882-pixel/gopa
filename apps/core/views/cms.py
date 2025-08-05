from django.template.defaultfilters import title
from django.views.decorators.http import last_modified
from rest_framework import viewsets,status
from rest_framework.decorators import action, permission_classes
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
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action in ['create','update','partial_update']:
            permission_classes = [CMSContentManager]
        elif self.action == 'destroy':
            permission_classes = [IsSuperUser]
        elif self.action in ['publish','unpublish']:
            permission_classes = [CMSPublisher]
        elif self.action in ['my_pages','drafts']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'public':
            permission_classes = []
        else:
            permission_classes  = [IsSuperUser]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list':
            return CMSPageListSerializer
        elif self.action == 'public':
            return CMSPagePublicSerializer
        return CMSPageSerializer

    def get_queryset(self):
         queryset = CMSPage.objects.all()
         if self.action == 'public':
             return queryset.filter(published=True)
         if not self.request.user.is_authenticated:
             return queryset.none()

         if (self.request.user.is_superuser or
         self.request.user.has_perm("core.manage_all_cmspages")):
             return queryset

         if self.action in ['list','retrieve']:
             return queryset.filter(
                 Q(author=self.request.user) | Q(published=True)
             )

         return queryset.filter(author=self.request.user)

    def perform_create(self,serializer):
        serializer.save(
            author = self.request.user,
            last_modified_by=self.request.user
        )
    def perform_update(self, serializer):
        serializer.save(last_modified_by=self.request.user)

    @action(detail=True,methods=['post'])
    def publish(self,request,slug=None):
        page = self.get_object()

        if not page.published:
            page.published = True
            page.published_at = timezone.now()
            page.last_modified_by = request.user
            page.save()


            return Response({
                'status':'published',
                'message':f'page "{page.title}" has been published.',
                'published_at':page.published_at
            })
        else:
            return Response({
                'status':'already published',
                'message':f'page "{page.title}" is already published.'
            },status=status.HTTP_400_BAD_REQUEST)

        @action(detail=True,methods=['post'])
        def unpublish(self,request,slug=None):
            page = self.get_object()

            if page.published:
                page.published = False
                page.last_modified_by = request.user
                page.save()

                return Response({
                    'status':'unpublished',
                    'message':f'page "{page.title}" has been unpublished '
                })
            else:
                return Response({
                    'status':'already unpublished',
                    'message':f' page "{page.title}" is already unpublished. '
                },status=status.HTTP_400_BAD_REQUEST)

        @action(detail=False,methods=['get'])
        def my_pages(self,request):
            queryset = self.get_queryset().filter(author=request.user)


            search = request.query_params.get('search',None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontain=search) |
                    Q(body__icontains=search) |
                    Q(slug__icontain=search)
                )

            published_filter = request.query_params.get('published',None)
            if published_filter is not None:
                queryset = queryset.filter(published=published_filter.lower() == 'true')
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = CMSPageListSerializer(page,many=True)
                return self.get_paginated_response(serializer.data)

            serializer = CMSPageListSerializer(queryset,many=True)
            return Response(serializer.data)

        @action(detail=False,methods=['get'])
        def drafts(self,request):
            queryset = self.get_queryset().filter(published=False)

            page = self.paginate_queryset().filter(published=True)
            if page is not None:
                serializer = CMSPageListSerializer(page,many=True)
                return self.get_paginated_response(serializer.data)
            serializer = CMSPageListSerializer(queryset,many=True)
            return Response(serializer.data)


        @action(detail=False,methods=['get'],permission_classes = [])
        def public(self,request):
            queryset = self.get_queryset()

            search = request.query_params.get('search',None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(body__icontains=search)
                )
            page = self.paginat.queryset(queryset)
            if page is not  None:
                serializer = CMSPagePublicSerializer(page,many=True)
                return Response(serializer.data)

        @action(detail=False,methods=['get'])
        def stats(self,request):
            if request.user.is_superuser or request.user.has_perm('core.manage.all_cmspages'):
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
                'total_pages':total_pages,
                'published_pages':published_pages,
                'draft_pages':draft_pages,
                'user_pages':user_pages,
                'user_permissions':{
                    'can_create':request.user.has_perm('core.add.cmspage') or request.user.is_staff,
                    'can_publish':(request.user.has_perm('core.publish_cmspage') or
                                   request.user.is_staff or request.user.is_superuser),
                    'can_manage_all':(request.user.has_perm('core.manage_all_cmspages') or
                                      request.user.is_superuser),
                    'can_delete':request.user.is_superuser
                }
            })




    


    
    
    