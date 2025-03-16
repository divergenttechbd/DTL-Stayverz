from django.urls import path

from wishlists.views.user import (
    GuestWishlistItemListCreateApiView,
    GuestWishlistItemDeleteApiView,
)

app_name = "host"

urlpatterns = [
    path(
        "wishlist-items/",
        GuestWishlistItemListCreateApiView.as_view(),
        name="wishlist_item_list_create",
    ),
    path(
        "wishlist-items/<int:listing_id>/",
        GuestWishlistItemDeleteApiView.as_view(),
        name="wishlist_item_delete",
    ),
]
