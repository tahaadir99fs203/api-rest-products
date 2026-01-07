/**
 * Module de gestion de la base de données JSON
 * Gère la lecture et l'écriture des données
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'products.json');

/**
 * Lit les données depuis le fichier JSON
 * @returns {Object} Les données de la base de données
 */
function readData() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            return { products: [] };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture des données:', error);
        return { products: [] };
    }
}

/**
 * Écrit les données dans le fichier JSON
 * @param {Object} data - Les données à écrire
 * @returns {boolean} True si l'écriture a réussi
 */
function writeData(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des données:', error);
        return false;
    }
}

/**
 * Récupère tous les produits
 * @returns {Array} Liste des produits
 */
function getAllProducts() {
    const data = readData();
    return data.products || [];
}

/**
 * Récupère un produit par son ID
 * @param {number} id - L'ID du produit
 * @returns {Object|null} Le produit ou null si non trouvé
 */
function getProductById(id) {
    const products = getAllProducts();
    return products.find(p => p.id === parseInt(id)) || null;
}

/**
 * Crée un nouveau produit
 * @param {Object} productData - Les données du produit
 * @returns {Object} Le produit créé
 */
function createProduct(productData) {
    const data = readData();
    const products = data.products || [];
    
    // Générer un nouvel ID
    const newId = products.length > 0 
        ? Math.max(...products.map(p => p.id)) + 1 
        : 1;
    
    const newProduct = {
        id: newId,
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price),
        category: productData.category || 'Général',
        stock: productData.stock !== undefined ? parseInt(productData.stock) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    data.products = products;
    writeData(data);
    
    return newProduct;
}

/**
 * Met à jour un produit
 * @param {number} id - L'ID du produit
 * @param {Object} updates - Les champs à mettre à jour
 * @returns {Object|null} Le produit mis à jour ou null si non trouvé
 */
function updateProduct(id, updates) {
    const data = readData();
    const products = data.products || [];
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
        return null;
    }
    
    const product = products[productIndex];
    
    // Mettre à jour uniquement les champs fournis
    if (updates.name !== undefined) product.name = updates.name;
    if (updates.description !== undefined) product.description = updates.description;
    if (updates.price !== undefined) product.price = parseFloat(updates.price);
    if (updates.category !== undefined) product.category = updates.category;
    if (updates.stock !== undefined) product.stock = parseInt(updates.stock);
    product.updatedAt = new Date().toISOString();
    
    products[productIndex] = product;
    data.products = products;
    writeData(data);
    
    return product;
}

/**
 * Supprime un produit
 * @param {number} id - L'ID du produit
 * @returns {Object|null} Le produit supprimé ou null si non trouvé
 */
function deleteProduct(id) {
    const data = readData();
    const products = data.products || [];
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
        return null;
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    data.products = products;
    writeData(data);
    
    return deletedProduct;
}

module.exports = {
    readData,
    writeData,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
