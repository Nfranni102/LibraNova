# LibraNova

Bibliothèque Universitaire - Application React pour la gestion de livres et d'emprunts.

## 🚀 Technologies

- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Lucide React** - Icônes
- **LocalStorage** - Persistance des données

## 📦 Installation

```bash
npm install
```

## 🔧 Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

Les fichiers de build seront générés dans le dossier `dist/`

## 📤 Déploiement sur Vercel

1. Connectez-vous à votre compte Vercel
2. Importez votre repository GitHub
3. La configuration automatique utilisera `vercel.json`
4. Le build utilisera la commande : `npm install && npm run build`
5. Le dossier de publication : `dist/`

## 👤 Identifiants Admin

- **Email** : akelixjunior@gmail.com
- **Mot de passe** : akelixjunior@2000

## 📚 Fonctionnalités

### Utilisateur
- Inscription et connexion
- Parcourir le catalogue de livres
- Emprunter des livres
- Voir l'historique des emprunts
- Marquer des livres en favoris
- Télécharger ou lire des livres en ligne (si disponibles)

### Admin
- Dashboard avec statistiques globales
- Gestion des livres (ajouter, modifier, supprimer)
- Gestion des emprunts (valider, refuser)
- Gestion des utilisateurs
- Ajouter des PDF et liens de téléchargement aux livres

## 🎨 Interface

- **Page d'accueil** : Landing page neutre avec connexion et informations
- **Dashboard utilisateur** : Interface pour parcourir et emprunter des livres
- **Dashboard admin** : Interface de gestion avec sidebar moderne
- **Thème** : Mode clair/sombre

## 📁 Structure du projet

```
libranova/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── layouts/         # Layouts (UserLayout, AdminLayout)
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services (auth, library)
│   └── utils/           # Utilitaires et helpers
├── public/              # Fichiers statiques
├── vercel.json          # Configuration Vercel
└── package.json         # Dépendances
```

## 🔐 Sécurité

- Authentification par email/mot de passe
- Rôles utilisateur et admin
- Protection des routes admin
- Données stockées en LocalStorage (pour la démo)

## 📝 Notes

- Les données sont stockées en LocalStorage pour cette démo
- Pour une production, utilisez une base de données backend
- L'admin peut ajouter des livres avec PDF et liens de téléchargement
- Les utilisateurs peuvent voir tous les livres (publics + admin)
