/**
 * Routes pour la gestion des produits
 */

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/products - Récupérer tous les produits
router.get('/', (req, res) => {
    try {
        const products = db.getAllProducts();
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
});

// GET /api/products/:id - Récupérer un produit par ID
router.get('/:id', (req, res) => {
    try {
        const product = db.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du produit',
            error: error.message
        });
    }
});

// POST /api/products - Créer un nouveau produit
router.post('/', (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        // Validation
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et le prix sont requis'
            });
        }
        
        if (isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Le prix doit être un nombre positif'
            });
        }
        
        const newProduct = db.createProduct({
            name,
            description,
            price,
            category,
            stock
        });
        
        res.status(201).json({
            success: true,
            message: 'Produit créé avec succès',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du produit',
            error: error.message
        });
    }
});

// PUT /api/products/:id - Mettre à jour un produit
router.put('/:id', (req, res) => {
    try {
        const product = db.updateProduct(req.params.id, req.body);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Produit mis à jour avec succès',
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du produit',
            error: error.message
        });
    }
});

// DELETE /api/products/:id - Supprimer un produit
router.delete('/:id', (req, res) => {
    try {
        const deletedProduct = db.deleteProduct(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produit non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Produit supprimé avec succès',
            product: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du produit',
            error: error.message
        });
    }
});

module.exports = router;
