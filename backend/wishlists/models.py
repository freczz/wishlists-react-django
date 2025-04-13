from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Wishlist(models.Model):
    ACCESS_LEVEL_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('link', 'Link Only'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    access_level = models.CharField(max_length=10, choices=ACCESS_LEVEL_CHOICES, default='private')
    image = models.ImageField(upload_to='wishlist_images/', blank=True)

    def __str__(self):
        return self.title


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    link = models.URLField()
    image = models.ImageField(upload_to='wishlist_items_images/', blank=True)

    def __str__(self):
        return self.name


class Comment(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Комментарий от {self.author.username} к {self.wishlist.title}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'wishlist')

    def __str__(self):
        return f"{self.user.username} добавил {self.wishlist.title} в избранное"
