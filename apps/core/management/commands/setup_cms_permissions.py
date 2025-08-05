from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.core.models import CMSPage


class Command(BaseCommand):
    help = 'Set up CMS permissions and user groups'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-groups',
            action='store_true',
            help='Create predefined user groups for CMS management',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up CMS permissions...'))
        
        # Get or create content type for CMSPage
        content_type = ContentType.objects.get_for_model(CMSPage)
        
        # Define custom permissions (these are added to the model's Meta.permissions)
        custom_permissions = [
            ('publish_cmspage', 'Can publish/unpublish CMS pages'),
            ('manage_all_cmspages', 'Can manage all CMS pages regardless of author'),
        ]
        
        # Create custom permissions if they don't exist
        for codename, name in custom_permissions:
            permission, created = Permission.objects.get_or_create(
                codename=codename,
                content_type=content_type,
                defaults={'name': name}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created permission: {name}')
                )
            else:
                self.stdout.write(f'Permission already exists: {name}')
        
        if options['create_groups']:
            self.create_cms_groups()
        
        self.stdout.write(
            self.style.SUCCESS('CMS permissions setup completed successfully!')
        )

    def create_cms_groups(self):
        """Create predefined user groups with appropriate permissions"""
        self.stdout.write('Creating CMS user groups...')
        
        # Get content type and permissions
        content_type = ContentType.objects.get_for_model(CMSPage)
        
        # Define groups and their permissions
        groups_config = {
            'CMS Viewers': {
                'description': 'Can view CMS pages',
                'permissions': [
                    'view_cmspage',
                ]
            },
            'CMS Editors': {
                'description': 'Can edit existing CMS pages but not create or delete',
                'permissions': [
                    'view_cmspage',
                    'change_cmspage',
                ]
            },
            'CMS Content Managers': {
                'description': 'Can create, edit, and publish CMS pages but not delete',
                'permissions': [
                    'view_cmspage',
                    'add_cmspage',
                    'change_cmspage',
                    'publish_cmspage',
                ]
            },
            'CMS Publishers': {
                'description': 'Can publish/unpublish CMS pages',
                'permissions': [
                    'view_cmspage',
                    'change_cmspage',
                    'publish_cmspage',
                ]
            },
            'CMS Administrators': {
                'description': 'Full access to CMS functionality',
                'permissions': [
                    'view_cmspage',
                    'add_cmspage',
                    'change_cmspage',
                    'delete_cmspage',
                    'publish_cmspage',
                    'manage_all_cmspages',
                ]
            },
        }
        
        for group_name, config in groups_config.items():
            # Create or get the group
            group, created = Group.objects.get_or_create(name=group_name)
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created group: {group_name}')
                )
            else:
                self.stdout.write(f'Group already exists: {group_name}')
                # Clear existing permissions to reset them
                group.permissions.clear()
            
            # Add permissions to the group
            for permission_codename in config['permissions']:
                try:
                    permission = Permission.objects.get(
                        codename=permission_codename,
                        content_type=content_type
                    )
                    group.permissions.add(permission)
                    self.stdout.write(
                        f'  Added permission "{permission_codename}" to {group_name}'
                    )
                except Permission.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f'  Permission "{permission_codename}" not found for {group_name}'
                        )
                    )
        
        self.stdout.write(
            self.style.SUCCESS('CMS user groups created successfully!')
        )
        
        # Display usage instructions
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('USAGE INSTRUCTIONS:'))
        self.stdout.write('='*60)
        self.stdout.write(
            'To assign users to groups, use the Django admin interface or:'
        )
        self.stdout.write('  python manage.py shell')
        self.stdout.write('  >>> from django.contrib.auth.models import User, Group')
        self.stdout.write('  >>> user = User.objects.get(username="username")')
        self.stdout.write('  >>> group = Group.objects.get(name="CMS Content Managers")')
        self.stdout.write('  >>> user.groups.add(group)')
        self.stdout.write('')
        self.stdout.write('Available groups:')
        for group_name, config in groups_config.items():
            self.stdout.write(f'  - {group_name}: {config["description"]}')
        self.stdout.write('')