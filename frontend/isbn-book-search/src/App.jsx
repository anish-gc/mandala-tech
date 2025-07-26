import React, { useState } from "react";
import { Search, Book, User, Building, Calendar, Hash, Globe, DollarSign, Bookmark } from "lucide-react";

export default function ISBNBookSearch() {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!isbn.trim()) {
      setError("Please enter an ISBN number");
      return;
    }

    setLoading(true);
    setError("");
    setBookData(null);

    try {
      // Using your Django API endpoint
      const response = await fetch(
        `http://localhost:8000/api/book-info/?isbn=${isbn.trim()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success && data.data) {
        setBookData(data.data);
      } else if (data.error) {
        setError(data.error || "Book not found. Please check the ISBN number.");
      } else {
        setError("Book not found. Please check the ISBN number.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch book data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSubmit();
  //   }
  // };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return "Unknown";
    if (Array.isArray(authors)) {
      return authors.join(", ");
    }
    return authors;
  };

  // const formatSubjects = (subjects) => {
  //   if (!subjects || subjects.length === 0) return "Not specified";
  //   return subjects.map(subject => 
  //     subject.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  //   ).join(", ");
  // };

  const formatDimensions = (dimensions) => {
    if (!dimensions) return "Not specified";
    return dimensions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-500 p-3 rounded-full">
              <Book className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ISBN Book Search
          </h1>
          <p className="text-gray-600">
            Enter an ISBN to find comprehensive book information
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ISBN Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="isbn"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="Enter ISBN (e.g., 9781451673319)"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
                <Hash className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search Book</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Book Information */}
        {bookData && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Book className="w-6 h-6 mr-2 text-indigo-500" />
                Book Information
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Book Cover */}
                {bookData.image && (
                  <div className="md:col-span-1">
                    <img
                      src={bookData.image}
                      alt={bookData.title}
                      className="w-full max-w-64 mx-auto rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Book Details */}
                <div className={`${bookData.image ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                  {/* Title */}
                  <div className="flex items-start space-x-3">
                    <Book className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Title</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {bookData.title || "Unknown"}
                      </p>
                      {bookData.title_long && bookData.title_long !== bookData.title && (
                        <p className="text-sm text-gray-600 mt-1">
                          {bookData.title_long}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Author(s)</p>
                      <p className="text-gray-900">
                        {formatAuthors(bookData.authors)}
                      </p>
                    </div>
                  </div>

                  {/* Publisher */}
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">Publisher</p>
                      <p className="text-gray-900">
                        {bookData.publisher || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Publication Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {bookData.publish_date && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Published</p>
                          <p className="text-gray-900">{bookData.publish_date}</p>
                        </div>
                      </div>
                    )}

                    {bookData.pages && (
                      <div className="flex items-start space-x-3">
                        <Hash className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Pages</p>
                          <p className="text-gray-900">{bookData.pages}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {bookData.language && (
                      <div className="flex items-start space-x-3">
                        <Globe className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Language</p>
                          <p className="text-gray-900">{bookData.language.toUpperCase()}</p>
                        </div>
                      </div>
                    )}

                    {bookData.binding && (
                      <div className="flex items-start space-x-3">
                        <Bookmark className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Binding</p>
                          <p className="text-gray-900">{bookData.binding}</p>
                        </div>
                      </div>
                    )}

                    {bookData.edition && (
                      <div className="flex items-start space-x-3">
                        <Book className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Edition</p>
                          <p className="text-gray-900">{bookData.edition}</p>
                        </div>
                      </div>
                    )}

                    {bookData.msrp && (
                      <div className="flex items-start space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">Price (MSRP)</p>
                          <p className="text-gray-900">${bookData.msrp}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ISBN Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      {bookData.isbn && (
                        <div>
                          <p className="font-medium text-gray-700">ISBN-10</p>
                          <p className="text-gray-900 font-mono">{bookData.isbn}</p>
                        </div>
                      )}
                      {bookData.isbn13 && (
                        <div>
                          <p className="font-medium text-gray-700">ISBN-13</p>
                          <p className="text-gray-900 font-mono">{bookData.isbn13}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  {bookData.subjects && bookData.subjects.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-700 mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {bookData.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                          >
                            {subject.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dimensions */}
                  {bookData.dimensions && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-700">Dimensions</p>
                      <p className="text-gray-900 text-sm">{formatDimensions(bookData.dimensions)}</p>
                    </div>
                  )}

                  {/* Dewey Decimal */}
                  {bookData.dewey_decimal && bookData.dewey_decimal.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-700">Dewey Decimal</p>
                      <p className="text-gray-900 font-mono">{bookData.dewey_decimal.join(", ")}</p>
                    </div>
                  )}

                  {/* Other ISBNs */}
                  {bookData.other_isbns && bookData.other_isbns.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-700 mb-2">Other Editions</p>
                      <div className="space-y-1">
                        {bookData.other_isbns.map((otherIsbn, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-mono">{otherIsbn.isbn}</span>
                            {otherIsbn.binding && (
                              <span className="text-gray-600 ml-2">({otherIsbn.binding})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}