from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from base.helpers.decorators import exception_handler
from base.helpers.utils import create_slug, my_random_string
from base.permissions import IsStaff
from blogs.filters import BlogFilter
from blogs.models import Blog
from blogs.serializers import BlogSerializer


class AdminBlogListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsStaff,)
    serializer_class = BlogSerializer
    filterset_class = BlogFilter
    queryset = Blog.objects.filter().order_by("-created_at")
    search_fields = ("title",)
    swagger_tags = ["Admin Blog"]

    def get_queryset(self):
        qs = Blog.objects.filter()
        sort_by = self.request.query_params.get("sort_by")
        if sort_by == "oldest":
            qs = qs.order_by("created_at")
        elif sort_by == "newest":
            qs = qs.order_by("-created_at")
        else:
            qs = qs.order_by("-created_at")
        return qs

    @method_decorator(exception_handler)
    def create(self, request, *args, **kwargs):
        request.data["slug"] = create_slug(
            title=request.data["title"], random_str=my_random_string(string_length=10)
        )

        return super(AdminBlogListCreateAPIView, self).create(request, *args, **kwargs)


class AdminBlogRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsStaff,)
    serializer_class = BlogSerializer
    queryset = Blog.objects.filter()
    http_method_names = ["get", "patch"]
    removeable_keys = ("slug",)
    swagger_tags = ["Admin Blog"]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = BlogSerializer(
            instance=instance,
            data=request.data,
            partial=True,
            exclude_fields=self.removeable_keys,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Blog updated"}, status=status.HTTP_200_OK)
