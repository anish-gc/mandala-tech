# views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class BookInfoAPIView(APIView):
    """
    API View to retrieve book information using ISBN from ISBNdb API
    """
    
    def get(self, request):
        """
        GET method to retrieve book information by ISBN
        Query parameter: isbn (required)
        """
        isbn = request.query_params.get('isbn')
        
        if not isbn:
            return Response(
                {'error': 'ISBN parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Clean ISBN (remove hyphens and spaces)
        clean_isbn = isbn.replace('-', '').replace(' ', '')
        
        # Validate ISBN format (basic validation)
        if not self._validate_isbn(clean_isbn):
            return Response(
                {'error': 'Invalid ISBN format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            book_data = self._fetch_book_data(clean_isbn)
            return Response(book_data, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return Response(
                {'error': 'Failed to fetch book information from external API'}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """
        POST method to retrieve book information by ISBN
        Body parameter: isbn (required)
        """
        isbn = request.data.get('isbn')
        
        if not isbn:
            return Response(
                {'error': 'ISBN is required in request body'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Clean ISBN (remove hyphens and spaces)
        clean_isbn = isbn.replace('-', '').replace(' ', '')
        
        # Validate ISBN format
        if not self._validate_isbn(clean_isbn):
            return Response(
                {'error': 'Invalid ISBN format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            book_data = self._fetch_book_data(clean_isbn)
            return Response(book_data, status=status.HTTP_200_OK)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {str(e)}")
            return Response(
                {'error': 'Failed to fetch book information from external API'}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _validate_isbn(self, isbn):
        """
        Basic ISBN validation
        """
        if not isbn.isdigit():
            return False
        
        # ISBN-10 or ISBN-13 validation
        if len(isbn) == 10 or len(isbn) == 13:
            return True
        
        return False
    
    def _fetch_book_data(self, isbn):
        """
        Fetch book data from ISBNdb API
        """
        # Get API configuration from settings
        api_key = getattr(settings, 'ISBNDB_API_KEY', None)
        base_url = getattr(settings, 'ISBNDB_BASE_URL', 'https://api2.isbndb.com')
        
        if not api_key:
            raise Exception("ISBNdb API key not configured")
        
        # Prepare API request
        url = f"{base_url}/book/{isbn}"
        headers = {
            'Authorization': api_key,
            'Content-Type': 'application/json'
        }
        
        # Make API request
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 404:
            return {
                'error': 'Book not found',
                'isbn': isbn,
                'message': 'No book found with the provided ISBN'
            }
        
        if response.status_code != 200:
            logger.error(f"ISBNdb API error: {response.status_code} - {response.text}")
            raise requests.exceptions.RequestException(
                f"ISBNdb API returned status code: {response.status_code}"
            )
        
        # Parse response
        api_data = response.json()
        
        # Extract and format book information
        book_info = self._format_book_data(api_data.get('book', {}))
        
        return book_info
    
    def _format_book_data(self, book_data):
        """
        Format book data from ISBNdb API response
        """
        formatted_data = {
            'isbn': book_data.get('isbn'),
            'isbn13': book_data.get('isbn13'),
            'title': book_data.get('title'),
            'title_long': book_data.get('title_long'),
            'authors': book_data.get('authors', []),
            'publisher': book_data.get('publisher'),
            'publish_date': book_data.get('date_published'),
            'edition': book_data.get('edition'),
            'language': book_data.get('language'),
            'pages': book_data.get('pages'),
            'dimensions': book_data.get('dimensions'),
            'overview': book_data.get('overview'),
            'image': book_data.get('image'),
            'subjects': book_data.get('subjects', []),
            'dewey_decimal': book_data.get('dewey_decimal'),
            'msrp': book_data.get('msrp'),
            'binding': book_data.get('binding'),
            'related': book_data.get('related', {}),
            'other_isbns': book_data.get('other_isbns', [])
        }
        
        # Remove None values
        formatted_data = {k: v for k, v in formatted_data.items() if v is not None}
        
        return {
            'success': True,
            'data': formatted_data
        }






