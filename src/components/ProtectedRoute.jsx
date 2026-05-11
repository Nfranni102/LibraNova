import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

/**
 * Composant de route protégée
 * Vérifie si l'utilisateur est authentifié
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
