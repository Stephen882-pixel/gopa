# Content Management System (CMS) Documentation

## Overview

This CMS system provides a comprehensive content management solution with role-based permissions, author tracking, and a RESTful API. The system is built on Django REST Framework and includes both API endpoints and Django admin interface for content management.

## Features

- **Role-based Access Control**: Five different permission levels for different user types
- **Author Tracking**: Track who created and last modified each page
- **Publishing Workflow**: Draft/Published status with publishing timestamps
- **SEO Support**: Meta descriptions and keywords for search engine optimization
- **RESTful API**: Complete CRUD operations with custom endpoints
- **Django Admin Integration**: Rich admin interface for content management
- **Bulk Operations**: Admin actions for publishing/unpublishing multiple pages
- **Search and Filtering**: Full-text search and filtering capabilities

## Models

### CMSPage Model

```python
class CMSPage(models.Model):
    slug = models.SlugField(unique=True)  # URL-friendly identifier
    title = models.CharField(max_length=255)
    body = models.TextField()  # Main content
    published = models.BooleanField(default=False)
    
    # Author tracking
    author = models.ForeignKey(User, ...)  # Who created the page
    last_modified_by = models.ForeignKey(User, ...)  # Who last modified
    
    # SEO fields
    meta_description = models.CharField(max_length=160)
    meta_keywords = models.CharField(max_length=255)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
```

## Permission System

### User Groups

The system includes five predefined user groups with different permission levels:

1. **CMS Viewers**
   - Can view CMS pages
   - Permissions: `view_cmspage`

2. **CMS Editors** 
   - Can edit existing CMS pages but not create or delete
   - Permissions: `view_cmspage`, `change_cmspage`

3. **CMS Content Managers**
   - Can create, edit, and publish CMS pages but not delete
   - Permissions: `view_cmspage`, `add_cmspage`, `change_cmspage`, `publish_cmspage`

4. **CMS Publishers**
   - Can publish/unpublish CMS pages
   - Permissions: `view_cmspage`, `change_cmspage`, `publish_cmspage`

5. **CMS Administrators**
   - Full access to CMS functionality
   - Permissions: All CMS permissions including `delete_cmspage`, `manage_all_cmspages`

### Custom Permissions

- `publish_cmspage`: Can publish/unpublish CMS pages
- `manage_all_cmspages`: Can manage all CMS pages regardless of author

## API Endpoints

### Base URL: `/api/cms/pages/`

#### Standard CRUD Operations

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| GET | `/api/cms/pages/` | List all pages (filtered by permissions) | Authenticated |
| POST | `/api/cms/pages/` | Create a new page | CMSContentManager |
| GET | `/api/cms/pages/{slug}/` | Retrieve a specific page | Authenticated |
| PUT | `/api/cms/pages/{slug}/` | Update a specific page | CMSContentManager |
| PATCH | `/api/cms/pages/{slug}/` | Partially update a page | CMSContentManager |
| DELETE | `/api/cms/pages/{slug}/` | Delete a page | SuperUser only |

#### Custom Action Endpoints

| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|-------------------|
| GET | `/api/cms/pages/my_pages/` | Get current user's pages | Authenticated |
| GET | `/api/cms/pages/drafts/` | Get unpublished pages | Authenticated |
| GET | `/api/cms/pages/public/` | Get published pages (public access) | None |
| GET | `/api/cms/pages/stats/` | Get CMS statistics | Authenticated |
| POST | `/api/cms/pages/{slug}/publish/` | Publish a page | CMSPublisher |
| POST | `/api/cms/pages/{slug}/unpublish/` | Unpublish a page | CMSPublisher |

### Query Parameters

#### List Endpoints
- `search`: Full-text search across title, body, and meta fields
- `published`: Filter by published status (`true`/`false`)

#### Example Requests

```bash
# Get all published pages
GET /api/cms/pages/public/

# Search for pages containing "django"
GET /api/cms/pages/public/?search=django

# Get current user's draft pages
GET /api/cms/pages/my_pages/?published=false

# Publish a page
POST /api/cms/pages/my-page-slug/publish/
```

## Serializers

### CMSPageSerializer
Full serializer with all fields including author information and metadata.

### CMSPageListSerializer
Lightweight serializer for list views with essential fields only.

### CMSPagePublicSerializer
Public-facing serializer without sensitive information.

## Permission Classes

### Custom Permission Classes

- `CMSPermission`: Base CMS permission using Django's built-in system
- `CMSContentManager`: Allows create, read, update (not delete)
- `CMSEditor`: Allows read and update existing content only
- `CMSPublisher`: Controls publishing/unpublishing permissions
- `CMSViewOnly`: Read-only access

## Django Admin Interface

The Django admin interface provides a rich content management experience:

