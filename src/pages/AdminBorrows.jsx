import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, Clock, ArrowLeft, XCircle, GraduationCap, FileText } from 'lucide-react';
import { getBorrowHistory, returnBook, validateBorrowRequest, rejectBorrowRequest } from '../services/libraryService';
import { formatDate, formatDateTime } from '../utils/helpers';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

/**
 * Page admin de gestion des emprunts (avec validation pour bibliothèque universitaire)
 */
const AdminBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = () => {
    const allBorrows = getBorrowHistory();
    // Trier par date de création (plus récent en premier)
    allBorrows.sort((a, b) => new Date(b.createdAt || b.borrowDate) - new Date(a.createdAt || a.borrowDate));
    setBorrows(allBorrows);
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

  const handleValidate = (borrowId) => {
    const result = validateBorrowRequest(borrowId);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadBorrows();
    } else {
      setToast({ message: result.message || 'Erreur lors de la validation', type: 'error' });
    }
  };

  const handleRejectClick = (borrow) => {
    setRejectModal(borrow);
    setRejectionReason('');
  };

  const handleRejectConfirm = () => {
    const result = rejectBorrowRequest(rejectModal.id, rejectionReason);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadBorrows();
      setRejectModal(null);
      setRejectionReason('');
    } else {
      setToast({ message: result.message || 'Erreur lors du refus', type: 'error' });
    }
  };

  const filteredBorrows = borrows.filter((borrow) => {
    if (filter === 'pending') return borrow.status === 'pending';
    if (filter === 'validated') return borrow.status === 'validated' || borrow.status === 'borrowed';
    if (filter === 'refused') return borrow.status === 'refused';
    if (filter === 'returned') return borrow.status === 'returned';
    return true;
  });

  const pendingBorrows = borrows.filter((b) => b.status === 'pending').length;
  const validatedBorrows = borrows.filter((b) => b.status === 'validated' || b.status === 'borrowed').length;
  const refusedBorrows = borrows.filter((b) => b.status === 'refused').length;
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
          Gestion des emprunts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez et gérez tous les emprunts de la bibliothèque
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retournés</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{returnedBorrows}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 mb-6 inline-flex">
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-orange-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('validated')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'validated'
              ? 'bg-green-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Validés
        </button>
        <button
          onClick={() => setFilter('refused')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'refused'
              ? 'bg-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Refusés
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
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Tous
        </button>
      </div>

      {/* Borrows Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Dates demandées
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBorrows.map((borrow) => (
                <tr key={borrow.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={borrow.bookImage}
                        alt={borrow.bookTitle}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{borrow.bookTitle}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{borrow.bookAuthor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {borrow.level ? (
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">{borrow.level}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                    {borrow.requestedBorrowDate && borrow.requestedReturnDate ? (
                      <div>
                        <p>Emprunt: {formatDate(borrow.requestedBorrowDate)}</p>
                        <p>Retour: {formatDate(borrow.requestedReturnDate)}</p>
                      </div>
                    ) : borrow.borrowDate ? (
                      formatDateTime(borrow.borrowDate)
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {borrow.motif ? (
                      <div className="flex items-start space-x-2 max-w-xs">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {borrow.motif}
                        </p>
                      </div>
                    ) : borrow.rejectionReason ? (
                      <div className="flex items-start space-x-2 max-w-xs">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {borrow.rejectionReason}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                        borrow.status === 'pending'
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                          : borrow.status === 'validated' || borrow.status === 'borrowed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : borrow.status === 'refused'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : borrow.status === 'returned'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {borrow.status === 'pending' && <Clock className="w-3 h-3" />}
                      {(borrow.status === 'validated' || borrow.status === 'borrowed') && <CheckCircle className="w-3 h-3" />}
                      {borrow.status === 'refused' && <XCircle className="w-3 h-3" />}
                      {borrow.status === 'returned' && <CheckCircle className="w-3 h-3" />}
                      <span>
                        {borrow.status === 'pending'
                          ? 'En attente'
                          : borrow.status === 'validated'
                          ? 'Validé'
                          : borrow.status === 'refused'
                          ? 'Refusé'
                          : borrow.status === 'returned'
                          ? 'Retourné'
                          : borrow.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {borrow.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleValidate(borrow.id)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Valider</span>
                        </button>
                        <button
                          onClick={() => handleRejectClick(borrow)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Refuser</span>
                        </button>
                      </div>
                    )}
                    {(borrow.status === 'validated' || borrow.status === 'borrowed') && (
                      <button
                        onClick={() => handleReturn(borrow.id)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Retourner</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBorrows.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun emprunt trouvé
            </p>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title="Refuser la demande d'emprunt"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Êtes-vous sûr de vouloir refuser la demande d'emprunt pour{' '}
            <span className="font-semibold">{rejectModal?.bookTitle}</span> ?
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Motif du refus
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="Expliquez pourquoi vous refusez cette demande..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white resize-none"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setRejectModal(null)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleRejectConfirm}
              disabled={!rejectionReason}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refuser
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBorrows;
