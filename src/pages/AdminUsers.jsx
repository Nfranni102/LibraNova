import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Trash2, UserCheck, Clock } from 'lucide-react';
import { getUsers, approveUser, rejectUser, deleteUser } from '../services/authService';
import { formatDate } from '../utils/helpers';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

/**
 * Page admin de gestion des utilisateurs
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  const handleApprove = (userId) => {
    const result = approveUser(userId);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadUsers();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  const handleReject = (userId) => {
    const result = rejectUser(userId);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadUsers();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  const handleDelete = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const result = deleteUser(deleteConfirm.id);
      if (result.success) {
        setToast({ message: result.message, type: 'success' });
        loadUsers();
      } else {
        setToast({ message: result.message, type: 'error' });
      }
      setDeleteConfirm(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return user.role !== 'admin';
    if (filter === 'pending') return !user.isApproved && user.role !== 'admin';
    if (filter === 'approved') return user.isApproved && user.role !== 'admin';
    return true;
  });

  const pendingUsers = users.filter(u => !u.isApproved && u.role !== 'admin').length;
  const approvedUsers = users.filter(u => u.isApproved && u.role !== 'admin').length;

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
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Approuvez ou gérez les comptes utilisateurs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En attente</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingUsers}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Approuvés</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedUsers}</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total utilisateurs</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{users.filter(u => u.role !== 'admin').length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
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
          onClick={() => setFilter('pending')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            filter === 'approved'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Approuvés
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Date inscription
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                        user.isApproved
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      {user.isApproved ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Approuvé</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>En attente</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {!user.isApproved && user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun utilisateur trouvé
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <span className="font-semibold">{deleteConfirm?.name}</span> ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
