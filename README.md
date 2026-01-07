# API REST avec JSON - Version Modulaire

Une API REST complète et modulaire pour la gestion de produits, avec une interface web interactive et responsive.

## 📁 Structure du Projet

```
api-rest/
├── app.js                    # Application principale
├── database/                 # Base de données JSON
│   ├── db.js               # Module de gestion de la BDD
│   └── products.json       # Fichier JSON des produits
├── routes/                  # Routes API
│   ├── products.js        # Routes pour les produits
│   └── health.js          # Route de santé de l'API
├── public/                  # Interface web
│   ├── index.html         # Page principale
│   ├── styles.css         # Styles responsive
│   └── script.js          # Logique JavaScript
├── package.json
└── README.md
```

## 🚀 Installation

```bash
npm install
```

## 💻 Utilisation

### Démarrer le serveur

```bash
npm start
```

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 🌐 Interface Web

Une interface web interactive et responsive est disponible à l'adresse :
- **URL:** `http://localhost:3000`
- **Fonctionnalités:**
  - ✅ Visualiser tous les produits
  - ✅ Ajouter un nouveau produit
  - ✅ Modifier un produit existant
  - ✅ Supprimer un produit
  - ✅ Interface responsive (mobile, tablette, desktop)
  - ✅ Notifications en temps réel

## 📡 Endpoints API

### GET /api/products
Récupère tous les produits

**Réponse :**
```json
{
  "success": true,
  "count": 2,
  "products": [...]
}
```

### GET /api/products/:id
Récupère un produit par ID

### POST /api/products
Crée un nouveau produit

**Corps de la requête :**
```json
{
  "name": "Produit exemple",
  "description": "Description du produit",
  "price": 29.99,
  "category": "Électronique",
  "stock": 10
}
```

### PUT /api/products/:id
Met à jour un produit existant

### DELETE /api/products/:id
Supprime un produit

### GET /api/health
Vérifie l'état de l'API

## 🔧 Architecture Modulaire

### 1. Database (`database/db.js`)
Module centralisé pour la gestion de la base de données JSON :
- `getAllProducts()` - Récupère tous les produits
- `getProductById(id)` - Récupère un produit par ID
- `createProduct(data)` - Crée un nouveau produit
- `updateProduct(id, updates)` - Met à jour un produit
- `deleteProduct(id)` - Supprime un produit

### 2. Routes (`routes/`)
Routes organisées par fonctionnalité :
- `routes/products.js` - Toutes les routes liées aux produits
- `routes/health.js` - Route de vérification de santé

### 3. Interface (`public/`)
Interface web complète avec :
- HTML sémantique
- CSS responsive avec design moderne
- JavaScript pour l'interactivité

## 📝 Exemples d'utilisation

### Créer un produit (cURL)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Ordinateur portable",
    "price": 999.99,
    "category": "Électronique",
    "stock": 5
  }'
```

### Récupérer tous les produits
```bash
curl http://localhost:3000/api/products
```

### Mettre à jour un produit
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99,
    "stock": 3
  }'
```

### Supprimer un produit
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## 🎨 Fonctionnalités de l'Interface

- **Design moderne** avec dégradés et animations
- **Responsive** - Fonctionne sur mobile, tablette et desktop
- **CRUD complet** - Créer, Lire, Modifier, Supprimer
- **Validation** - Validation des formulaires côté client
- **Notifications** - Toast notifications pour les actions
- **Modal de confirmation** - Pour les suppressions
- **Actualisation automatique** - Mise à jour après chaque action

## 📦 Structure des données

Les données sont stockées dans `database/products.json` :

```json
{
  "products": [
    {
      "id": 1,
      "name": "Produit",
      "description": "Description",
      "price": 29.99,
      "category": "Catégorie",
      "stock": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔒 Sécurité

- Validation des données d'entrée
- Protection contre les injections XSS dans l'interface
- Gestion des erreurs appropriée
- CORS activé pour les requêtes cross-origin

## 📱 Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile (iOS Safari, Chrome Mobile)

## 🛠️ Technologies

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Base de données:** JSON (fichier)
- **Icons:** Font Awesome
