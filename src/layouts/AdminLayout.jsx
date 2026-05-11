import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  History,
  Users,
  Menu,
  X,
  LogOut,
  Home,
  Moon,
  Sun,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '../services/authService';

/**
 * Layout pour les pages admin avec navbar professionnel moderne
 */
const AdminLayout = ({ theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/books', icon: BookOpen, label: 'Gestion Livres' },
    { path: '/admin/borrows', icon: History, label: 'Gestion Emprunts' },
    { path: '/admin/users', icon: Users, label: 'Gestion Utilisateurs' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 border-r border-slate-700 dark:border-gray-700 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-gray-700">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">Admin</span>
                  <span className="text-xs text-slate-400 block -mt-1">LibraNova</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-700 transition-colors text-white"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-700 dark:hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-700 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-slate-700 dark:hover:bg-gray-700 hover:text-white transition-colors ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              {isSidebarOpen && <span>Thème</span>}
            </button>
            
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full bg-red-600 hover:bg-red-700 text-white transition-colors ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 bg-gray-50 dark:bg-gray-950 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard Admin'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Panneau de contrôle administrateur
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Retour au site</span>
            </Link>
          </div>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
