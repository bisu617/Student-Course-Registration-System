/**
 * Home Page JavaScript
 * Handles product listing, filtering, sorting, and cart functionality
 */

class HomePage {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentCategory = '';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.cart = this.loadCart();
        this.priceRange = { min: 0, max: 500 };
        
        this.init();
    }

    /**
     * Initialize the home page
     */
    init() {
        this.loadProducts();
        this.handleURLParameters();
        this.setupEventListeners();
        this.updateCartDisplay();
        this.setupPriceSliders();
    }

    /**
     * Load products from database
     */
    loadProducts() {
        this.allProducts = ProductDatabase.getAllProducts();
        this.filteredProducts = [...this.allProducts];
        this.displayProducts();
        this.displayFeaturedProducts();
    }

    /**
     * Handle URL parameters for category filtering
     */
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            this.filterByCategory(category);
            this.updateActiveNavLink(category);
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(category) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current category or home
        const selector = category ? `a[href="home.html?category=${category}"]` : `a[href="home.html"]`;
        const activeLink = document.querySelector(selector);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // Filter controls
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAndDisplayProducts();
            });
        }

        // View controls
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');
        
        if (gridView) {
            gridView.addEventListener('click', () => this.setView('grid'));
        }
        
        if (listView) {
            listView.addEventListener('click', () => this.setView('list'));
        }

        // Clear filters
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }

        // Cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }

        // Price sliders
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        
        if (minPrice) {
            minPrice.addEventListener('input', () => this.updatePriceFilter());
        }
        
        if (maxPrice) {
            maxPrice.addEventListener('input', () => this.updatePriceFilter());
        }
    }

    /**
     * Setup price sliders
     */
    setupPriceSliders() {
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        const minDisplay = document.getElementById('min-price-display');
        const maxDisplay = document.getElementById('max-price-display');
        
        if (minPrice && maxPrice) {
            // Set initial values based on product range
            const prices = this.allProducts.map(p => p.price);
            const minProductPrice = Math.floor(Math.min(...prices));
            const maxProductPrice = Math.ceil(Math.max(...prices));
            
            minPrice.min = minProductPrice;
            minPrice.max = maxProductPrice;
            maxPrice.min = minProductPrice;
            maxPrice.max = maxProductPrice;
            
            minPrice.value = minProductPrice;
            maxPrice.value = maxProductPrice;
            
            this.priceRange = { min: minProductPrice, max: maxProductPrice };
            
            if (minDisplay) minDisplay.textContent = minProductPrice;
            if (maxDisplay) maxDisplay.textContent = maxProductPrice;
        }
    }

    /**
     * Update price filter
     */
    updatePriceFilter() {
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        const minDisplay = document.getElementById('min-price-display');
        const maxDisplay = document.getElementById('max-price-display');
        
        if (minPrice && maxPrice) {
            let min = parseInt(minPrice.value);
            let max = parseInt(maxPrice.value);
            
            // Ensure min is not greater than max
            if (min > max) {
                min = max;
                minPrice.value = min;
            }
            
            this.priceRange = { min, max };
            
            if (minDisplay) minDisplay.textContent = min;
            if (maxDisplay) maxDisplay.textContent = max;
            
            this.applyFilters();
        }
    }

    /**
     * Handle search functionality
     */
    handleSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        
        if (query) {
            this.filteredProducts = ProductDatabase.searchProducts(query);
            this.updateProductsTitle(`Search results for "${query}"`);
        } else {
            this.filteredProducts = [...this.allProducts];
            this.updateProductsTitle('All Products');
        }
        
        this.applyFilters();
    }

    /**
     * Filter products by category
     */
    filterByCategory(category) {
        this.currentCategory = category;
        
        if (category) {
            this.filteredProducts = ProductDatabase.getProductsByCategory(category);
            this.updateProductsTitle(this.formatCategoryName(category));
            
            // Update category filter dropdown
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
            }
        } else {
            this.filteredProducts = [...this.allProducts];
            this.updateProductsTitle('All Products');
        }
        
        this.applyFilters();
        this.scrollToProducts();
    }

    /**
     * Apply all active filters
     */
    applyFilters() {
        let filtered = [...this.filteredProducts];
        
        // Apply price filter
        filtered = ProductDatabase.filterByPriceRange(filtered, this.priceRange.min, this.priceRange.max);
        
        this.displayProducts(filtered);
    }

    /**
     * Sort and display products
     */
    sortAndDisplayProducts() {
        this.applyFilters();
    }

    /**
     * Display products in the grid
     */
    displayProducts(products = null) {
        const productsToShow = products || this.filteredProducts;
        const sortedProducts = ProductDatabase.sortProducts(productsToShow, this.currentSort);
        
        const productsGrid = document.getElementById('products-grid');
        const noProducts = document.getElementById('no-products');
        
        if (!productsGrid) return;
        
        if (sortedProducts.length === 0) {
            productsGrid.style.display = 'none';
            if (noProducts) noProducts.style.display = 'block';
            return;
        }
        
        productsGrid.style.display = 'grid';
        if (noProducts) noProducts.style.display = 'none';
        
        productsGrid.innerHTML = sortedProducts.map(product => this.createProductCard(product)).join('');
        
        // Apply current view
        this.applyView();
    }

    /**
     * Create product card HTML
     */
    createProductCard(product) {
        const discountHtml = product.originalPrice && product.originalPrice > product.price 
            ? `<span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>
               <span class="product-discount">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>`
            : '';

        return `
            <div class="product-card" onclick="navigateToProduct('${product.id}')">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">${this.generateStarRating(product.rating)}</div>
                    <div class="product-price-container">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${discountHtml}
                    </div>
                    <div class="product-stock ${product.stock > 0 ? '' : 'out-of-stock'}">
                        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                    <p class="product-description">${product.description}</p>
                </div>
                <button class="quick-add" onclick="event.stopPropagation(); addToCartQuick('${product.id}')" title="Add to Cart">+</button>
            </div>
        `;
    }

    /**
     * Generate star rating HTML
     */
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<span class="star full">★</span>';
        }
        
        if (hasHalfStar) {
            html += '<span class="star half">★</span>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            html += '<span class="star empty">☆</span>';
        }
        
        html += ` <span class="rating-value">${rating.toFixed(1)}</span>`;
        
        return html;
    }

    /**
     * Display featured products
     */
    displayFeaturedProducts() {
        const featuredGrid = document.getElementById('featured-grid');
        if (!featuredGrid) return;
        
        const featuredProducts = ProductDatabase.getFeaturedProducts(6);
        featuredGrid.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
    }

    /**
     * Set view mode (grid or list)
     */
    setView(view) {
        this.currentView = view;
        this.applyView();
        
        // Update view button states
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');
        
        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', view === 'grid');
            listBtn.classList.toggle('active', view === 'list');
        }
    }

    /**
     * Apply current view to products grid
     */
    applyView() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        productsGrid.classList.toggle('list-view', this.currentView === 'list');
        
        // Update individual product cards
        const productCards = productsGrid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.classList.toggle('list-view', this.currentView === 'list');
        });
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        // Reset price sliders
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        
        if (minPrice && maxPrice) {
            const prices = this.allProducts.map(p => p.price);
            const minProductPrice = Math.floor(Math.min(...prices));
            const maxProductPrice = Math.ceil(Math.max(...prices));
            
            minPrice.value = minProductPrice;
            maxPrice.value = maxProductPrice;
            this.priceRange = { min: minProductPrice, max: maxProductPrice };
            
            document.getElementById('min-price-display').textContent = minProductPrice;
            document.getElementById('max-price-display').textContent = maxProductPrice;
        }
        
        // Reset category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = '';
        }
        
        // Reset search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset sort
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.value = 'newest';
        }
        this.currentSort = 'newest';
        
        // Clear category and show all products
        this.currentCategory = '';
        this.filteredProducts = [...this.allProducts];
        this.updateProductsTitle('All Products');
        this.updateActiveNavLink('');
        
        // Update URL
        window.history.pushState({}, '', 'home.html');
        
        this.displayProducts();
    }

    /**
     * Update products section title
     */
    updateProductsTitle(title) {
        const productsTitle = document.getElementById('products-title');
        if (productsTitle) {
            productsTitle.textContent = title;
        }
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Scroll to products section
     */
    scrollToProducts() {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Cart functionality
     */
    loadCart() {
        try {
            const cartData = localStorage.getItem('productCart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('productCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
            this.updateCartSidebar();
        }
        
        if (cartOverlay) {
            cartOverlay.style.display = cartSidebar.classList.contains('open') ? 'block' : 'none';
        }
    }

    updateCartSidebar() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                        <button class="remove-item" onclick="homePage.removeFromCart('${item.id}')">×</button>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    addToCart(productId, quantity = 1) {
        const product = ProductDatabase.getProductById(productId);
        if (!product) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        };

        const existingItemIndex = this.cart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex >= 0) {
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            this.cart.push(cartItem);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showCartFeedback();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartSidebar();
    }

    showCartFeedback() {
        // You could add a toast notification here
        console.log('Product added to cart!');
    }
}

// Global functions for onclick handlers
function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function addToCartQuick(productId) {
    if (window.homePage) {
        window.homePage.addToCart(productId);
    }
}

function filterByCategory(category) {
    if (window.homePage) {
        // Update URL
        const newUrl = category ? `home.html?category=${category}` : 'home.html';
        window.history.pushState({category}, '', newUrl);
        
        window.homePage.filterByCategory(category);
        window.homePage.updateActiveNavLink(category);
    }
}

function scrollToProducts() {
    if (window.homePage) {
        window.homePage.scrollToProducts();
    }
}

function toggleCart() {
    if (window.homePage) {
        window.homePage.toggleCart();
    }
}

// Initialize home page when DOM is loaded
let homePage;
document.addEventListener('DOMContentLoaded', () => {
    homePage = new HomePage();
    window.homePage = homePage; // Make it globally accessible
});