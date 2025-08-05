# Postman Testing Guide for CMS API

## Base Configuration

### Environment Variables
Create a Postman environment with these variables:
- `base_url`: `http://localhost:8000`
- `api_base`: `{{base_url}}/api/cms/pages`
- `auth_token`: (will be set after authentication)

### Headers
For authenticated requests, add this header:
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

## Authentication Setup

Since your project uses a custom token system, you'll need to get a token first. Here's how to set up authentication:

### 1. Get Authentication Token
**Method**: POST  
**URL**: `{{base_url}}/api/auth/login/`  
**Body** (raw JSON):
```json
{
    "username": "admin",
    "password": "your_admin_password"
}
```

**Note**: You'll need to set a password for the admin user first:
```bash
python manage.py shell -c "
from django.contrib.auth.models import User
admin = User.objects.get(username='admin')
admin.set_password('admin123')
admin.save()
"
```

## CMS API Testing Requests

### 1. Get All Pages (Public Access)
**Method**: GET  
**URL**: `{{api_base}}/public/`  
**Headers**: None required  
**Body**: None

### 2. Get All Pages (Authenticated)
**Method**: GET  
**URL**: `{{api_base}}/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 3. Create New Page (Draft)
**Method**: POST  
**URL**: `{{api_base}}/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "slug": "getting-started",
    "title": "Getting Started Guide",
    "body": "# Welcome to Our Platform\n\nThis is a comprehensive guide to help you get started with our platform. Here you'll find everything you need to know to begin your journey.\n\n## What You'll Learn\n\n- How to create your first project\n- Understanding the dashboard\n- Setting up your profile\n- Best practices and tips\n\n## Getting Started\n\nFollow these simple steps:\n\n1. **Create your account** - Sign up with your email\n2. **Verify your email** - Check your inbox for verification\n3. **Complete your profile** - Add your information\n4. **Explore the dashboard** - Familiarize yourself with the interface\n\nLet's begin this exciting journey together!",
    "meta_description": "Complete guide to getting started with our platform. Learn the basics and best practices.",
    "meta_keywords": "getting started, guide, tutorial, platform, beginner",
    "published": false
}
```

### 4. Create New Page (Published)
**Method**: POST  
**URL**: `{{api_base}}/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "slug": "about-us",
    "title": "About Our Company",
    "body": "# About Our Company\n\n## Our Mission\n\nWe are dedicated to providing innovative solutions that transform the way businesses operate in the digital age.\n\n## Our Story\n\nFounded in 2020, our company has grown from a small startup to a leading provider of digital solutions. We believe in the power of technology to create positive change.\n\n## Our Values\n\n- **Innovation**: We constantly push the boundaries of what's possible\n- **Quality**: We deliver excellence in everything we do\n- **Integrity**: We operate with honesty and transparency\n- **Customer Focus**: Our customers are at the heart of everything we do\n\n## Our Team\n\nOur diverse team of experts brings together decades of experience in technology, business, and design.\n\n## Contact Us\n\nReady to work with us? Get in touch today!",
    "meta_description": "Learn about our company's mission, values, and the team behind our innovative solutions.",
    "meta_keywords": "about us, company, mission, values, team, innovation",
    "published": true
}
```

### 5. Get Specific Page by Slug
**Method**: GET  
**URL**: `{{api_base}}/getting-started/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 6. Update Existing Page
**Method**: PUT  
**URL**: `{{api_base}}/getting-started/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "slug": "getting-started",
    "title": "Complete Getting Started Guide",
    "body": "# Welcome to Our Platform - Updated!\n\nThis is an updated and comprehensive guide to help you get started with our platform.\n\n## What's New in This Update\n\n- Added video tutorials\n- Updated screenshots\n- New troubleshooting section\n- Enhanced examples\n\n## What You'll Learn\n\n- How to create your first project\n- Understanding the dashboard\n- Setting up your profile\n- Best practices and tips\n- Advanced features and shortcuts\n\n## Getting Started\n\nFollow these simple steps:\n\n1. **Create your account** - Sign up with your email\n2. **Verify your email** - Check your inbox for verification\n3. **Complete your profile** - Add your information\n4. **Explore the dashboard** - Familiarize yourself with the interface\n5. **Try the tutorials** - Practice with our interactive guides\n\n## Troubleshooting\n\nIf you encounter any issues:\n- Check our FAQ section\n- Contact our support team\n- Visit our community forum\n\nLet's begin this exciting journey together!",
    "meta_description": "Updated complete guide to getting started with our platform. Now includes video tutorials and troubleshooting.",
    "meta_keywords": "getting started, guide, tutorial, platform, beginner, updated, video",
    "published": false
}
```

### 7. Partial Update (PATCH)
**Method**: PATCH  
**URL**: `{{api_base}}/getting-started/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "title": "Ultimate Getting Started Guide",
    "meta_description": "The ultimate guide to getting started with our platform. Includes everything you need to know."
}
```

