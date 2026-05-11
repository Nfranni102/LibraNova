import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getBorrowHistory, returnBook } from '../services/libraryService';
import { getCurrentUser } from '../services/authService';
import { formatDate, formatDateTime } from '../utils/helpers';
import Toast from '../components/Toast';

/**
 * Page des emprunts de l'utilisateur
 */
const MyBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = () => {
    const allBorrows = getBorrowHistory();
    // Filtrer par utilisateur connecté
    const userBorrows = currentUser 
      ? allBorrows.filter(b => b.userId === currentUser.id)
      : allBorrows;
    // Trier par date d'emprunt (plus récent en premier)
    userBorrows.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
    setBorrows(userBorrows);
  };

  const handleReturn = (borrowId) => {
    const result = returnBook(borrowId);
    if (result.success) {
      setToast({ message: 'Livre retourné avec succès !', type: 'success' });
      loadBorrows();
    } else {
      setToast({ message: result.message || 'Erreur lors du retour', type: 'error' });
    }
  };

  const filteredBorrows = borrows.filter((borrow) => {
    if (filter === 'active') return borrow.status === 'borrowed';
    if (filter === 'returned') return borrow.status === 'returned';
    return true;
  });

  const activeBorrows = borrows.filter((b) => b.status === 'borrowed').length;
  const returnedBorrows = borrows.filter((b) => b.status === 'returned').length;

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
          Mes emprunts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez et gérez vos emprunts en cours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total emprunts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{borrows.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En cours</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeBorrows}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retournés</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{returnedBorrows}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 mb-6 inline-flex">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('returned')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'returned'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Retournés
        </button>
      </div>

      {/* Borrows List */}
      {filteredBorrows.length > 0 ? (
        <div className="space-y-4">
          {filteredBorrows.map((borrow) => (
            <div
              key={borrow.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Book Image */}
                <img
                  src={borrow.bookImage}
                  alt={borrow.bookTitle}
                  className="w-20 h-28 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                  }}
                />

                {/* Book Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {borrow.bookTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{borrow.bookAuthor}</span>
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Emprunté le {formatDate(borrow.borrowDate)}</span>
                    </div>
                    {borrow.returnDate && (
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Retourné le {formatDate(borrow.returnDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col items-end justify-between">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                      borrow.status === 'borrowed'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    }`}
                  >
                    {borrow.status === 'borrowed' ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>En cours</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Retourné</span>
                      </>
                    )}
                  </div>

                  {borrow.status === 'borrowed' && (
                    <button
                      onClick={() => handleReturn(borrow.id)}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Retourner
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-16 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun emprunt
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'active' ? 'Vous n\'avez aucun emprunt en cours' : 'Commencez par emprunter un livre'}
          </p>
          {filter === 'all' && (
            <a
              href="/books"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explorer le catalogue</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBorrows;
