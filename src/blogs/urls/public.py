from django.urls import path

from blogs.views.public import PublicBlogListAPIView, PublicBlogRetrieveAPIView

app_name = "public"

urlpatterns = [
    path(
        "blogs/",
        PublicBlogListAPIView.as_view(),
        name="blog_list",
    ),
    path(
        "blogs/<str:slug>/",
        PublicBlogRetrieveAPIView.as_view(),
        name="blog_retrieve",
    ),
]