### 8. Publish a Page
**Method**: POST  
**URL**: `{{api_base}}/getting-started/publish/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body**: None (empty body)

### 9. Unpublish a Page
**Method**: POST  
**URL**: `{{api_base}}/about-us/unpublish/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body**: None (empty body)

### 10. Get Current User's Pages
**Method**: GET  
**URL**: `{{api_base}}/my_pages/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 11. Get Current User's Pages with Search
**Method**: GET  
**URL**: `{{api_base}}/my_pages/?search=guide&published=false`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 12. Get Draft Pages
**Method**: GET  
**URL**: `{{api_base}}/drafts/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 13. Get CMS Statistics
**Method**: GET  
**URL**: `{{api_base}}/stats/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

### 14. Search Public Pages
**Method**: GET  
**URL**: `{{api_base}}/public/?search=company`  
**Headers**: None required

### 15. Create Blog Post Example
**Method**: POST  
**URL**: `{{api_base}}/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "slug": "digital-transformation-2024",
    "title": "Digital Transformation Trends in 2024",
    "body": "# Digital Transformation Trends in 2024\n\n## Introduction\n\nAs we move further into 2024, digital transformation continues to reshape industries across the globe. Organizations are adopting new technologies and strategies to stay competitive in an increasingly digital world.\n\n## Key Trends\n\n### 1. Artificial Intelligence Integration\n\nAI is no longer a futuristic concept but a practical tool that businesses are implementing to:\n- Automate routine tasks\n- Enhance customer experiences\n- Improve decision-making processes\n- Optimize operations\n\n### 2. Cloud-First Strategies\n\nMore organizations are adopting cloud-first approaches:\n- **Scalability**: Easily scale resources up or down\n- **Cost Efficiency**: Pay only for what you use\n- **Flexibility**: Access from anywhere, anytime\n- **Security**: Enterprise-grade security features\n\n### 3. Data-Driven Decision Making\n\nCompanies are leveraging data analytics to:\n- Understand customer behavior\n- Predict market trends\n- Optimize business processes\n- Measure performance effectively\n\n### 4. Remote Work Technologies\n\nThe hybrid work model requires:\n- Collaboration tools\n- Virtual meeting platforms\n- Cloud-based file sharing\n- Secure remote access solutions\n\n## Implementation Strategies\n\n### Phase 1: Assessment\n- Evaluate current technology stack\n- Identify gaps and opportunities\n- Set clear objectives\n\n### Phase 2: Planning\n- Develop a roadmap\n- Allocate resources\n- Choose the right partners\n\n### Phase 3: Execution\n- Implement solutions gradually\n- Train your team\n- Monitor progress\n\n### Phase 4: Optimization\n- Gather feedback\n- Make adjustments\n- Scale successful initiatives\n\n## Challenges to Consider\n\n- **Change Management**: Helping employees adapt to new technologies\n- **Security Concerns**: Protecting data in digital environments\n- **Budget Constraints**: Balancing investment with ROI\n- **Technical Complexity**: Managing integration challenges\n\n## Best Practices\n\n1. **Start Small**: Begin with pilot projects\n2. **Focus on User Experience**: Prioritize solutions that improve user experience\n3. **Invest in Training**: Ensure your team has the skills needed\n4. **Measure Success**: Define KPIs and track progress\n5. **Stay Agile**: Be ready to adapt as technology evolves\n\n## Conclusion\n\nDigital transformation is not a destination but a continuous journey. Organizations that embrace change and invest in the right technologies will be better positioned for success in 2024 and beyond.\n\n---\n\n*Ready to start your digital transformation journey? Contact our experts today for a consultation.*",
    "meta_description": "Explore the key digital transformation trends shaping 2024. Learn about AI integration, cloud strategies, and implementation best practices.",
    "meta_keywords": "digital transformation, 2024 trends, artificial intelligence, cloud computing, data analytics, remote work, technology",
    "published": true
}
```

### 16. Create FAQ Page
**Method**: POST  
**URL**: `{{api_base}}/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`
- `Content-Type`: `application/json`

**Body** (raw JSON):
```json
{
    "slug": "frequently-asked-questions",
    "title": "Frequently Asked Questions",
    "body": "# Frequently Asked Questions\n\n## General Questions\n\n### What is this platform?\nOur platform is a comprehensive solution designed to help businesses streamline their operations and improve efficiency through digital tools and automation.\n\n### How do I get started?\nGetting started is easy! Simply sign up for an account, verify your email, and follow our getting started guide to set up your first project.\n\n### Is there a free trial?\nYes! We offer a 14-day free trial with full access to all features. No credit card required.\n\n## Account & Billing\n\n### How do I change my password?\n1. Go to your account settings\n2. Click on \"Security\"\n3. Select \"Change Password\"\n4. Enter your current and new password\n5. Click \"Update Password\"\n\n### What payment methods do you accept?\nWe accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts.\n\n### Can I cancel my subscription anytime?\nYes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.\n\n## Technical Support\n\n### How do I contact support?\nYou can reach our support team through:\n- Email: support@company.com\n- Live chat (available 24/7)\n- Phone: 1-800-123-4567\n- Support portal: support.company.com\n\n### What are your support hours?\nOur support team is available:\n- Email: 24/7\n- Live chat: 24/7\n- Phone: Monday-Friday, 9 AM - 6 PM EST\n\n### Do you offer training?\nYes! We provide:\n- Online tutorials and documentation\n- Webinar training sessions\n- One-on-one training for enterprise customers\n- Video guides and walkthroughs\n\n## Features & Functionality\n\n### Can I integrate with other tools?\nAbsolutely! Our platform offers integrations with popular tools including:\n- CRM systems (Salesforce, HubSpot)\n- Project management tools (Asana, Trello)\n- Communication platforms (Slack, Microsoft Teams)\n- Analytics tools (Google Analytics, Mixpanel)\n\n### Is my data secure?\nSecurity is our top priority. We use:\n- 256-bit SSL encryption\n- Regular security audits\n- GDPR compliance\n- SOC 2 Type II certification\n- Regular backups\n\n### Can I export my data?\nYes, you can export your data at any time in various formats including CSV, JSON, and PDF.\n\n## Troubleshooting\n\n### I forgot my password. What should I do?\n1. Go to the login page\n2. Click \"Forgot Password?\"\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link to create a new password\n\n### The platform is running slowly. What can I do?\n- Check your internet connection\n- Clear your browser cache\n- Try using a different browser\n- Contact support if the issue persists\n\n### I'm getting an error message. What should I do?\n- Take a screenshot of the error\n- Note what you were doing when the error occurred\n- Contact our support team with these details\n\n## Still Have Questions?\n\nIf you can't find the answer to your question here, don't hesitate to contact our support team. We're here to help!\n\n**Contact Information:**\n- Email: support@company.com\n- Live Chat: Available on our website\n- Phone: 1-800-123-4567\n- Support Portal: support.company.com",
    "meta_description": "Find answers to frequently asked questions about our platform, including account setup, billing, technical support, and troubleshooting.",
    "meta_keywords": "FAQ, frequently asked questions, help, support, troubleshooting, account, billing",
    "published": true
}
```

### 17. Delete a Page (Superuser Only)
**Method**: DELETE  
**URL**: `{{api_base}}/frequently-asked-questions/`  
**Headers**: 
- `Authorization`: `Bearer {{auth_token}}`

**Body**: None

## Testing Different Permission Levels

To test different permission levels, you'll need to create users with different roles:

### Create Test Users Script
Run this in Django shell:
```python
from django.contrib.auth.models import User, Group

