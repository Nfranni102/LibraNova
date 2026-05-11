import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import MyBorrows from './pages/MyBorrows';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import AdminBorrows from './pages/AdminBorrows';
import AdminUsers from './pages/AdminUsers';
import { getTheme, saveTheme } from './services/libraryService';
import { isAuthenticated, getCurrentUser } from './services/authService';

/**
 * Application principale avec gestion du thème et du routing
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Charger le thème depuis LocalStorage
    const savedTheme = getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    // Charger l'utilisateur actuel
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLoginSuccess = (loggedInUser, role) => {
    setUser(loggedInUser);
    // Rediriger selon le rôle
    if (role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Route d'authentification */}
        <Route
          path="/auth"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Route d'accueil publique sans layout */}
        <Route path="/" element={<Home />} />

        {/* Routes utilisateur avec UserLayout et protection */}
        <Route path="/" element={<UserLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="books" 
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="books/:id" 
            element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="my-borrows" 
            element={
              <ProtectedRoute>
                <MyBorrows />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Routes admin avec AdminLayout et protection admin */}
        <Route path="/admin" element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route 
            index 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="books" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminBooks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="borrows" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminBorrows />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/auth"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
