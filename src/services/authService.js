/**
 * Service d'authentification avec LocalStorage
 * Gère les utilisateurs, les rôles, et l'autorisation admin
 */

const STORAGE_KEYS = {
  USERS: 'libranova_users',
  CURRENT_USER: 'libranova_current_user',
};

// Admin par défaut
const ADMIN_USER = {
  id: 1,
  email: 'akelixjunior@gmail.com',
  password: 'akelixjunior@2000',
  name: 'Admin',
  role: 'admin',
  isApproved: true,
  createdAt: new Date().toISOString(),
};

/**
 * Initialise les utilisateurs si aucun n'existe ou met à jour l'admin
 */
const initializeUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([ADMIN_USER]));
  } else {
    // Mettre à jour l'admin existant avec les nouveaux identifiants
    const parsedUsers = JSON.parse(users);
    const adminIndex = parsedUsers.findIndex(u => u.role === 'admin');
    if (adminIndex !== -1) {
      parsedUsers[adminIndex] = ADMIN_USER;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
    } else {
      // Ajouter l'admin s'il n'existe pas
      parsedUsers.push(ADMIN_USER);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
    }
  }
};

initializeUsers();

/**
 * Récupère tous les utilisateurs
 */
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

/**
 * Vérifie si un utilisateur est connecté
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Vérifie si l'utilisateur est admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

/**
 * Vérifie si l'utilisateur est autorisé
 */
export const isAuthorized = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.isApproved);
};

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = (name, email, password) => {
  const users = getUsers();
  
  // Vérifier si l'email existe déjà
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Cet email est déjà utilisé' };
  }

  // Vérifier si c'est l'admin
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    // L'admin existe déjà
    return { success: false, message: 'Compte admin déjà existant' };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: 'user',
    isApproved: true, // Automatiquement approuvé
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  return { success: true, message: 'Compte créé avec succès !' };
};

/**
 * Connexion d'un utilisateur
 */
export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Email ou mot de passe incorrect' };
  }

  if (!user.isApproved && user.role !== 'admin') {
    return { success: false, message: 'Votre compte est en attente d\'approbation par l\'admin' };
  }

  // Stocker l'utilisateur connecté
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

  return { 
    success: true, 
    user,
    message: user.role === 'admin' ? 'Bienvenue Admin !' : 'Connexion réussie !' 
  };
};

/**
 * Déconnexion
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Approuver un utilisateur (admin seulement)
 */
export const approveUser = (userId) => {
  if (!isAdmin()) {
    return { success: false, message: 'Accès non autorisé' };
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (user) {
    user.isApproved = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return { success: true, message: 'Utilisateur approuvé avec succès' };
  }

  return { success: false, message: 'Utilisateur non trouvé' };
};

/**
 * Refuser un utilisateur (admin seulement)
 */
export const rejectUser = (userId) => {
  if (!isAdmin()) {
    return { success: false, message: 'Accès non autorisé' };
  }

  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));

  return { success: true, message: 'Utilisateur refusé et supprimé' };
};

/**
 * Supprimer un utilisateur (admin seulement)
 */
export const deleteUser = (userId) => {
  if (!isAdmin()) {
    return { success: false, message: 'Accès non autorisé' };
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (user && user.role === 'admin') {
    return { success: false, message: 'Impossible de supprimer le compte admin' };
  }

  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));

  return { success: true, message: 'Utilisateur supprimé avec succès' };
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateProfile = (name, email) => {
  const user = getCurrentUser();
  if (!user) {
    return { success: false, message: 'Utilisateur non connecté' };
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === user.id);

  if (userIndex !== -1) {
    users[userIndex].name = name;
    users[userIndex].email = email;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
    return { success: true, message: 'Profil mis à jour avec succès' };
  }

  return { success: false, message: 'Erreur lors de la mise à jour' };
};

/**
 * Changer le mot de passe
 */
export const changePassword = (oldPassword, newPassword) => {
  const user = getCurrentUser();
  if (!user) {
    return { success: false, message: 'Utilisateur non connecté' };
  }

  if (user.password !== oldPassword) {
    return { success: false, message: 'Ancien mot de passe incorrect' };
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === user.id);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
    return { success: true, message: 'Mot de passe changé avec succès' };
  }

  return { success: false, message: 'Erreur lors du changement de mot de passe' };
};
