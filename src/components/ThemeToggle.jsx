import { Moon, Sun } from 'lucide-react';

/**
 * Bouton de basculement du thème (dark/light)
 */
const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
