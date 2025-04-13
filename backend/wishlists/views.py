import json
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Wishlist, WishlistItem, Comment
from .serializers import WishlistSerializer, CommentSerializer
from django.shortcuts import get_object_or_404

class WishlistCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        try:
            title = request.data.get('title')
            description = request.data.get('description')
            access_level = request.data.get('access_level', 'private')
            image = request.FILES.get('image')
            items_json = request.data.get('items', '[]')

            try:
                items = json.loads(items_json)
            except json.JSONDecodeError:
                return Response({'error': 'Invalid items JSON'}, status=status.HTTP_400_BAD_REQUEST)

            wishlist = Wishlist.objects.create(
                user=request.user,
                title=title,
                description=description,
                access_level=access_level,
                image=image
            )

            for item in items:
                WishlistItem.objects.create(
                    wishlist=wishlist,
                    name=item.get('name', ''),
                    description=item.get('description', ''),
                    link=item.get('link', ''),
                    image=item.get('image', '')
                )

            return Response({'message': 'Wishlist created successfully'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # 🔐 Комментарии
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comments(self, request, pk=None):
        wishlist = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(wishlist=wishlist, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔐 Добавить / удалить из избранного
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def favorite(self, request, pk=None):
        wishlist = get_object_or_404(Wishlist, pk=pk)
        user = request.user
        if wishlist.favorited_by.filter(id=user.id).exists():
            wishlist.favorited_by.remove(user)
            return Response({'status': 'removed from favorites'})
        else:
            wishlist.favorited_by.add(user)
            return Response({'status': 'added to favorites'})

class WishlistDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        wishlist = get_object_or_404(Wishlist, pk=pk)

        # Можно добавить проверку прав доступа (например, приватный vs публичный)
        if wishlist.access_level == 'private' and wishlist.user != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)
