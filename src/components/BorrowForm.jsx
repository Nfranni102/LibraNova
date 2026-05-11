import { useState } from 'react';
import { Calendar, GraduationCap, FileText, X } from 'lucide-react';
import { createBorrowRequest } from '../services/libraryService';
import { getCurrentUser } from '../services/authService';
import Modal from './Modal';
import Toast from './Toast';

/**
 * Formulaire de demande d'emprunt (bibliothèque universitaire)
 */
const BorrowForm = ({ isOpen, onClose, book }) => {
  const [formData, setFormData] = useState({
    borrowDate: '',
    returnDate: '',
    level: 'L1',
    motif: '',
  });
  const [toast, setToast] = useState(null);
  const currentUser = getCurrentUser();

  const levels = ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.borrowDate || !formData.returnDate || !formData.motif) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    const result = createBorrowRequest(
      book.id,
      currentUser.id,
      currentUser.role,
      formData.borrowDate,
      formData.returnDate,
      formData.level,
      formData.motif
    );

    if (result.success) {
      setToast({ message: 'Demande d\'emprunt envoyée avec succès ! En attente de validation.', type: 'success' });
      setTimeout(() => {
        onClose();
        setFormData({ borrowDate: '', returnDate: '', level: 'L1', motif: '' });
      }, 1500);
    } else {
      setToast({ message: result.message || 'Erreur lors de la demande', type: 'error' });
    }
  };

  const handleClose = () => {
    setFormData({ borrowDate: '', returnDate: '', level: 'L1', motif: '' });
    onClose();
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title="Demprunter un livre" size="lg">
        <div className="space-y-6">
          {/* Book Info */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <img
              src={book.image}
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {book.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Stock disponible: {book.stock}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date d'emprunt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date d'emprunt souhaitée *
              </label>
              <input
                type="date"
                value={formData.borrowDate}
                onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Date de retour */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de retour souhaitée *
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Niveau d'études *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Motif de l'emprunt *
              </label>
              <textarea
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                rows={4}
                placeholder="Expliquez pourquoi vous avez besoin de ce livre..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            {/* Info box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Information :</strong> Votre demande sera envoyée à l'administration pour validation. 
                Vous recevrez une notification une fois la demande traitée.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BorrowForm;
