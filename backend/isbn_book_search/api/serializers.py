# serializers.py (Optional - for better API documentation)
from rest_framework import serializers

class BookInfoRequestSerializer(serializers.Serializer):
    isbn = serializers.CharField(
        max_length=13, 
        help_text="ISBN-10 or ISBN-13 (with or without hyphens)"
    )

class BookInfoResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    data = serializers.DictField()