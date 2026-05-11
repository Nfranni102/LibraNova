/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Formate une date en format lisible
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Retourne la couleur du badge selon le stock
 */
export const getStockBadgeColor = (stock) => {
  if (stock === 0) return 'bg-red-500 text-white';
  if (stock <= 5) return 'bg-orange-500 text-white';
  return 'bg-green-500 text-white';
};

/**
 * Retourne le texte du statut selon le stock
 */
export const getStockStatus = (stock) => {
  if (stock === 0) return 'Rupture';
  if (stock <= 5) return 'Limité';
  return 'Disponible';
};

/**
 * Génère un slug à partir d'une chaîne
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Retarde l'exécution (pour les animations, loaders, etc.)
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Valide un ISBN (format simple)
 */
export const isValidISBN = (isbn) => {
  if (!isbn) return true; // ISBN optionnel
  const cleaned = isbn.replace(/[-\s]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 17;
};

/**
 * Valide une URL d'image
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
  } catch {
    return false;
  }
};

/**
 * Retourne une image par défaut si l'URL est invalide
 */
export const getBookImage = (url) => {
  if (url && isValidImageUrl(url)) {
    return url;
  }
  return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
};

/**
 * Calcule les statistiques des livres
 */
export const calculateStats = (books, borrows) => {
  const totalBooks = books.length;
  const borrowedBooks = borrows.filter(b => b.status === 'borrowed').length;
  const availableBooks = books.reduce((sum, book) => sum + book.stock, 0);
  const outOfStockBooks = books.filter(book => book.stock === 0).length;

  return {
    totalBooks,
    borrowedBooks,
    availableBooks,
    outOfStockBooks
  };
};
