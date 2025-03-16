from base.serializers import DynamicFieldsModelSerializer
from listings.serializers import ListingSerializer
from wishlists.models import WishlistItem


class WishlistItemSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = WishlistItem
        fields = "__all__"

    def get_listing(self, obj):
        return ListingSerializer(obj.listing).data
