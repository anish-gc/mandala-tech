import React, { useState } from "react";
import { Search, Book, User, Building, Calendar, Hash } from "lucide-react";

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
      // Using Open Library API for book data
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );
      const data = await response.json();

      const bookKey = `ISBN:${isbn}`;
      if (data[bookKey]) {
        setBookData(data[bookKey]);
      } else {
        setError("Book not found. Please check the ISBN number.");
      }
    } catch (err) {
      setError("Failed to fetch book data. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return "Unknown";
    return authors.map((author) => author.name).join(", ");
  };

  const formatPublishers = (publishers) => {
    if (!publishers || publishers.length === 0) return "Unknown";
    return publishers.map((pub) => pub.name).join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
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
            Enter an ISBN to find book information
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
                  placeholder="Enter ISBN (e.g., 9780140449136)"
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2 text-indigo-500" />
              Book Information
            </h2>

            <div className="grid gap-4">
              <div className="flex items-start space-x-3">
                <Book className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Title</p>
                  <p className="text-gray-900">{bookData.title || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Author(s)</p>
                  <p className="text-gray-900">
                    {formatAuthors(bookData.authors)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Publisher</p>
                  <p className="text-gray-900">
                    {formatPublishers(bookData.publishers)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Publish Date</p>
                  <p className="text-gray-900">
                    {bookData.publish_date || "Unknown"}
                  </p>
                </div>
              </div>

              {bookData.number_of_pages && (
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Pages</p>
                    <p className="text-gray-900">{bookData.number_of_pages}</p>
                  </div>
                </div>
              )}

              {bookData.cover && bookData.cover.medium && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">Cover</p>
                  <img
                    src={bookData.cover.medium}
                    alt={bookData.title}
                    className="rounded-lg shadow-md max-w-32"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
