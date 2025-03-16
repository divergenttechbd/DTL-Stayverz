from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from base.type_choices import BlogStatusOption
from blogs.models import Blog
from blogs.serializers import BlogSerializer


class PublicBlogListAPIView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogSerializer
    queryset = Blog.objects.filter(status=BlogStatusOption.PUBLISHED).order_by(
        "-created_at"
    )
    search_fields = ("title",)
    swagger_tags = ["Public Blog"]


class PublicBlogRetrieveAPIView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = BlogSerializer
    queryset = Blog.objects.filter()
    lookup_field = "slug"
    search_fields = ("title",)
    swagger_tags = ["Public Blog"]
