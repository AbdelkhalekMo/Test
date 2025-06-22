// Product Container with Infinite Loop Slider
class ProductContainerSlider {
    constructor() {
        this.currentIndex = 0;
        this.itemsToShow = this.getItemsToShow();
        this.isTransitioning = false;
        this.autoScrollInterval = null;
        this.isHovered = false;
        
        // Sample product data - exactly 7 products
        this.products = [
            {
                id: 1,
                image: 'assets/images/yellow-container/12.jpg.png',
                title: 'Jarrow\'s Best GABA 750 mg GUMMIES',
                rating: 4.5,
                ratingCount: '24,714',
                price: 'EGP523.23',
                origin: 'United States'
            },
            {
                id: 2,
                image: 'assets/images/yellow-container/17.jpg.png',
                title: 'Citricidal Grapefruit Seed Extract Liquid',
                rating: 4.0,
                ratingCount: '3,156',
                price: 'EGP202.90',
                origin: 'Japan'
            },
            {
                id: 3,
                image: 'assets/images/yellow-container/24.jpg.png',
                title: 'Weens Multivitamins Soft of Life LIFE',
                rating: 4.8,
                ratingCount: '1,899',
                price: 'EGP593.99',
                origin: 'United States'
            },
            {
                id: 4,
                image: 'assets/images/yellow-container/39.jpg.png',
                title: 'Chlorella Superfood Tablets Supplement',
                rating: 4.2,
                ratingCount: '5,420',
                price: 'EGP312.45',
                origin: 'United States'
            },
            {
                id: 5,
                image: 'assets/images/yellow-container/44.jpg.png',
                title: 'Himalaya LiverCare for Liver Health',
                rating: 4.6,
                ratingCount: '8,932',
                price: 'EGP167.22',
                origin: 'United States'
            },
            {
                id: 6,
                image: 'assets/images/yellow-container/53.jpg.png',
                title: 'Healthfarm Vegan Amino Blend Collagen',
                rating: 4.3,
                ratingCount: '2,156',
                price: 'EGP343.86',
                origin: 'United States'
            },
            {
                id: 7,
                image: 'assets/images/yellow-container/58.jpg.png',
                title: 'Nature\'s Way Rhodiola 250 mg, 60 Capsules',
                rating: 4.4,
                ratingCount: '1,673',
                price: 'EGP584.97',
                origin: 'Japan'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.itemsToShow = this.getItemsToShow();
        console.log('ProductContainerSlider initialized with itemsToShow:', this.itemsToShow);
        this.render();
        this.bindEvents();
        this.startAutoScroll();
        this.handleResize();
    }
    
    getItemsToShow() {
        const width = window.innerWidth;
        if (width >= 1200) return 6; // Show exactly 6 items on large screens
        if (width >= 992) return 5;
        if (width >= 768) return 4;
        if (width >= 576) return 3;
        return 2;
    }
    
    createInfiniteLoop() {
        // Create clones for infinite loop
        const cloneCount = this.itemsToShow;
        const frontClones = [];
        const backClones = [];
        
        // Create clones at the end (for going forward)
        for (let i = 0; i < cloneCount; i++) {
            frontClones.push({
                ...this.products[i],
                id: `${this.products[i].id}-clone-front-${i}`,
                isClone: true
            });
        }
        
        // Create clones at the beginning (for going backward)
        for (let i = this.products.length - cloneCount; i < this.products.length; i++) {
            backClones.push({
                ...this.products[i],
                id: `${this.products[i].id}-clone-back-${i}`,
                isClone: true
            });
        }
        
        return [...backClones, ...this.products, ...frontClones];
    }
    
        // Generate star rating HTML
    generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Generate combined product card with country label
    generateProductCard(product) {
        return `
            <div class="product-item" data-product-id="${product.id}">
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-title">${product.title}</div>
                    <div class="product-rating">
                        <div class="stars">${this.generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <div class="product-price">${product.price}</div>
                </div>
                <div class="product-origin">${product.origin}</div>
            </div>
        `;
    }
    
    // Render products with infinite loop
    render() {
        const container = document.querySelector('.product-container');
        if (!container) {
            console.log('Product container not found!');
            return;
        }

        const infiniteData = this.createInfiniteLoop();
        console.log('Rendering with', infiniteData.length, 'items (including clones), itemsToShow:', this.itemsToShow);
        
        // Update the container HTML structure
        const existingHeader = container.querySelector('.container-header');
        const headerHTML = existingHeader ? existingHeader.outerHTML : `
            <div class="container-header">
                <div class="header-left">
                    <h2 class="header-title">iHerb</h2>
                    <span class="live-badge">LIVE</span>
                    <i class="fas fa-info-circle info-icon"></i>
                </div>
                <div class="header-right">
                    <a href="#" class="product-section__view-all">View All</a>
                    <div class="notification-badge">8</div>
                </div>
            </div>
        `;
        
        container.innerHTML = `
            ${headerHTML}
            <div class="product-carousel-container">
                <button class="carousel-nav prev nav-btn prev-btn" type="button">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next nav-btn next-btn" type="button">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="products-track">
                    ${infiniteData.map(product => this.generateProductCard(product)).join('')}
                </div>
            </div>
        `;
        
        // Set initial position to show original items (skip back clones)
        this.currentIndex = this.itemsToShow;
        this.updatePosition(false);
        
        // Bind events after rendering
        this.bindEvents();
    }
    
    updatePosition(animate = true) {
        const track = document.querySelector('.products-track');
        if (!track) return;
        
        const itemWidth = track.children[0]?.offsetWidth || 0;
        const gap = 12;
        const translateX = -(this.currentIndex * (itemWidth + gap));
        
        if (animate) {
            track.style.transition = 'transform 0.4s ease';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${translateX}px)`;
        
        // Reset transition after animation
        if (animate) {
            setTimeout(() => {
                track.style.transition = 'transform 0.4s ease';
            }, 400);
        }
    }
    
    checkInfiniteLoop() {
        const track = document.querySelector('.products-track');
        if (!track) return;
        
        const totalItems = track.children.length;
        const cloneCount = this.itemsToShow;
        
        // If we're at the end clones, jump to the beginning of original items
        if (this.currentIndex >= totalItems - cloneCount) {
            setTimeout(() => {
                this.currentIndex = cloneCount;
                this.updatePosition(false);
            }, 400);
        }
        
        // If we're at the beginning clones, jump to the end of original items
        if (this.currentIndex <= 0) {
            setTimeout(() => {
                this.currentIndex = totalItems - cloneCount * 2;
                this.updatePosition(false);
            }, 400);
        }
    }
    
    prev() {
        console.log('Prev method called, isTransitioning:', this.isTransitioning);
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        console.log('Moving to index:', this.currentIndex);
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }

    next() {
        console.log('Next method called, isTransitioning:', this.isTransitioning);
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        console.log('Moving to index:', this.currentIndex);
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }
    
    startAutoScroll() {
        if (this.isHovered) return;
        
        this.autoScrollInterval = setInterval(() => {
            if (this.isHovered || this.isTransitioning) return;
            
            this.next();
        }, 4000);
    }
    
    stopAutoScroll() {
        clearInterval(this.autoScrollInterval);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            const oldItemsToShow = this.itemsToShow;
            this.itemsToShow = this.getItemsToShow();
            
            // Re-render if items to show changed
            if (oldItemsToShow !== this.itemsToShow) {
                this.render();
                this.bindEvents();
            } else {
                this.updatePosition(false);
            }
        });
    }
    
    bindEvents() {
        const container = document.querySelector('.product-container');
        
        // Use event delegation for better reliability
        if (container) {
            // Remove existing delegated listeners
            container.removeEventListener('click', this.handleNavClick);
            
            // Add new delegated listener
            this.handleNavClick = (e) => {
                console.log('Click detected on:', e.target, 'Closest prev-btn:', e.target.closest('.prev-btn'), 'Closest next-btn:', e.target.closest('.next-btn'));
                if (e.target.closest('.prev-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Previous button clicked via delegation');
                    this.prev();
                } else if (e.target.closest('.next-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Next button clicked via delegation');
                    this.next();
                }
            };
            
            container.addEventListener('click', this.handleNavClick);
            console.log('Event delegation set up for navigation buttons');
        }
        
        // Mouse hover events for auto-scroll
        if (container) {
            container.addEventListener('mouseenter', () => {
                this.isHovered = true;
                this.stopAutoScroll();
            });
            
            container.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.startAutoScroll();
            });
        }
        
        // Product card click handler
        document.addEventListener('click', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productId = productItem.dataset.productId;
                const product = this.products.find(p => p.id == productId);
                
                if (product) {
                    // Add click animation
                    productItem.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        productItem.style.transform = '';
                    }, 150);
                    
                    console.log(`Product clicked: ${product.title} - ${product.price}`);
                    this.showProductModal(product);
                }
            }
        });
        
        // Other interactive elements
        this.bindInteractiveElements();
    }
    
    // Enhanced product modal (optional)
    showProductModal(product) {
        const modalHTML = `
            <div class="product-modal-overlay" id="productModal">
                <div class="product-modal">
                    <div class="product-modal-header">
                        <h3>${product.title}</h3>
                        <button class="product-modal-close">&times;</button>
                    </div>
                    <div class="product-modal-content">
                        <img src="${product.image}" alt="${product.title}" class="product-modal-image">
                        <div class="product-modal-details">
                            <div class="product-modal-rating">
                                <div class="stars">${this.generateStars(product.rating)}</div>
                                <span>(${product.ratingCount} reviews)</span>
                            </div>
                            <div class="product-modal-price">${product.price}</div>
                            <div class="product-modal-origin">Origin: ${product.origin}</div>
                            <button class="product-modal-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('productModal').style.display = 'flex';
    }
    
        bindInteractiveElements() {
        // Close modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-modal-close') || 
                e.target.classList.contains('product-modal-overlay')) {
                const modal = document.getElementById('productModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.remove();
                }
            }
        });

