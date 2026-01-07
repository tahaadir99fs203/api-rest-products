/**
 * Application principale - API REST
 * Point d'entrée du serveur
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importer les routes
const productsRoutes = require('./routes/products');
const healthRoutes = require('./routes/health');

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (interface)
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser la base de données si elle n'existe pas
const dbDir = path.join(__dirname, 'database');
const dbFile = path.join(dbDir, 'products.json');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
    const initialData = { products: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
    console.log('✅ Base de données initialisée');
}

// Routes API
app.use('/api/products', productsRoutes);
app.use('/api/health', healthRoutes);

// Route racine - rediriger vers l'interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour la documentation API
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API REST',
        version: '1.0.0',
        endpoints: {
            'GET /api/products': 'Récupérer tous les produits',
            'GET /api/products/:id': 'Récupérer un produit par ID',
            'POST /api/products': 'Créer un nouveau produit',
            'PUT /api/products/:id': 'Mettre à jour un produit',
            'DELETE /api/products/:id': 'Supprimer un produit',
            'GET /api/health': 'Vérifier l\'état de l\'API'
        }
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Serveur API REST démarré');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Interface: http://localhost:${PORT}`);
    console.log(`📝 API Docs: http://localhost:${PORT}/api`);
    console.log('='.repeat(60));
});

module.exports = app;
