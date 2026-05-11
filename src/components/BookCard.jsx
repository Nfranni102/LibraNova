import { Link } from 'react-router-dom';
import { BookOpen, Heart, Star } from 'lucide-react';
import { getStockBadgeColor, getStockStatus, truncateText } from '../utils/helpers';
import { isFavorite, addFavorite, removeFavorite } from '../services/libraryService';

/**
 * Card affichant un livre
 */
const BookCard = ({ book, onBorrow, onReturn, showActions = true, refresh }) => {
  const favorite = isFavorite(book.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(book.id);
    } else {
      addFavorite(book.id);
    }
    if (refresh) refresh();
  };

  const handleBorrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBorrow) onBorrow(book.id);
  };

  const handleReturn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReturn) onReturn(book.id);
  };

  return (
    <Link to={`/books/${book.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
            }}
          />
          {/* Badge favori */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-md"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
          {/* Badge stock */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadgeColor(
                book.stock
              )}`}
            >
              {getStockStatus(book.stock)}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-3">
          {/* Catégorie */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              {book.category}
            </span>
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">4.5</span>
            </div>
          </div>

          {/* Titre */}
          <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {book.title}
          </h3>

          {/* Auteur */}
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>{book.author}</span>
          </p>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
            {truncateText(book.description, 80)}
          </p>

          {/* Stock */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{book.stock}</span> en stock
            </span>
            {showActions && (
              <div className="flex space-x-2">
                {book.stock > 0 ? (
                  <button
                    onClick={handleBorrow}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Emprunter
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
                  >
                    Rupture
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
