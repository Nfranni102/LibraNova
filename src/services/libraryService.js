/**
 * Service de gestion de la bibliothèque avec LocalStorage
 * Gère les livres, les emprunts, les favoris et le thème
 */

const STORAGE_KEYS = {
  BOOKS: 'libranova_books',
  BORROWS: 'libranova_borrows',
  FAVORITES: 'libranova_favorites',
  THEME: 'libranova_theme',
};

// Données initiales de livres (livres publics accessibles à tous)
const INITIAL_BOOKS = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Informatique",
    stock: 5,
    description: "Un manuel d'agilité logicielle pour les développeurs. Apprenez à écrire du code propre, lisible et maintenable.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    year: 2008,
    isbn: "978-0132350884",
    addedBy: null, // null = livre public
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Les Misérables",
    author: "Victor Hugo",
    category: "Roman",
    stock: 3,
    description: "Un chef-d'œuvre de la littérature française racontant l'histoire de Jean Valjean dans la France du XIXe siècle.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    year: 1862,
    isbn: "978-2253004203",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "L'Univers à portée de main",
    author: "Neil deGrasse Tyson",
    category: "Science",
    stock: 4,
    description: "Une exploration fascinante de l'univers, des étoiles aux galaxies, accessible à tous.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
    year: 2017,
    isbn: "978-2253157023",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Le Coran",
    author: "Dieu",
    category: "Religion",
    stock: 10,
    description: "Le livre saint de l'islam, contenant les révélations reçues par le prophète Mahomet.",
    image: "https://images.unsplash.com/photo-1585036156171-6e3b01e697cd?w=400&h=600&fit=crop",
    year: 632,
    isbn: "",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Design Patterns",
    author: "Erich Gamma",
    category: "Informatique",
    stock: 2,
    description: "Éléments de logiciels réutilisables orientés objets. Un classique pour les développeurs.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop",
    year: 1994,
    isbn: "978-0201633610",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Roman",
    stock: 8,
    description: "Un conte philosophique et poétique qui a touché des millions de lecteurs à travers le monde.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    year: 1943,
    isbn: "978-2070612758",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    title: "Une brève histoire du temps",
    author: "Stephen Hawking",
    category: "Science",
    stock: 6,
    description: "Du big bang aux trous noirs, une exploration des mystères de l'univers.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop",
    year: 1988,
    isbn: "978-2070385404",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    title: "React - Up & Running",
    author: "Stoyan Stefanov",
    category: "Informatique",
    stock: 3,
    description: "Guide complet pour construire des applications web avec React.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop",
    year: 2016,
    isbn: "978-1491931825",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    title: "La Bible",
    author: "Dieu",
    category: "Religion",
    stock: 7,
    description: "Le livre saint du christianisme, contenant l'Ancien et le Nouveau Testament.",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=600&fit=crop",
    year: 100,
    isbn: "",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    title: "1984",
    author: "George Orwell",
    category: "Roman",
    stock: 4,
    description: "Un roman dystopique décrivant une société totalitaire sous surveillance constante.",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    year: 1949,
    isbn: "978-0451524935",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Informatique",
    stock: 3,
    description: "Découvrez les meilleures parties de JavaScript et apprenez à éviter les pièges du langage.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=600&fit=crop",
    year: 2008,
    isbn: "978-0596517748",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    title: "L'Alchimiste",
    author: "Paulo Coelho",
    category: "Roman",
    stock: 5,
    description: "Un roman philosophique sur la quête de sens et la poursuite de ses rêves.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    year: 1988,
    isbn: "978-2266141225",
    addedBy: null,
    pdfUrl: "",
    downloadLink: "",
    createdAt: new Date().toISOString()
  },
];

/**
 * Initialise les données si elles n'existent pas
 */
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BORROWS)) {
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
  }
};

// Initialiser au chargement
initializeData();

/**
 * Récupère tous les livres
 */
export const getBooks = () => {
  const books = localStorage.getItem(STORAGE_KEYS.BOOKS);
  return books ? JSON.parse(books) : [];
};

