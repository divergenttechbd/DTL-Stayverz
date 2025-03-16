from django.urls import path

from blogs.views.admin import AdminBlogListCreateAPIView, AdminBlogRetrieveUpdateAPIView

app_name = "admin"

urlpatterns = [
    path(
        "blogs/",
        AdminBlogListCreateAPIView.as_view(),
        name="blog_list_create",
    ),
    path(
        "blogs/<int:pk>/",
        AdminBlogRetrieveUpdateAPIView.as_view(),
        name="blog_get_update",
    ),
]
