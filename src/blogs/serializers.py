from base.serializers import DynamicFieldsModelSerializer
from blogs.models import Blog


class BlogSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Blog
        fields = "__all__"