### Features
- **Color-coded Status**: Visual indicators for published/draft status
- **Author Links**: Clickable links to author and modifier profiles
- **Bulk Actions**: Publish, unpublish, and duplicate multiple pages
- **Search and Filtering**: Full-text search and filtering by various fields
- **Permission-based Access**: Users see only content they have permission to manage
- **SEO Fields**: Collapsible sections for meta descriptions and keywords

### Admin Actions
- **Publish Selected Pages**: Bulk publish multiple pages
- **Unpublish Selected Pages**: Bulk unpublish multiple pages
- **Duplicate Selected Pages**: Create copies of existing pages

## Setup Instructions

### 1. Run Migrations

```bash
python manage.py migrate
```

### 2. Set Up Permissions and Groups

```bash
# Set up permissions only
python manage.py setup_cms_permissions

# Set up permissions and create user groups
python manage.py setup_cms_permissions --create-groups
```

### 3. Assign Users to Groups

#### Via Django Admin
1. Go to Django admin interface
2. Navigate to Users section
3. Edit a user and assign them to appropriate groups

#### Via Django Shell
```python
from django.contrib.auth.models import User, Group

# Get user and group
user = User.objects.get(username="username")
group = Group.objects.get(name="CMS Content Managers")

# Add user to group
user.groups.add(group)
```

## Usage Examples

### Creating Content via API

```python
import requests

# Create a new page
data = {
    "slug": "my-new-page",
    "title": "My New Page",
    "body": "This is the content of my new page.",
    "meta_description": "A description for SEO",
    "published": False  # Start as draft
}

response = requests.post(
    "http://localhost:8000/api/cms/pages/",
    json=data,
    headers={"Authorization": "Bearer your-token"}
)
```

### Publishing Content

```python
# Publish the page
response = requests.post(
    "http://localhost:8000/api/cms/pages/my-new-page/publish/",
    headers={"Authorization": "Bearer your-token"}
)
```

### Retrieving Content

```python
# Get all published pages (public access)
response = requests.get("http://localhost:8000/api/cms/pages/public/")

# Get user's pages
response = requests.get(
    "http://localhost:8000/api/cms/pages/my_pages/",
    headers={"Authorization": "Bearer your-token"}
)
```

## Security Features

### Permission-based Access Control
- Users can only see and modify content they have permission for
- Superusers have full access to all content
- Regular users can only modify their own content unless they have `manage_all_cmspages` permission

### Input Validation
- Slug validation ensures URL-safe identifiers
- Publishing permission validation prevents unauthorized publishing
- Author tracking prevents unauthorized modifications

### Data Integrity
- Automatic author and modification tracking
- Publishing timestamp management
- Unique slug enforcement

## Customization

### Adding Custom Permissions

1. Add permissions to the model's `Meta.permissions`:
```python
class Meta:
    permissions = [
        ("custom_permission", "Description of custom permission"),
    ]
```

2. Run migrations and update permission setup:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py setup_cms_permissions
```

### Extending the Model

To add new fields to the CMSPage model:

1. Update the model in `apps/core/models.py`
2. Update serializers in `apps/core/serializers/core.py`
3. Update admin configuration in `apps/core/admin.py`
4. Create and run migrations

### Custom Permission Classes

Create custom permission classes by extending `BasePermission`:

```python
class CustomCMSPermission(BasePermission):
    def has_permission(self, request, view):
        # Your custom logic here
        return True
```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure user is in the correct group
   - Check that permissions are properly set up
   - Verify API endpoints are using correct permission classes

2. **Migration Issues**
   - Run `python manage.py makemigrations` after model changes
   - Use `python manage.py migrate` to apply migrations

3. **Publishing Issues**
   - Verify user has `publish_cmspage` permission
   - Check that the page exists and user has access to it

### Debug Commands

```bash
# Check user permissions
python manage.py shell
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username="username")
>>> user.get_all_permissions()

# List all CMS groups
>>> from django.contrib.auth.models import Group
>>> Group.objects.filter(name__startswith="CMS")
```

## API Response Examples

### Page List Response
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "slug": "homepage",
      "title": "Homepage",
      "published": true,
      "author_username": "admin",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Page Detail Response
```json
{
  "id": 1,
  "slug": "homepage",
  "title": "Homepage", 
  "body": "Welcome to our website...",
  "published": true,
  "meta_description": "Welcome to our homepage",
  "meta_keywords": "homepage, welcome, website",
  "author": 1,
  "author_username": "admin",
  "last_modified_by": 1,
  "last_modified_by_username": "admin",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "published_at": "2024-01-01T12:00:00Z"
}
```

### Statistics Response
```json
{
  "total_pages": 25,
  "published_pages": 18,
  "draft_pages": 7,
  "user_pages": 5,
  "user_permissions": {
    "can_create": true,
    "can_publish": true,
    "can_manage_all": false,
    "can_delete": false
  }
}
```

This CMS system provides a robust foundation for content management with proper security, flexibility, and ease of use. The role-based permission system ensures that users can only access and modify content appropriate to their role, while the comprehensive API enables integration with frontend applications or external systems.