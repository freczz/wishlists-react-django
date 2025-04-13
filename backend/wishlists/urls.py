from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WishlistCreateView, WishlistViewSet, WishlistDetailView

router = DefaultRouter()
router.register(r'', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('create/', WishlistCreateView.as_view(), name='wishlist-create'),
    path('<int:pk>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    path('', include(router.urls)),
]