/**
 * Récupère les livres publics (accessibles à tous les utilisateurs)
 */
export const getPublicBooks = () => {
  const books = getBooks();
  return books.filter(book => book.addedBy === null);
};

/**
 * Récupère les livres admin (ajoutés par l'admin)
 */
export const getAdminBooks = () => {
  const books = getBooks();
  return books.filter(book => book.addedBy !== null);
};

/**
 * Récupère un livre par son ID
 */
export const getBookById = (id) => {
  const books = getBooks();
  return books.find(book => book.id === id);
};

/**
 * Ajoute un nouveau livre
 */
export const addBook = (book, addedBy = null) => {
  const books = getBooks();
  const newBook = {
    ...book,
    id: Date.now(), // Génère un ID unique
    addedBy, // ID de l'utilisateur qui a ajouté le livre (null = public)
    pdfUrl: book.pdfUrl || "", // Lien vers le PDF du livre
    downloadLink: book.downloadLink || "", // Lien de téléchargement
    createdAt: new Date().toISOString(),
  };

  books.push(newBook);
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));

  return { success: true, book: newBook };
};

/**
 * Met à jour un livre existant
 */
export const updateBook = (id, updatedBook) => {
  const books = getBooks();
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    return books[index];
  }
  return null;
};

/**
 * Supprime un livre
 */
export const deleteBook = (id) => {
  const books = getBooks();
  const filteredBooks = books.filter(book => book.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(filteredBooks));
  return filteredBooks;
};

/**
 * Crée une demande d'emprunt (pour bibliothèque universitaire)
 * @param {number} bookId - ID du livre
 * @param {number} userId - ID de l'utilisateur qui emprunte
 * @param {string} userRole - Rôle de l'utilisateur ('admin' ou 'user')
 * @param {string} borrowDate - Date d'emprunt demandée
 * @param {string} returnDate - Date de retour demandée
 * @param {string} level - Niveau de l'étudiant
 * @param {string} motif - Motif de l'emprunt
 */
export const createBorrowRequest = (bookId, userId, userRole, borrowDate, returnDate, level, motif) => {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return { success: false, message: 'Livre non trouvé' };
  }

  // Vérifier si l'utilisateur a le droit d'emprunter ce livre
  if (userRole !== 'admin' && book.addedBy !== null) {
    return { success: false, message: 'Ce livre est réservé à l\'admin' };
  }

  // Ajouter la demande d'emprunt (ne diminue pas le stock tant que non validé)
  const borrows = getBorrowHistory();
  const borrow = {
    id: Date.now(),
    userId,
    bookId: bookId,
    bookTitle: book.title,
    bookAuthor: book.author,
    bookImage: book.image,
    requestedBorrowDate: borrowDate,
    requestedReturnDate: returnDate,
    level,
    motif,
    borrowDate: null, // Sera défini lors de la validation
    actualReturnDate: null,
    status: 'pending', // pending, validated, refused, returned
    createdAt: new Date().toISOString()
  };
  borrows.push(borrow);
  localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
  
  return { success: true, borrow };
};

/**
 * Valide une demande d'emprunt (diminue le stock)
 * @param {number} borrowId - ID de l'emprunt
 */
export const validateBorrowRequest = (borrowId) => {
  const borrows = getBorrowHistory();
  const borrow = borrows.find(b => b.id === borrowId);
  
  if (!borrow) {
    return { success: false, message: 'Emprunt non trouvé' };
  }

  if (borrow.status !== 'pending') {
    return { success: false, message: 'Cette demande n\'est pas en attente' };
  }

  // Diminuer le stock du livre
  const books = getBooks();
  const book = books.find(b => b.id === borrow.bookId);
  
  if (!book || book.stock <= 0) {
    return { success: false, message: 'Stock insuffisant pour valider cet emprunt' };
  }
  
  book.stock -= 1;
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  
  // Mettre à jour l'emprunt
  borrow.status = 'validated';
  borrow.borrowDate = new Date().toISOString();
  borrow.validatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
  
  return { success: true, message: 'Emprunt validé avec succès' };
};

