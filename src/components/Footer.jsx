import { BookOpen, Heart, Github } from 'lucide-react';

/**
 * Pied de page de l'application
 */
const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                LibraNova
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Système moderne de gestion de bibliothèque. Gérez vos livres, 
              vos emprunts et découvrez de nouvelles lectures.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/books" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Catalogue
                </a>
              </li>
              <li>
                <a href="/my-borrows" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Mes emprunts
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Administration
                </a>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              À propos
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Fait avec React & TailwindCSS</span>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Stockage LocalStorage</span>
              </li>
              <li className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Design moderne & responsive</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 LibraNova. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
