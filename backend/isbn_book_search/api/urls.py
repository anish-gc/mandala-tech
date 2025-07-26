
# urls.py
from django.urls import path
from .views import BookInfoAPIView

urlpatterns = [
    path('api/book-info/', BookInfoAPIView.as_view(), name='book-info'),
]

