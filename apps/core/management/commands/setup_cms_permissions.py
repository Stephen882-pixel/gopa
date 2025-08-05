from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group,Permission
from django.contrib.contenttypes.models import ContentType
from apps.core.models import CMSPage

class Command(BaseCommand):
    help = "Set up CMS Permissions and user groups"

    def add_arguments(self,parser):
        parser.add_argument(
            '--create-groups',
            action='store_true',
            help='Create predefined user groups for the CMS Page',
        )
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up CMS permissions'))

        content_type = ContentType.objects.get_for_model(CMSPage)
        custom_permissions = [
            ('publish_cmspage','Can publish/unpublish CMS pages'),
            ('manage_all_cmspages','Can manage all CMS pages regardless of author'),
        ]
        for codename, name in custom_permissions:
            permission, created = Permission.objects.get_or_create(
                codename=codename,
                content_type=content_type,
                defaults={'name':name}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created permission:{name}')
                )
            else:
                self.style.SUCCESS(f'permission already exists:{name}')
        if  options['create_groups']:
            self.create_cms_groups()
        self.stdout.write(
            self.style.SUCCESS(f'CMS permissions setup completed successfully')
        )

    def create_cms_groups(self):
        self.stdout.write('Creating CMS User groups')

        content_type = ContentType.objects.get_for_model(CMSPage)

        groups_config = {
            'CMS Viewers':{
                'description':'Can view CMS Pages',
                'permissions':[
                    'view_cmspage'
                ]
            },
            'CMS Editors':{
                'description':'Can edit existing CMS Pages but not create or delete',
                'permissions':[
                    'view_cmspage',
                    'change_cmspage'
                ]
            },
            'CMS Content Managers':{
                'description':'Can create, edit, and publish CMS Pages but not delete',
                'permissions':[
                    'view_cmspage',
                    'add_cms_page',
                    'change_cmspage',
                    'publish_cmspage'
                ]
            },
            'CMS Publishers':{
                'description':'Can publish/unpublish CMS pages',
                'permissions':[
                    'view_cmspage',
                    'change_cmspage',
                    'publish_cmspage'
                ]
            },
            'CMS Administrators':{
                'description':'Has full access to CMS functionality',
                'permissions':[
                    'view_cmspage',
                    'add_cmspage',
                    'change_cmspage',
                    'delete_cmspage',
                    'publish_cmspage',
                    'manage_all_cmspage'
                ]
            },
        }

        for group_name, config in groups_config.items():
            group, created = Group.objects.get_or_create(name=group_name)

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created group:{group_name}')
                )
            else:
                self.stdout.write(f'Group already exists: {group_name}')
                group.permissions.clear()

            for permission_codename in config['permissions']:
                try:
                    permission = Permission.objects.get(
                        codename=permission_codename,
                        content_type=content_type
                    )
                    group.permissions.add(permission)
                    self.stdout.write(
                        f'Added Permission "{permission_codename}" to {group_name} '
                    )
                except Permission.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f' Permission "{permission_codename}" not found for {group_name} '
                        )
                    )

            self.stdout.write(
                self.style.SUCCESS('CMS user groups created successfully')
            )

            # Usage Instructions