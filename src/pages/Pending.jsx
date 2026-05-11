import { Clock, LogOut } from 'lucide-react';
import { logout } from '../services/authService';

/**
 * Page d'attente pour les utilisateurs non autorisés
 */
const Pending = () => {
  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Compte en attente
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Votre compte a été créé avec succès mais doit être approuvé par l'administrateur avant de pouvoir accéder à la bibliothèque.
        </p>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Vous recevrez une notification une fois votre compte approuvé. Veuillez vous reconnecter ultérieurement.
          </p>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
};

export default Pending;
