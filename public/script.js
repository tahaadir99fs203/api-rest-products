/**
 * Script principal pour l'interface interactive
 */

const API_BASE_URL = '/api/products';

// Éléments DOM
const productForm = document.getElementById('product-form');
const productsContainer = document.getElementById('products-container');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const productCount = document.getElementById('product-count');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const modal = document.getElementById('modal');
const toast = document.getElementById('toast');

let editingProductId = null;
let productToDelete = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    productForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    refreshBtn.addEventListener('click', loadProducts);
    
    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeModal);
    
    // Fermer modal en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

/**
 * Charge tous les produits
 */
async function loadProducts() {
    try {
        loading.style.display = 'block';
        productsContainer.innerHTML = '';
        emptyState.style.display = 'none';
        
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        
        loading.style.display = 'none';
        
        if (data.success && data.products.length > 0) {
            productCount.textContent = data.count;
            displayProducts(data.products);
        } else {
            productCount.textContent = '0';
            emptyState.style.display = 'block';
        }
    } catch (error) {
        loading.style.display = 'none';
        showToast('Erreur lors du chargement des produits', 'error');
        console.error('Erreur:', error);
    }
}

/**
 * Affiche les produits dans la grille
 */
function displayProducts(products) {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    <span class="product-category">${escapeHtml(product.category)}</span>
                </div>
            </div>
            <div class="product-description">${escapeHtml(product.description || 'Aucune description')}</div>
            <div class="product-footer">
                <div>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <div class="product-stock">Stock: ${product.stock}</div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id}, '${escapeHtml(product.name)}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Gère la soumission du formulaire
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        description: document.getElementById('description').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value.trim() || 'Général',
        stock: parseInt(document.getElementById('stock').value) || 0
    };
    
    if (!formData.name || !formData.price) {
        showToast('Le nom et le prix sont requis', 'error');
        return;
    }
    
    try {
        let response;
        if (editingProductId) {
            // Mise à jour
            response = await fetch(`${API_BASE_URL}/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Création
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showToast(
                editingProductId ? 'Produit mis à jour avec succès' : 'Produit ajouté avec succès',
                'success'
            );
            productForm.reset();
            cancelEdit();
            loadProducts();
        } else {
            showToast(data.message || 'Erreur lors de l\'opération', 'error');
        }
    } catch (error) {
        showToast('Erreur lors de l\'opération', 'error');
        console.error('Erreur:', error);
    }
}

/**
 * Édite un produit
 */
async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();
        
        if (data.success && data.product) {
            const product = data.product;
            editingProductId = product.id;
            
            document.getElementById('product-id').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description || '';
            document.getElementById('price').value = product.price;
            document.getElementById('category').value = product.category || 'Général';
            document.getElementById('stock').value = product.stock || 0;
            
            formTitle.textContent = 'Modifier le produit';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
            cancelBtn.style.display = 'inline-flex';
            
            // Scroll vers le formulaire
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        showToast('Erreur lors du chargement du produit', 'error');
        console.error('Erreur:', error);
    }
}

/**
 * Annule l'édition
 */
function cancelEdit() {
    editingProductId = null;
    productForm.reset();
    document.getElementById('product-id').value = '';
    formTitle.textContent = 'Ajouter un produit';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Ajouter';
    cancelBtn.style.display = 'none';
}

/**
 * Supprime un produit
 */
function deleteProduct(id, name) {
    productToDelete = { id, name };
    document.getElementById('modal-title').textContent = 'Confirmer la suppression';
    document.getElementById('modal-message').textContent = 
        `Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`;
    modal.classList.add('show');
}

/**
 * Confirme la suppression
 */
async function confirmDelete() {
    if (!productToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${productToDelete.id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Produit supprimé avec succès', 'success');
            loadProducts();
        } else {
            showToast(data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
        console.error('Erreur:', error);
    }
    
    closeModal();
}

/**
 * Ferme le modal
 */
function closeModal() {
    modal.classList.remove('show');
    productToDelete = null;
}

/**
 * Affiche une notification toast
 */
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Formate le prix
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

/**
 * Échappe le HTML pour éviter les injections
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
