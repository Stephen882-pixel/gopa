from rest_framework import viewsets, mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination


class SFOrderingFilter(OrderingFilter):
    def get_valid_fields(self, queryset, view, context=None):
        if not hasattr(view, "ordering_fields") and hasattr(view, "search_fields"):
            setattr(view, "ordering_fields", view.search_fields)
        return super().get_valid_fields(queryset, view, context or {})


class SFPageNumberPagination(PageNumberPagination):
    page_size_query_param = "limit"
    page_size = 10


class SFListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    filter_backends = [SearchFilter, SFOrderingFilter]
    pagination_class = SFPageNumberPagination

    def list(self, request, *args, **kwargs):
        res = super().list(request, *args, **kwargs)
        res.data["total"] = self.get_queryset().count()
        return res


class SFModelViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    SFListViewSet,
):
    pass
