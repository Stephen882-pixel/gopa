from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import CMSPage


@admin.register(CMSPage)
class CMSPageAdmin(admin.ModelAdmin):
    """
    Django admin configuration for CMS pages with comprehensive management features.
    """
    list_display = [
        'title', 'slug', 'published_status', 'author_link', 
        'last_modified_by_link', 'created_at', 'updated_at'
    ]
    list_filter = [
        'published', 'created_at', 'updated_at', 'author', 'last_modified_by'
    ]
    search_fields = ['title', 'slug', 'body', 'meta_description', 'meta_keywords']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = [
        'author', 'last_modified_by', 'created_at', 'updated_at', 'published_at'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'body')
        }),
        ('Publication', {
            'fields': ('published', 'published_at'),
            'description': 'Control the publication status of this page.'
        }),
        ('SEO & Metadata', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',),
            'description': 'Search engine optimization settings.'
        }),
        ('Tracking Information', {
            'fields': ('author', 'last_modified_by', 'created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': 'Information about who created and modified this page.'
        }),
    )
    
    # Customize the changelist
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    list_per_page = 25
    
    # Actions
    actions = ['make_published', 'make_unpublished', 'duplicate_pages']
    
    def published_status(self, obj):
        """Display published status with color coding"""
        if obj.published:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Published</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Draft</span>'
            )
    published_status.short_description = 'Status'
    published_status.admin_order_field = 'published'
    
    def author_link(self, obj):
        """Create a link to the author's user page"""
        if obj.author:
            url = reverse('admin:auth_user_change', args=[obj.author.pk])
            return format_html('<a href="{}">{}</a>', url, obj.author.username)
        return '-'
    author_link.short_description = 'Author'
    author_link.admin_order_field = 'author__username'
    
    def last_modified_by_link(self, obj):
        """Create a link to the last modifier's user page"""
        if obj.last_modified_by:
            url = reverse('admin:auth_user_change', args=[obj.last_modified_by.pk])
            return format_html('<a href="{}">{}</a>', url, obj.last_modified_by.username)
        return '-'
    last_modified_by_link.short_description = 'Last Modified By'
    last_modified_by_link.admin_order_field = 'last_modified_by__username'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('author', 'last_modified_by')
    
    def save_model(self, request, obj, form, change):
        """Set author and last_modified_by when saving through admin"""
        if not change:  # Creating new object
            obj.author = request.user
        
        obj.last_modified_by = request.user
        
        # Set published_at when first published
        if obj.published and not obj.published_at:
            obj.published_at = timezone.now()
        
        super().save_model(request, obj, form, change)
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly based on user permissions"""
        readonly_fields = list(self.readonly_fields)
        
        # Non-superusers can't change author
        if not request.user.is_superuser:
            if 'author' not in readonly_fields:
                readonly_fields.append('author')
        
        return readonly_fields
    
    def get_queryset(self, request):
        """Filter queryset based on user permissions"""
        qs = super().get_queryset(request)
        
        # Superusers see everything
        if request.user.is_superuser:
            return qs
        
        # Users with manage_all_cmspages permission see everything
        if request.user.has_perm('core.manage_all_cmspages'):
            return qs
        
        # Regular users see only their own pages
        return qs.filter(author=request.user)
    
    def has_change_permission(self, request, obj=None):
        """Check if user can change this specific object"""
        if not super().has_change_permission(request, obj):
            return False
        
        if obj is None:  # Checking general permission
            return True
        
        # Superusers can change anything
        if request.user.is_superuser:
            return True
        
        # Users with manage_all_cmspages can change anything
        if request.user.has_perm('core.manage_all_cmspages'):
            return True
        
        # Users can only change their own pages
        return obj.author == request.user
    
    def has_delete_permission(self, request, obj=None):
        """Only superusers can delete pages"""
        return request.user.is_superuser
    
    # Custom actions
    def make_published(self, request, queryset):
        """Bulk action to publish pages"""
        updated = 0
        for page in queryset:
            if not page.published:
                page.published = True
                if not page.published_at:
                    page.published_at = timezone.now()
                page.last_modified_by = request.user
                page.save()
                updated += 1
        
        if updated:
            self.message_user(request, f'{updated} pages were successfully published.')
        else:
            self.message_user(request, 'No pages were updated (already published).')
    make_published.short_description = "Publish selected pages"
    
    def make_unpublished(self, request, queryset):
        """Bulk action to unpublish pages"""
        updated = 0
        for page in queryset:
            if page.published:
                page.published = False
                page.last_modified_by = request.user
                page.save()
                updated += 1
        
        if updated:
            self.message_user(request, f'{updated} pages were successfully unpublished.')
        else:
            self.message_user(request, 'No pages were updated (already unpublished).')
    make_unpublished.short_description = "Unpublish selected pages"
    
    def duplicate_pages(self, request, queryset):
        """Bulk action to duplicate pages"""
        duplicated = 0
        for page in queryset:
            # Create a copy
            page.pk = None
            page.slug = f"{page.slug}-copy"
            page.title = f"{page.title} (Copy)"
            page.published = False
            page.published_at = None
            page.author = request.user
            page.last_modified_by = request.user
            page.save()
            duplicated += 1
        
        self.message_user(request, f'{duplicated} pages were successfully duplicated.')
    duplicate_pages.short_description = "Duplicate selected pages"