/**
 * Refuse une demande d'emprunt
 * @param {number} borrowId - ID de l'emprunt
 * @param {string} rejectionReason - Motif du refus
 */
export const rejectBorrowRequest = (borrowId, rejectionReason) => {
  const borrows = getBorrowHistory();
  const borrow = borrows.find(b => b.id === borrowId);
  
  if (!borrow) {
    return { success: false, message: 'Emprunt non trouvé' };
  }

  if (borrow.status !== 'pending') {
    return { success: false, message: 'Cette demande n\'est pas en attente' };
  }
  
  borrow.status = 'refused';
  borrow.rejectionReason = rejectionReason;
  borrow.rejectedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
  
  return { success: true, message: 'Emprunt refusé' };
};

/**
 * Emprunte un livre (diminue le stock) - Version directe pour admin
 * @param {number} bookId - ID du livre
 * @param {number} userId - ID de l'utilisateur qui emprunte
 * @param {string} userRole - Rôle de l'utilisateur ('admin' ou 'user')
 */
export const borrowBook = (bookId, userId, userRole) => {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return { success: false, message: 'Livre non trouvé' };
  }

  // Vérifier si l'utilisateur a le droit d'emprunter ce livre
  // Les utilisateurs normaux ne peuvent emprunter que les livres publics
  // L'admin peut emprunter tous les livres
  if (userRole !== 'admin' && book.addedBy !== null) {
    return { success: false, message: 'Ce livre est réservé à l\'admin' };
  }
  
  if (book.stock > 0) {
    book.stock -= 1;
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    
    // Ajouter à l'historique des emprunts
    const borrows = getBorrowHistory();
    const borrow = {
      id: Date.now(),
      userId,
      bookId: bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookImage: book.image,
      borrowDate: new Date().toISOString(),
      returnDate: null,
      status: 'borrowed'
    };
    borrows.push(borrow);
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
    
    return { success: true, book };
  }
  
  return { success: false, message: 'Stock insuffisant' };
};

/**
 * Retourne un livre (augmente le stock)
 */
export const returnBook = (borrowId) => {
  const borrows = getBorrowHistory();
  const borrow = borrows.find(b => b.id === borrowId);
  
  if (borrow && borrow.status === 'borrowed') {
    // Mettre à jour le statut de l'emprunt
    borrow.status = 'returned';
    borrow.returnDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
    
    // Augmenter le stock du livre
    const books = getBooks();
    const book = books.find(b => b.id === borrow.bookId);
    if (book) {
      book.stock += 1;
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    }
    
    return { success: true, book };
  }
  
  return { success: false, message: 'Emprunt non trouvé' };
};

/**
 * Récupère l'historique des emprunts
 */
export const getBorrowHistory = () => {
  const borrows = localStorage.getItem(STORAGE_KEYS.BORROWS);
  return borrows ? JSON.parse(borrows) : [];
};

/**
 * Récupère les emprunts actifs (non retournés)
 */
export const getActiveBorrows = () => {
  const borrows = getBorrowHistory();
  return borrows.filter(b => b.status === 'borrowed');
};

/**
 * Récupère les favoris
 */
export const getFavorites = () => {
  const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return favorites ? JSON.parse(favorites) : [];
};

/**
 * Ajoute un livre aux favoris
 */
export const addFavorite = (bookId) => {
  const favorites = getFavorites();
  if (!favorites.includes(bookId)) {
    favorites.push(bookId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
  return favorites;
};

/**
 * Retire un livre des favoris
 */
export const removeFavorite = (bookId) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(id => id !== bookId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  return filtered;
};

/**
 * Vérifie si un livre est dans les favoris
 */
export const isFavorite = (bookId) => {
  const favorites = getFavorites();
  return favorites.includes(bookId);
};

/**
 * Sauvegarde le thème
 */
export const saveTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Récupère le thème
 */
export const getTheme = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

/**
 * Réinitialise toutes les données (pour tests)
 */
export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.BOOKS);
  localStorage.removeItem(STORAGE_KEYS.BORROWS);
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  localStorage.removeItem(STORAGE_KEYS.THEME);
  initializeData();
};
