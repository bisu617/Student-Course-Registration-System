/**
 * Centralized Product Database
 * Provides consistent access to product information across all pages
 */

// Product database - centralized data store
const ProductDatabase = {
    // All product data organized by category
    products: {
        keyboards: [
            {
                id: 'kb001',
                name: 'Gaming Mechanical Keyboard RGB',
                category: 'keyboards',
                price: 129.99,
                originalPrice: 149.99,
                stock: 15,
                description: 'Premium mechanical gaming keyboard with RGB backlighting and customizable key switches',
                features: ['RGB Backlighting', 'Mechanical Switches', 'Anti-Ghosting', 'Detachable Cable'],
                images: ['https://via.placeholder.com/400x400/007bff/ffffff?text=Gaming+Keyboard', 'https://via.placeholder.com/400x400/0056b3/ffffff?text=Gaming+Keyboard+2'],
                rating: 4.5,
                reviews: 342
            },
            {
                id: 'kb002',
                name: 'Wireless Compact Keyboard',
                category: 'keyboards',
                price: 79.99,
                originalPrice: 89.99,
                stock: 23,
                description: 'Compact wireless keyboard perfect for productivity and travel',
                features: ['Wireless Connectivity', 'Compact Design', 'Long Battery Life', 'Silent Keys'],
                images: ['https://via.placeholder.com/400x400/28a745/ffffff?text=Wireless+Keyboard', 'https://via.placeholder.com/400x400/1e7e34/ffffff?text=Wireless+Keyboard+2'],
                rating: 4.2,
                reviews: 189
            }
        ],
        mice: [
            {
                id: 'ms001',
                name: 'Gaming Mouse High DPI',
                category: 'mice',
                price: 59.99,
                originalPrice: 69.99,
                stock: 28,
                description: 'High-precision gaming mouse with adjustable DPI and programmable buttons',
                features: ['High DPI Sensor', 'Programmable Buttons', 'Ergonomic Design', 'RGB Lighting'],
                images: ['https://via.placeholder.com/400x400/dc3545/ffffff?text=Gaming+Mouse', 'https://via.placeholder.com/400x400/c82333/ffffff?text=Gaming+Mouse+2'],
                rating: 4.4,
                reviews: 456
            },
            {
                id: 'ms002',
                name: 'Wireless Office Mouse',
                category: 'mice',
                price: 29.99,
                originalPrice: 34.99,
                stock: 42,
                description: 'Comfortable wireless mouse designed for office productivity',
                features: ['Wireless Connectivity', 'Comfortable Grip', 'Precise Tracking', 'Long Battery'],
                images: ['https://via.placeholder.com/400x400/6c757d/ffffff?text=Office+Mouse', 'https://via.placeholder.com/400x400/545b62/ffffff?text=Office+Mouse+2'],
                rating: 4.1,
                reviews: 267
            }
        ],
        headphones: [
            {
                id: 'hp001',
                name: 'Noise-Cancelling Headphones',
                category: 'headphones',
                price: 199.99,
                originalPrice: 249.99,
                stock: 12,
                description: 'Premium noise-cancelling headphones with superior sound quality',
                features: ['Active Noise Cancellation', 'Wireless Bluetooth', 'High-Fidelity Audio', '30-Hour Battery'],
                images: ['https://via.placeholder.com/400x400/6f42c1/ffffff?text=Noise+Cancelling', 'https://via.placeholder.com/400x400/563d7c/ffffff?text=Headphones+2'],
                rating: 4.7,
                reviews: 523
            },
            {
                id: 'hp002',
                name: 'Gaming Headset with Mic',
                category: 'headphones',
                price: 89.99,
                originalPrice: 109.99,
                stock: 19,
                description: 'Professional gaming headset with crystal-clear microphone',
                features: ['Detachable Microphone', 'Surround Sound', 'Comfortable Padding', 'RGB Accent'],
                images: ['https://via.placeholder.com/400x400/fd7e14/ffffff?text=Gaming+Headset', 'https://via.placeholder.com/400x400/e55100/ffffff?text=Gaming+Headset+2'],
                rating: 4.3,
                reviews: 378
            }
        ],
        monitors: [
            {
                id: 'mn001',
                name: '27" 4K Gaming Monitor',
                category: 'monitors',
                price: 399.99,
                originalPrice: 449.99,
                stock: 8,
                description: '27-inch 4K gaming monitor with high refresh rate and HDR support',
                features: ['4K Resolution', '144Hz Refresh Rate', 'HDR Support', 'Ultra-thin Bezels'],
                images: ['https://via.placeholder.com/400x400/17a2b8/ffffff?text=4K+Monitor', 'https://via.placeholder.com/400x400/117a8b/ffffff?text=4K+Monitor+2'],
                rating: 4.6,
                reviews: 234
            },
            {
                id: 'mn002',
                name: '24" Professional Monitor',
                category: 'monitors',
                price: 249.99,
                originalPrice: 279.99,
                stock: 16,
                description: '24-inch professional monitor with accurate color reproduction',
                features: ['IPS Panel', 'Color Accurate', 'Height Adjustable', 'Multiple Inputs'],
                images: ['https://via.placeholder.com/400x400/20c997/ffffff?text=Pro+Monitor', 'https://via.placeholder.com/400x400/198754/ffffff?text=Pro+Monitor+2'],
                rating: 4.4,
                reviews: 156
            }
        ],
        mousepads: [
            {
                id: 'mp001',
                name: 'Gaming Mousepad XL',
                category: 'mousepads',
                price: 24.99,
                originalPrice: 29.99,
                stock: 45,
                description: 'Extra-large gaming mousepad with RGB lighting and smooth surface',
                features: ['XL Size', 'RGB Lighting', 'Non-slip Base', 'Water Resistant'],
                images: ['https://via.placeholder.com/400x400/f8f9fa/333333?text=RGB+Mousepad', 'https://via.placeholder.com/400x400/e9ecef/333333?text=RGB+Mousepad+2'],
                rating: 4.3,
                reviews: 298
            },
            {
                id: 'mp002',
                name: 'Desk Mat with Wireless Charging',
                category: 'mousepads',
                price: 49.99,
                originalPrice: 59.99,
                stock: 22,
                description: 'Large desk mat with integrated wireless charging pad',
                features: ['Wireless Charging', 'Large Size', 'Premium Material', 'Cable Management'],
                images: ['https://via.placeholder.com/400x400/343a40/ffffff?text=Desk+Mat', 'https://via.placeholder.com/400x400/212529/ffffff?text=Desk+Mat+2'],
                rating: 4.5,
                reviews: 187
            }
        ]
    },

    // Get all products
    getAllProducts() {
        const allProducts = [];
        Object.values(this.products).forEach(categoryProducts => {
            allProducts.push(...categoryProducts);
        });
        return allProducts;
    },

    // Get products by category
    getProductsByCategory(category) {
        return this.products[category] || [];
    },

    // Get single product by ID
    getProductById(productId) {
        const allProducts = this.getAllProducts();
        return allProducts.find(product => product.id === productId);
    },

    // Search products
    searchProducts(query) {
        const allProducts = this.getAllProducts();
        const searchTerm = query.toLowerCase();
        return allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    },

    // Filter products by price range
    filterByPriceRange(products, minPrice, maxPrice) {
        return products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    },

    // Sort products
    sortProducts(products, sortBy) {
        const productsCopy = [...products];
        switch (sortBy) {
            case 'price-low':
                return productsCopy.sort((a, b) => a.price - b.price);
            case 'price-high':
                return productsCopy.sort((a, b) => b.price - a.price);
            case 'rating':
                return productsCopy.sort((a, b) => b.rating - a.rating);
            case 'name':
                return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
            default:
                return productsCopy;
        }
    },

    // Get categories
    getCategories() {
        return Object.keys(this.products);
    },

    // Get featured products (highest rated products)
    getFeaturedProducts(limit = 6) {
        const allProducts = this.getAllProducts();
        return allProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDatabase;
}