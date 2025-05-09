from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, wishlists_by_user

router = DefaultRouter()
router.register(r'', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('create/', WishlistViewSet.as_view({'post': 'create'}), name='wishlist-create'),
    # path('<int:pk>/', WishlistViewSet.as_view(), name='wishlist-detail'),
	path('user/<str:username>/', wishlists_by_user),
    path('', include(router.urls)),
]
