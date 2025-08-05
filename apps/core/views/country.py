from countries_plus.models import Country
from django.utils.decorators import method_decorator
from rest_framework import mixins

from apps.bones import swagger as sg
from apps.bones.drf import SFListViewSet
from apps.bones.drf.permissions import IsAuthorized
from apps.core.serializers import CountrySerializer, DTCountrySerializer


@method_decorator(
    name="list",
    decorator=sg.decorator(
        tag="Pages",
        schema=DTCountrySerializer,
        has_validation=False,
        operation_summary="a paginated view for the countries within the app",
    ),
)
@method_decorator(
    name="retrieve",
    decorator=sg.decorator(
        tag="Pages",
        schema=CountrySerializer,
        has_validation=False,
        operation_summary="fetch country information using the specified index",
    ),
)
class CountryView(mixins.RetrieveModelMixin, SFListViewSet):
    permission_classes = [IsAuthorized]
    serializer_class = CountrySerializer
    queryset = Country.objects.all()
    search_fields = ["name", "iso", "iso3"]
