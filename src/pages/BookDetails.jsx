import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Hash, Heart, Star, Check, X } from 'lucide-react';
import { getBookById, borrowBook, isFavorite, addFavorite, removeFavorite } from '../services/libraryService';
import { getCurrentUser } from '../services/authService';
import { getStockBadgeColor, getStockStatus, formatDate } from '../utils/helpers';
import Toast from '../components/Toast';

/**
 * Page de détail d'un livre
 */
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = () => {
    const bookData = getBookById(parseInt(id));
    if (bookData) {
      setBook(bookData);
      setFavorite(isFavorite(bookData.id));
    }
    setLoading(false);
  };

  const handleBorrow = () => {
    if (!currentUser) {
      setToast({ message: 'Vous devez être connecté pour emprunter un livre', type: 'error' });
      return;
    }

    if (book && book.stock > 0) {
      const result = borrowBook(book.id, currentUser.id, currentUser.role);
      if (result.success) {
        setToast({ message: 'Livre emprunté avec succès !', type: 'success' });
        loadBook();
      } else {
        setToast({ message: result.message || 'Erreur lors de l\'emprunt', type: 'error' });
      }
    }
  };

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(book.id);
      setFavorite(false);
    } else {
      addFavorite(book.id);
      setFavorite(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Livre non trouvé
          </h2>
          <Link
            to="/books"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back button */}
      <Link
        to="/books"
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour au catalogue</span>
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-96 lg:h-auto bg-gray-100 dark:bg-gray-700">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
              }}
            />
            <div className="absolute top-4 left-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStockBadgeColor(
                  book.stock
                )}`}
              >
                {getStockStatus(book.stock)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {book.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>{book.author}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">(4.5/5)</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {book.year && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Année</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{book.year}</p>
                </div>
              )}
              {book.isbn && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">ISBN</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{book.isbn}</p>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Stock</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{book.stock} exemplaire{book.stock > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleFavorite}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  favorite
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                <span>{favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
              </button>

              {book.stock > 0 ? (
                <button
                  onClick={handleBorrow}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Check className="w-5 h-5" />
                  <span>Emprunter ce livre</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                  <span>Rupture de stock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
