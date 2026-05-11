import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { getBooks, getBorrowHistory, getActiveBorrows } from '../services/libraryService';
import { calculateStats } from '../utils/helpers';

/**
 * Dashboard admin avec statistiques globales
 */
const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    outOfStockBooks: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBooks = getBooks();
    const allBorrows = getBorrowHistory();
    const active = getActiveBorrows();
    
    setBooks(allBooks);
    setBorrows(allBorrows);
    setActiveBorrows(active);
    setStats(calculateStats(allBooks, allBorrows));
  };

  const recentBorrows = [...borrows]
    .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
    .slice(0, 5);

  const lowStockBooks = books.filter((book) => book.stock > 0 && book.stock <= 5).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de la bibliothèque
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Livres</p>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Empruntés</p>
              <p className="text-3xl font-bold">{stats.borrowedBooks}</p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Disponibles</p>
              <p className="text-3xl font-bold">{stats.availableBooks}</p>
            </div>
            <Package className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Rupture Stock</p>
              <p className="text-3xl font-bold">{stats.outOfStockBooks}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Borrows */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Emprunts récents
          </h2>
          {recentBorrows.length > 0 ? (
            <div className="space-y-4">
              {recentBorrows.map((borrow) => (
                <div
                  key={borrow.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <img
                    src={borrow.bookImage}
                    alt={borrow.bookTitle}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {borrow.bookTitle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {borrow.bookAuthor}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      borrow.status === 'borrowed'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {borrow.status === 'borrowed' ? 'En cours' : 'Retourné'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              Aucun emprunt récent
            </p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Stock faible
          </h2>
          {lowStockBooks.length > 0 ? (
            <div className="space-y-4">
              {lowStockBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {book.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {book.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {book.stock}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">exemplaires</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              Tous les stocks sont OK
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Statiques supplémentaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {books.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Références uniques
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {activeBorrows.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Emprunts actifs
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {books.filter((b) => b.stock > 10).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Livres bien stockés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
