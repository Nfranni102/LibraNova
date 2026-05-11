import { useState, useEffect } from 'react';
import { User, Mail, Lock, Calendar, BookOpen, LogOut, Save } from 'lucide-react';
import { getCurrentUser, updateProfile, changePassword, logout } from '../services/authService';
import { getBorrowHistory } from '../services/libraryService';
import { formatDate } from '../utils/helpers';
import Toast from '../components/Toast';

/**
 * Page de profil utilisateur
 */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
      });
      
      // Charger les emprunts de l'utilisateur
      const allBorrows = getBorrowHistory();
      const userBorrows = allBorrows.filter(b => b.userId === currentUser.id);
      setBorrows(userBorrows);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const result = updateProfile(profileForm.name, profileForm.email);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadUserData();
      setIsEditing(false);
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'Les nouveaux mots de passe ne correspondent pas', type: 'error' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setToast({ message: 'Le mot de passe doit contenir au moins 6 caractères', type: 'error' });
      return;
    }

    const result = changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          Mon Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Informations personnelles
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rôle
                </label>
                <input
                  type="text"
                  value={user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Membre depuis
                </label>
                <input
                  type="text"
                  value={formatDate(user.createdAt)}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Mot de passe
            </h2>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isChangingPassword ? 'Annuler' : 'Changer'}
            </button>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Changer le mot de passe</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Lock className="w-5 h-5" />
              <span>••••••••</span>
            </div>
          )}
        </div>

        {/* Statistics Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Statistiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <BookOpen className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{borrows.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total emprunts</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <BookOpen className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {borrows.filter(b => b.status === 'borrowed').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <BookOpen className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {borrows.filter(b => b.status === 'returned').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Retournés</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
