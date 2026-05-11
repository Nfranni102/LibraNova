import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, Clock, CheckCircle, XCircle, Search, Download, FileText, Heart } from 'lucide-react';
import { getBooks, getBorrowHistory, isFavorite, addFavorite, removeFavorite } from '../services/libraryService';
import { getCurrentUser } from '../services/authService';
import BorrowForm from '../components/BorrowForm';
import Toast from '../components/Toast';
import { formatDate, getStockBadgeColor, getStockStatus, truncateText } from '../utils/helpers';

/**
 * Page Dashboard utilisateur - Liste des livres empruntables
 */
const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBorrowFormOpen, setIsBorrowFormOpen] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadBooks();
    loadBorrows();
  }, []);

  const loadBooks = () => {
    // Charger tous les livres (publics + admin)
    const allBooks = getBooks();
    
    // Si aucun livre n'existe, initialiser les livres par défaut
    if (allBooks.length === 0) {
      const { INITIAL_BOOKS } = require('../services/libraryService');
      localStorage.setItem('libranova_books', JSON.stringify(INITIAL_BOOKS));
      const initializedBooks = getBooks();
      setBooks(initializedBooks);
    } else {
      setBooks(allBooks);
    }
  };

  const loadBorrows = () => {
    const allBorrows = getBorrowHistory();
    const userBorrows = currentUser 
      ? allBorrows.filter(b => b.userId === currentUser.id)
      : [];
    setBorrows(userBorrows);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBorrows = borrows.filter(b => b.status === 'pending').length;
  const validatedBorrows = borrows.filter(b => b.status === 'validated' || b.status === 'borrowed').length;
  const refusedBorrows = borrows.filter(b => b.status === 'refused').length;

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setIsBorrowFormOpen(true);
  };

  const handleFavorite = (bookId) => {
    if (isFavorite(bookId)) {
      removeFavorite(bookId);
    } else {
      addFavorite(bookId);
    }
  };

  const renderBookCard = (book) => {
    const favorite = isFavorite(book.id);
    const hasDownloadLink = book.pdfUrl || book.downloadLink;

    return (
      <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
            }}
          />
          {/* Badge favori */}
          <button
            onClick={() => handleFavorite(book.id)}
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
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadgeColor(book.stock)}`}>
              {getStockStatus(book.stock)}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-3">
          {/* Catégorie */}
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
            {book.category}
          </span>

          {/* Titre */}
          <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2">
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

          {/* Stock et Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{book.stock}</span> en stock
            </span>
            <div className="flex space-x-2">
              {hasDownloadLink ? (
                <>
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Lire</span>
                    </a>
                  )}
                  {book.downloadLink && (
                    <a
                      href={book.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </a>
                  )}
                </>
              ) : book.stock > 0 ? (
                <button
                  onClick={() => handleBorrow(book)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Étudiant
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue, {currentUser?.name} - Gérez vos emprunts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En attente</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingBorrows}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Validés</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{validatedBorrows}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refusés</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{refusedBorrows}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Livres disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Parcourez le catalogue et faites une demande d'emprunt
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un livre..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => renderBookCard(book))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun livre trouvé
            </p>
          </div>
        )}
      </div>

      {/* My Borrows Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mes demandes d'emprunt
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Suivez l'état de vos demandes
            </p>
          </div>
          <Link
            to="/my-borrows"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Voir tout</span>
          </Link>
        </div>

        <div className="space-y-4">
          {borrows.slice(0, 5).map((borrow) => (
            <div
              key={borrow.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={borrow.bookImage}
                  alt={borrow.bookTitle}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {borrow.bookTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {borrow.bookAuthor}
                  </p>
                  {borrow.level && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Niveau: {borrow.level}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                    borrow.status === 'pending'
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : borrow.status === 'validated' || borrow.status === 'borrowed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : borrow.status === 'refused'
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {borrow.status === 'pending' && <Clock className="w-3 h-3" />}
                  {borrow.status === 'validated' && <CheckCircle className="w-3 h-3" />}
                  {borrow.status === 'refused' && <XCircle className="w-3 h-3" />}
                  <span>
                    {borrow.status === 'pending'
                      ? 'En attente'
                      : borrow.status === 'validated'
                      ? 'Validé'
                      : borrow.status === 'refused'
                      ? 'Refusé'
                      : borrow.status}
                  </span>
                </div>
                {borrow.requestedBorrowDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Demandé le: {formatDate(borrow.requestedBorrowDate)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {borrows.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucune demande d'emprunt
            </p>
          </div>
        )}
      </div>

      {/* Borrow Form Modal */}
      {selectedBook && (
        <BorrowForm
          isOpen={isBorrowFormOpen}
          onClose={() => {
            setIsBorrowFormOpen(false);
            setSelectedBook(null);
            loadBorrows();
          }}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default Dashboard;
