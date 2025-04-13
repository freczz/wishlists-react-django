from rest_framework import serializers
from .models import Wishlist, WishlistItem, Comment

class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author', 'wishlist', 'date']

class WishlistSerializer(serializers.ModelSerializer):
    products = WishlistItemSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'