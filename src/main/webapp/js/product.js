/**
 * Universal Product Page System
 * Handles dynamic product loading, routing, and UI management for all product types
 */

class UniversalProductPage {
    constructor() {
        this.currentProduct = null;
        this.cart = this.loadCart();
        this.currentImageIndex = 0;
        
        // Initialize page
        this.init();
    }

    /**
     * Initialize the product page
     */
    init() {
        // Handle URL parameters and load appropriate product
        this.handleRouting();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update cart display
        this.updateCartDisplay();
        
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => this.handleRouting());
    }

    /**
     * Handle URL routing and parameter parsing
     */
    handleRouting() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const category = urlParams.get('category');

        if (productId) {
            this.loadProductById(productId);
        } else if (category) {
            this.redirectToCategory(category);
        } else {
            this.showErrorPage('No product specified');
        }
    }

    /**
     * Load product by ID and display it
     */
    loadProductById(productId) {
        try {
            const product = ProductDatabase.getProductById(productId);
            
            if (!product) {
                this.showErrorPage(`Product with ID "${productId}" not found`);
                return;
            }

            this.currentProduct = product;
            this.displayProduct(product);
            this.updateBreadcrumbs(product);
            this.loadRelatedProducts(product);
            
        } catch (error) {
            console.error('Error loading product:', error);
            this.showErrorPage('Error loading product information');
        }
    }

    /**
     * Display product information in the page
     */
    displayProduct(product) {
        // Update page title
        document.title = `${product.name} - Product Store`;

        // Update product info
        this.updateElement('product-name', product.name);
        this.updateElement('product-description', product.description);
        this.updateElement('product-price', `$${product.price.toFixed(2)}`);
        
        // Show original price if discounted
        if (product.originalPrice && product.originalPrice > product.price) {
            this.updateElement('product-original-price', `$${product.originalPrice.toFixed(2)}`);
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            this.updateElement('product-discount', `${discount}% OFF`);
        } else {
            this.hideElement('product-original-price');
            this.hideElement('product-discount');
        }

        // Update stock status
        this.updateStockStatus(product);

        // Update rating and reviews
        this.updateRating(product);

        // Update features list
        this.updateFeatures(product);

        // Update image gallery
        this.updateImageGallery(product);

        // Update add to cart button
        this.updateAddToCartButton(product);
    }

    /**
     * Update stock status display
     */
    updateStockStatus(product) {
        const stockElement = document.getElementById('product-stock');
        if (stockElement) {
            if (product.stock > 0) {
                stockElement.textContent = `${product.stock} in stock`;
                stockElement.className = 'stock-available';
            } else {
                stockElement.textContent = 'Out of stock';
                stockElement.className = 'stock-unavailable';
            }
        }
    }

    /**
     * Update rating display
     */
    updateRating(product) {
        const ratingElement = document.getElementById('product-rating');
        const reviewsElement = document.getElementById('product-reviews');
        
        if (ratingElement) {
            ratingElement.innerHTML = this.generateStarRating(product.rating);
        }
        
        if (reviewsElement) {
            reviewsElement.textContent = `(${product.reviews} reviews)`;
        }
    }

    /**
     * Generate star rating HTML
     */
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += '<span class="star full">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            html += '<span class="star half">★</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<span class="star empty">☆</span>';
        }
        
        html += ` <span class="rating-value">${rating.toFixed(1)}</span>`;
        
        return html;
    }

    /**
     * Update features list
     */
    updateFeatures(product) {
        const featuresElement = document.getElementById('product-features');
        if (featuresElement && product.features) {
            featuresElement.innerHTML = product.features
                .map(feature => `<li class="feature-item">${feature}</li>`)
                .join('');
        }
    }

    /**
     * Update image gallery
     */
    updateImageGallery(product) {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.getElementById('image-thumbnails');
        
        if (product.images && product.images.length > 0) {
            this.currentImageIndex = 0;
            
            // Set main image
            if (mainImage) {
                mainImage.src = product.images[0];
                mainImage.alt = product.name;
            }
            
            // Create thumbnails
            if (thumbnails && product.images.length > 1) {
                thumbnails.innerHTML = product.images
                    .map((image, index) => 
                        `<img src="${image}" alt="${product.name} ${index + 1}" 
                         class="thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="productPage.changeImage(${index})">`
                    ).join('');
            }
        }
    }

    /**
     * Change main product image
     */
    changeImage(index) {
        if (!this.currentProduct || !this.currentProduct.images) return;
        
        this.currentImageIndex = index;
        const mainImage = document.getElementById('main-product-image');
        
        if (mainImage) {
            mainImage.src = this.currentProduct.images[index];
        }
        
        // Update thumbnail active state
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    /**
     * Navigate to previous image
     */
    previousImage() {
        if (!this.currentProduct || !this.currentProduct.images) return;
        
        const prevIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.currentProduct.images.length - 1;
        this.changeImage(prevIndex);
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        if (!this.currentProduct || !this.currentProduct.images) return;
        
        const nextIndex = this.currentImageIndex < this.currentProduct.images.length - 1
            ? this.currentImageIndex + 1 
            : 0;
        this.changeImage(nextIndex);
    }

    /**
     * Update breadcrumbs navigation
     */
    updateBreadcrumbs(product) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (breadcrumbs) {
            breadcrumbs.innerHTML = `
                <a href="home.html">Home</a> 
                <span class="separator">&gt;</span>
                <a href="home.html?category=${product.category}">${this.formatCategoryName(product.category)}</a>
                <span class="separator">&gt;</span>
                <span class="current">${product.name}</span>
            `;
        }
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Load and display related products
     */
    loadRelatedProducts(product) {
        const relatedContainer = document.getElementById('related-products');
        if (!relatedContainer) return;

        const relatedProducts = ProductDatabase.getProductsByCategory(product.category)
            .filter(p => p.id !== product.id)
            .slice(0, 4);

        if (relatedProducts.length > 0) {
            relatedContainer.innerHTML = `
                <h3>Related Products</h3>
                <div class="related-grid">
                    ${relatedProducts.map(p => this.createProductCard(p)).join('')}
                </div>
            `;
        }
    }

    /**
     * Create product card HTML
     */
    createProductCard(product) {
        return `
            <div class="product-card" onclick="productPage.navigateToProduct('${product.id}')">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <h4 class="product-title">${product.name}</h4>
                <div class="product-rating">${this.generateStarRating(product.rating)}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
    }

    /**
     * Navigate to another product
     */
    navigateToProduct(productId) {
        const newUrl = `product.html?id=${productId}`;
        window.history.pushState({productId}, '', newUrl);
        this.loadProductById(productId);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Add to cart button
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Quantity controls
        const quantityInput = document.getElementById('quantity-input');
        const quantityUp = document.getElementById('quantity-up');
        const quantityDown = document.getElementById('quantity-down');

        if (quantityUp) {
            quantityUp.addEventListener('click', () => this.updateQuantity(1));
        }
        
        if (quantityDown) {
            quantityDown.addEventListener('click', () => this.updateQuantity(-1));
        }

        // Cart toggle
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }
    }

    /**
     * Update quantity input
     */
    updateQuantity(change) {
        const quantityInput = document.getElementById('quantity-input');
        if (quantityInput) {
            let newQuantity = parseInt(quantityInput.value) + change;
            newQuantity = Math.max(1, Math.min(newQuantity, this.currentProduct?.stock || 99));
            quantityInput.value = newQuantity;
        }
    }

    /**
     * Add product to cart
     */
    addToCart() {
        if (!this.currentProduct) return;

        const quantityInput = document.getElementById('quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        const cartItem = {
            id: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.price,
            image: this.currentProduct.images[0],
            quantity: quantity
        };

        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex >= 0) {
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            this.cart.push(cartItem);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartFeedback();
    }

    /**
     * Show add to cart feedback
     */
    showAddToCartFeedback() {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = 'Added to Cart!';
            addToCartBtn.classList.add('added');
            
            setTimeout(() => {
                addToCartBtn.textContent = originalText;
                addToCartBtn.classList.remove('added');
            }, 2000);
        }
    }

    /**
     * Update cart display
     */
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    /**
     * Toggle cart visibility
     */
    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
            this.updateCartSidebar();
        }
    }

    /**
     * Update cart sidebar content
     */
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
                        <button class="remove-item" onclick="productPage.removeFromCart('${item.id}')">×</button>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    /**
     * Remove item from cart
     */
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartSidebar();
    }

    /**
     * Load cart from localStorage
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

    /**
     * Save cart to localStorage
     */
    saveCart() {
        try {
            localStorage.setItem('productCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    /**
     * Update element content safely
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Hide element safely
     */
    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * Update add to cart button state
     */
    updateAddToCartButton(product) {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            if (product.stock > 0) {
                addToCartBtn.disabled = false;
                addToCartBtn.textContent = 'Add to Cart';
            } else {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
            }
        }
    }

    /**
     * Redirect to category page
     */
    redirectToCategory(category) {
        window.location.href = `home.html?category=${category}`;
    }

    /**
     * Show error page
     */
    showErrorPage(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-page">
                    <h1>Product Not Found</h1>
                    <p>${message}</p>
                    <a href="home.html" class="btn btn-primary">Return to Home</a>
                </div>
            `;
        }
        document.title = 'Product Not Found - Product Store';
    }
}

// Initialize the product page when DOM is loaded
let productPage;
document.addEventListener('DOMContentLoaded', () => {
    productPage = new UniversalProductPage();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalProductPage;
}