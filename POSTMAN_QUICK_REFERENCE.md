# CMS API - Postman Quick Reference

## 🚀 Quick Start

### Environment Setup
```
base_url: http://localhost:8000
api_base: {{base_url}}/api/cms/pages
```

### Test Credentials
- **Admin**: `admin` / `admin123` (Full access)
- **Manager**: `manager` / `manager123` (Create, Edit, Publish)
- **Editor**: `editor` / `editor123` (Edit only)
- **Publisher**: `publisher` / `publisher123` (Publish/Unpublish)

## 🔑 Authentication

**POST** `{{base_url}}/api/auth/login/`
```json
{
    "username": "admin",
    "password": "admin123"
}
```

## 📝 Essential Endpoints

### 1. **Get Public Pages** (No Auth)
**GET** `{{api_base}}/public/`

### 2. **Create Page**
**POST** `{{api_base}}/`
```json
{
    "slug": "test-page",
    "title": "Test Page",
    "body": "This is test content.",
    "meta_description": "Test page description",
    "published": false
}
```

### 3. **Get Page by Slug**
**GET** `{{api_base}}/test-page/`

### 4. **Update Page**
**PUT** `{{api_base}}/test-page/`
```json
{
    "slug": "test-page",
    "title": "Updated Test Page",
    "body": "Updated content here.",
    "published": false
}
```

### 5. **Publish Page**
**POST** `{{api_base}}/test-page/publish/`
*(Empty body)*

### 6. **Get My Pages**
**GET** `{{api_base}}/my_pages/`

### 7. **Get Statistics**
**GET** `{{api_base}}/stats/`

## 🎯 Sample Request Bodies

### Blog Post
```json
{
    "slug": "my-blog-post",
    "title": "My Amazing Blog Post",
    "body": "# Welcome\n\nThis is my first blog post with **markdown** support!\n\n## Features\n- Easy to use\n- SEO friendly\n- Responsive design",
    "meta_description": "My first amazing blog post about our platform",
    "meta_keywords": "blog, post, platform, amazing",
    "published": true
}
```

### Landing Page
```json
{
    "slug": "homepage",
    "title": "Welcome to Our Platform",
    "body": "# Transform Your Business\n\nDiscover how our platform can help you achieve more.\n\n## Why Choose Us?\n- Proven Results\n- Expert Support\n- Cutting-edge Technology\n\n[Get Started Today](#cta)",
    "meta_description": "Transform your business with our innovative platform. Get started today!",
    "meta_keywords": "platform, business, transformation, innovation",
    "published": true
}
```

## 🔍 Search & Filter Examples

- **Search**: `{{api_base}}/public/?search=platform`
- **Filter Drafts**: `{{api_base}}/my_pages/?published=false`
- **Combined**: `{{api_base}}/my_pages/?search=blog&published=true`

## ⚡ Headers for Auth Requests
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

## 🎯 Expected Status Codes
- **200**: Success (GET, PUT, PATCH, Actions)
- **201**: Created (POST)
- **204**: No Content (DELETE)
- **400**: Bad Request (Validation errors)
- **401**: Unauthorized (No/invalid token)
- **403**: Forbidden (No permission)
- **404**: Not Found (Page doesn't exist)

## 🧪 Permission Testing

| Action | Admin | Manager | Editor | Publisher |
|--------|-------|---------|--------|-----------|
| View | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ |
| Edit | ✅ | ✅ | ✅ | ❌ |
| Publish | ✅ | ✅ | ❌ | ✅ |
| Delete | ✅ | ❌ | ❌ | ❌ |

## 🚨 Common Issues

1. **403 Forbidden**: Check user permissions and group assignment
2. **400 Slug Error**: Use only lowercase letters, numbers, and hyphens
3. **401 Unauthorized**: Verify token in Authorization header
4. **404 Not Found**: Check slug spelling in URL

## 💡 Pro Tips

- Use the `/stats/` endpoint to check your permissions
- Test with different users to verify permission restrictions
- Use `/my_pages/` to see only your content
- The `/public/` endpoint works without authentication