        // Info icon tooltip with enhanced interaction
        const infoIcon = document.querySelector('.info-icon');
        if (infoIcon) {
            infoIcon.addEventListener('mouseenter', () => {
                infoIcon.title = 'Live product updates - 7 products displayed';
            });
        }

        // Live badge interaction
        const liveBadge = document.querySelector('.live-badge');
        if (liveBadge) {
            liveBadge.addEventListener('click', () => {
                liveBadge.style.animation = 'pulse 1s ease';
                setTimeout(() => {
                    liveBadge.style.animation = '';
                }, 1000);
                
                console.log('Live updates refreshed');
            });
        }

        // Notification badge interaction
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            notificationBadge.addEventListener('click', () => {
                notificationBadge.style.animation = 'bounce 1s ease';
                setTimeout(() => {
                    notificationBadge.style.animation = '';
                }, 1000);
                
                alert('You have 8 new product notifications!');
            });
        }

        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            const productItem = e.target.closest('.product-item');
            if (productItem && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                productItem.click();
            }
        });
    }
    
    addModalStyles() {
        if (document.querySelector('#productModalStyles')) return;
        
        const modalCSS = `
            <style id="productModalStyles">
            .product-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            
            .product-modal {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .product-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .product-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .product-modal-content {
                padding: 20px;
            }
            
            .product-modal-image {
                width: 100%;
                max-width: 200px;
                height: 200px;
                object-fit: contain;
                margin: 0 auto 20px;
                display: block;
            }
            
            .product-modal-rating {
                margin-bottom: 10px;
            }
            
            .product-modal-price {
                font-size: 1.5rem;
                font-weight: 700;
                color: #e74c3c;
                margin-bottom: 10px;
            }
            
            .product-modal-origin {
                color: #666;
                margin-bottom: 20px;
            }
            
            .product-modal-add-to-cart {
                background: #28a745;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
            }
            
            .product-modal-add-to-cart:hover {
                background: #218838;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', modalCSS);
    }
}

// Initialize the product container slider
$(document).ready(function() {
    const productContainerSlider = new ProductContainerSlider();
    productContainerSlider.addModalStyles();
    
    console.log('Product Container initialized with infinite loop slider');
}); 