# Create test users
editor = User.objects.create_user('editor', 'editor@test.com', 'editor123')
manager = User.objects.create_user('manager', 'manager@test.com', 'manager123')
publisher = User.objects.create_user('publisher', 'publisher@test.com', 'publisher123')

# Assign to groups
editor_group = Group.objects.get(name='CMS Editors')
manager_group = Group.objects.get(name='CMS Content Managers')
publisher_group = Group.objects.get(name='CMS Publishers')

editor.groups.add(editor_group)
manager.groups.add(manager_group)
publisher.groups.add(publisher_group)
```

### Authentication for Different Users
Use these credentials to test different permission levels:

**CMS Editor Login**:
```json
{
    "username": "editor",
    "password": "editor123"
}
```

**CMS Content Manager Login**:
```json
{
    "username": "manager",
    "password": "manager123"
}
```

**CMS Publisher Login**:
```json
{
    "username": "publisher",
    "password": "publisher123"
}
```

## Expected Responses

### Successful Page Creation (201 Created)
```json
{
    "id": 4,
    "slug": "getting-started",
    "title": "Getting Started Guide",
    "body": "# Welcome to Our Platform...",
    "published": false,
    "meta_description": "Complete guide to getting started with our platform...",
    "meta_keywords": "getting started, guide, tutorial, platform, beginner",
    "author": 1,
    "author_username": "admin",
    "last_modified_by": 1,
    "last_modified_by_username": "admin",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "published_at": null
}
```

### Successful Publish Action (200 OK)
```json
{
    "status": "published",
    "message": "Page \"Getting Started Guide\" has been published.",
    "published_at": "2024-01-15T10:35:00Z"
}
```

### Permission Denied (403 Forbidden)
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### Page Not Found (404 Not Found)
```json
{
    "detail": "Not found."
}
```

## Postman Collection Setup

1. Create a new collection called "CMS API Tests"
2. Add the environment variables mentioned above
3. Create folders for different test categories:
   - Authentication
   - Public Endpoints
   - CRUD Operations
   - Publishing Actions
   - User-specific Endpoints
   - Permission Testing

4. Add pre-request scripts for automatic token management:
```javascript
// Pre-request script for authenticated requests
if (!pm.environment.get("auth_token")) {
    console.log("No auth token found, please login first");
}
```

5. Add tests to verify responses:
```javascript
// Test script example
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('slug');
    pm.expect(jsonData).to.have.property('title');
    pm.expect(jsonData).to.have.property('author_username');
});
```

This comprehensive guide should help you thoroughly test your CMS API using Postman!