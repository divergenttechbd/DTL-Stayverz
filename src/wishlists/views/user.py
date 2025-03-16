from django.utils.decorators import method_decorator
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    views,
)
from rest_framework import status
from rest_framework.response import Response
from base.helpers.decorators import exception_handler
from base.permissions import IsGuestUser
from wishlists.models import Wishlist, WishlistItem
from wishlists.serializers import WishlistItemSerializer


class GuestWishlistItemListCreateApiView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    swagger_tags = ["Guest Wishlist"]

    @method_decorator(exception_handler)
    def post(self, request, *args, **kwargs):
        listing_id = request.data["listing_id"]
        user = request.user
        wishlist = Wishlist.objects.get(user_id=user.id)

        if WishlistItem.objects.filter(
            wishlist_id=wishlist.id, listing_id=listing_id
        ).exists():
            return Response(
                {"message": "Listing already added to wish list"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            WishlistItem.objects.create(wishlist_id=wishlist.id, listing_id=listing_id)
            user.wishlist_listings.append(listing_id)
            user.save()

        return Response(
            {"message": "Listing added to wish list"},
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, *args, **kwargs):
        wishlist = Wishlist.objects.get(user_id=request.user.id)
        qs = WishlistItem.objects.filter(wishlist_id=wishlist.id).select_related(
            "listing"
        )
        data = WishlistItemSerializer(qs, many=True, r_method_fields=["listing"]).data
        return Response(data=data, status=status.HTTP_200_OK)


class GuestWishlistItemDeleteApiView(views.APIView):
    permission_classes = (IsAuthenticated, IsGuestUser)
    swagger_tags = ["Guest Wishlist"]

    @method_decorator(exception_handler)
    def delete(self, request, *args, **kwargs):
        user = request.user
        listing_id = kwargs.get("listing_id")
        wishlist = Wishlist.objects.get(user_id=user.id)
        instance = WishlistItem.objects.get(
            listing_id=listing_id, wishlist_id=wishlist.id
        )
        with transaction.atomic():
            listing_id = instance.listing_id
            instance.delete()
            user.wishlist_listings.remove(listing_id)
            user.save()

        return Response(
            {"message": "Listing delete from wish list"},
            status=status.HTTP_200_OK,
        )
