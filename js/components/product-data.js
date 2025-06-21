/**
 * Enhanced Product Carousel System
 * Centralized data management for products and categories with carousel functionality
 */

// Product Carousel Class
class ProductCarousel {
    constructor(containerId, title, products, options = {}) {
        this.containerId = containerId;
        this.title = title;
        this.products = products;
        this.currentIndex = 0;
        this.itemsToShow = options.itemsToShow || 6;
        this.slideStep = options.slideStep || 1; // Changed to 1 for smoother infinite scroll
        this.hasViewAll = options.hasViewAll || false;
        this.isTransitioning = false;
        this.autoScrollInterval = null;
        this.isHovered = false;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.startAutoScroll();
        this.handleResize();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const viewAllButton = this.hasViewAll ? 
            `<a href="#" class="product-section__view-all">View All</a>` : '';

        container.innerHTML = `
            <div class="product-carousel">
                <div class="carousel-header">
                    <h3 class="carousel-title">${this.title}</h3>
                    ${viewAllButton}
                </div>
                <div class="products-container">
                    <div class="carousel-nav prev">
                        <button class="nav-btn prev-btn" data-carousel="${this.containerId}">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                    </div>
                    <div class="carousel-nav next">
                        <button class="nav-btn next-btn" data-carousel="${this.containerId}">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="products-track">
                        ${this.createInfiniteLoop().map(product => this.renderProduct(product)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderProduct(product) {
        const stars = this.renderStars(product.rating);
        const badge = product.badge ? `<span class="product-card__badge badge bg-warning">${product.badge}</span>` : '';
        const priceHTML = product.originalPrice ? 
            `<div class="product-card__price">
                <span class="product-card__sale-price">${product.currentPrice}</span>
                <span class="product-card__original-price">${product.originalPrice}</span>
            </div>` :
            `<div class="product-card__price">
                <span class="product-card__current-price">${product.currentPrice}</span>
            </div>`;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                ${badge}
                <img src="${product.image}" alt="${product.title}" class="product-card__image">
                <div class="product-card__content">
                    <div class="product-card__title">${product.title}</div>
                    <div class="product-card__rating">
                        <div class="product-card__stars">${stars}</div>
                        <span class="product-card__reviews">(${product.reviewCount || 0})</span>
                    </div>
                    ${priceHTML}
                </div>
                <div class="product-card__overlay">
                    <button class="product-card__add-to-cart" onclick="addToCart(${product.id}, '${product.title}')">
                        Add to cart
                    </button>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
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

    bindEvents() {
        const prevBtn = document.querySelector(`[data-carousel="${this.containerId}"].prev-btn`);
        const nextBtn = document.querySelector(`[data-carousel="${this.containerId}"].next-btn`);
        const container = document.getElementById(this.containerId);
        
        console.log('ProductCarousel: Setting up arrows', { 
            containerId: this.containerId,
            prevBtn, 
            nextBtn,
            prevBtnClasses: prevBtn?.className,
            nextBtnClasses: nextBtn?.className
        });
        
        prevBtn?.addEventListener('click', () => {
            console.log('Previous button clicked');
            this.prev();
        });
        
        nextBtn?.addEventListener('click', () => {
            console.log('Next button clicked');
            this.next();
        });
        
        // Ensure arrows are visible
        if (prevBtn) {
            prevBtn.style.display = 'flex';
            prevBtn.style.visibility = 'visible';
            prevBtn.style.opacity = '1';
            prevBtn.style.zIndex = '1000';
            
            // Ensure the arrow has an icon
            if (!prevBtn.innerHTML.trim() || !prevBtn.querySelector('i')) {
                prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i>`;
            }
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.style.visibility = 'visible';
            nextBtn.style.opacity = '1';
            nextBtn.style.zIndex = '1000';
            
            // Ensure the arrow has an icon
            if (!nextBtn.innerHTML.trim() || !nextBtn.querySelector('i')) {
                nextBtn.innerHTML = `<i class="fas fa-chevron-right"></i>`;
            }
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
        
        // Set initial position to show original items (skip back clones)
        this.currentIndex = this.itemsToShow;
        this.updatePosition(false);
    }

    prev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex -= this.slideStep;
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }

    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex += this.slideStep;
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }

    updatePosition(animate = true) {
        const track = document.querySelector(`#${this.containerId} .products-track`);
        if (!track) return;
        
        const cardWidth = track.children[0]?.offsetWidth || 0;
        const gap = 15;
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
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
        const track = document.querySelector(`#${this.containerId} .products-track`);
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
            this.updatePosition(false);
        });
    }

    updateProducts(newProducts, newTitle = null) {
        this.products = newProducts;
        if (newTitle) this.title = newTitle;
        this.currentIndex = this.itemsToShow; // Reset to show original items
        this.render();
        this.bindEvents();
    }
}

const imageFiles = [
    'assets/images/trending & recommending/11.jpg (1).png',
    'assets/images/trending & recommending/14.jpg.png',
    'assets/images/trending & recommending/35.jpg (1).png',
    'assets/images/trending & recommending/57.jpg.png',
    'assets/images/trending & recommending/69.jpg.png',
    'assets/images/trending & recommending/8.jpg.png'
];

function assignImagesToProducts(products) {
    return products.map((product, idx) => ({
        ...product,
        image: imageFiles[idx % imageFiles.length]
    }));
}

const specialsImageFiles = [
    'assets/images/special picked for you/California Gold Nutrition, Gold C™, USP Grade Vitamin C, 1,000 mg, 240 Veggie Capsules.png',
    'assets/images/special picked for you/California Gold Nutrition, Omega 800 Ultra-Concentrated Omega-3 Fish Oil, kd-pur Triglyceride Form, 30 Fish Gelatin Softgels (1,000 mg per Softgel).png',
    'assets/images/special picked for you/California Gold Nutrition, Omega-3 Premium Fish Oil, 100 Fish Gelatin Softgels (1,100 mg per Softgel).png',
    'assets/images/special picked for you/California Gold Nutrition, Omega-3, Premium Fish Oil, 240 Fish Gelatin Softgels.png',
    'assets/images/special picked for you/California Gold Nutrition, Sport, Creatine Monohydrate, Unflavored, 1 lb (454 g).png',
    'assets/images/special picked for you/NOW Foods, Omega-3 Fish Oil, 200 Softgels.png'
];

function assignImagesToSpecials(products) {
    return products.map((product, idx) => ({
        ...product,
        image: specialsImageFiles[idx % specialsImageFiles.length]
    }));
}

// Product data for different sections
const PRODUCT_DATA = {
    bestSellers: [
        {
            id: 'bs1',
            title: 'California Gold Nutrition, LactoBif® 30 Probiotics, 30 Billion CFU, 60 Veggie Capsules',
            image: 'assets/images/best seller/California Gold Nutrition, LactoBif® 30 Probiotics, 30 Billion CFU, 60 Veggie Capsules.png',
            rating: 4.8,
            reviewCount: 34916,
            currentPrice: 'EGP1,202.22',
            originalPrice: null,
            badge: null
        },
        {
            id: 'bs2',
            title: 'California Gold Nutrition, Omega-3 Premium Fish Oil, 100 Fish Gelatin Softgels (1,100 mg per Softgel)',
            image: 'assets/images/best seller/California Gold Nutrition, Omega-3 Premium Fish Oil, 100 Fish Gelatin Softgels (1,100 mg per Softgel).png',
            rating: 4.6,
            reviewCount: 4394,
            currentPrice: 'EGP591.06',
            originalPrice: 'EGP405.37',
            badge: null
        },
        {
            id: 'bs3',
            title: 'Doctor\'s Best, High Absorption Magnesium, 240 Tablets (100 mg Per Tablet)',
            image: 'assets/images/best seller/Doctor\'s Best, High Absorption Magnesium, 240 Tablets (100 mg Per Tablet).png',
            rating: 4.7,
            reviewCount: 35215,
            currentPrice: 'EGP1,146.94',
            originalPrice: null,
            badge: null
        },
        {
            id: 'bs4',
            title: 'California Gold Nutrition, Gold C™, USP Grade Vitamin C, 1,000 mg, 60 Veggie Capsules',
            image: 'assets/images/best seller/California Gold Nutrition, Gold C™, USP Grade Vitamin C, 1,000 mg, 60 Veggie Capsules.png',
            rating: 4.8,
            reviewCount: 35215,
            currentPrice: 'EGP926.12',
            originalPrice: null,
            badge: null
        },
        {
            id: 'bs5',
            title: 'Life Extension, BioActive Complete B-Complex, 60 Vegetarian Capsules',
            image: 'assets/images/best seller/Life Extension, BioActive Complete B-Complex, 60 Vegetarian Capsules.png',
            rating: 4.6,
            reviewCount: 91302,
            currentPrice: 'EGP564.62',
            originalPrice: null,
            badge: null
        },
        {
            id: 'bs6',
            title: 'California Gold Nutrition, CollagenUP®, Hydrolyzed Marine Collagen Peptides with Hyaluronic Acid and Vitamin C, Unflavored, 7.26 oz (206 g)',
            image: 'assets/images/best seller/California Gold Nutrition, CollagenUP®, Hydrolyzed Marine Collagen Peptides with Hyaluronic Acid and Vitamin C, Unflavored, 7.26 oz (206 g).png',
            rating: 4.5,
            reviewCount: 6341,
            currentPrice: 'EGP1,011.65',
            originalPrice: null,
            badge: null
        }
    ],
    
    newArrivals: [
        {
            id: 'na1',
            title: 'Bliss, Fab Foaming 2-In-1 Cleanser & Exfoliator, 6.4 fl oz (190 ml)',
            image: 'assets/images/new arrivals/Bliss, Fab Foaming 2-In-1 Cleanser & Exfoliator, 6.4 fl oz (190 ml).png',
            rating: 4.2,
            reviewCount: 0,
            currentPrice: 'EGP846.08',
            originalPrice: 'EGP940.09',
            badge: 'New'
        },
        {
            id: 'na2',
            title: 'Molvany, Artichoke Soothing Affect Pore Toner Pad, 70 Pads, 5.64 oz (160 g)',
            image: 'assets/images/new arrivals/Molvany, Artichoke Soothing Affect Pore Toner Pad, 70 Pads, 5.64 oz (160 g).png',
            rating: 4.3,
            reviewCount: 0,
            currentPrice: 'EGP1,287.87',
            originalPrice: 'EGP1,430.97',
            badge: 'New'
        },
        {
            id: 'na3',
            title: 'Molvany, Artichoke Calming Care Soothing Cream, 3.38 fl oz (100 ml)',
            image: 'assets/images/new arrivals/Molvany, Artichoke Calming Care Soothing Cream , 3.38 fl oz (100 ml).png',
            rating: 4.1,
            reviewCount: 0,
            currentPrice: 'EGP1,230.39',
            originalPrice: 'EGP1,367.10',
            badge: 'New'
        },
        {
            id: 'na4',
            title: 'Bliss, Glow & Hydrate Nourishing Day Serum, 1 fl oz (30 ml)',
            image: 'assets/images/new arrivals/Bliss, Glow & Hydrate Nourishing Day Serum, 1 fl oz (30 ml).png',
            rating: 4.4,
            reviewCount: 0,
            currentPrice: 'EGP1,325.55',
            originalPrice: 'EGP1,472.83',
            badge: 'New'
        },
        {
            id: 'na5',
            title: 'Bliss, Youth Got This™, Pure Retinol Moisturizer, 1.7 fl oz (50 ml)',
            image: 'assets/images/new arrivals/Bliss, Youth Got This™, Pure Retinol Moisturizer, 1.7 fl oz (50 ml).png',
            rating: 4.3,
            reviewCount: 0,
            currentPrice: 'EGP1,236.75',
            originalPrice: 'EGP1,374.17',
            badge: 'New'
        },
        {
            id: 'na6',
            title: 'JOI, Oat Milk Creamer, Original, 10 Packets, 0.42 oz (12 g) Each',
            image: 'assets/images/new arrivals/JOI, Oat Milk Creamer, Original, 10 Packets, 0.42 oz (12 g) Each.png',
            rating: 4.0,
            reviewCount: 0,
            currentPrice: 'EGP800.61',
            originalPrice: 'EGP889.57',
            badge: 'New'
        }
    ],
    
    recommended: assignImagesToProducts([
        {
            id: 1,
            title: "Wild by Nature, Whole Food Alpha Plus, Blueberry, 13 Packets",
            rating: 5,
            reviewCount: 1,
            currentPrice: "EGP142.07",
            originalPrice: "EGP168.09",
            badge: "Sale"
        },
        {
            id: 2,
            title: "Aura Cacia, Spot Treatment Clear Skin, Tea Tree Oil, 0.5 fl oz (15 ml)",
            rating: 4,
            reviewCount: 34,
            currentPrice: "EGP86.36",
            originalPrice: null,
            badge: null
        },
        {
            id: 3,
            title: "All-1, Anti-Cavity Fluoride Toothpaste, Mint, 5 oz (142 g)",
            rating: 4,
            reviewCount: 44,
            currentPrice: "EGP54.14",
            originalPrice: null,
            badge: null
        },
        {
            id: 4,
            title: "Jarrow Formulas, Ashwagandha, 300 mg, 120 Veggie Caps",
            rating: 5,
            reviewCount: 1012,
            currentPrice: "EGP113.18",
            originalPrice: null,
            badge: null
        },
        {
            id: 5,
            title: "21st Century, Glucosamine Chondroitin, 200 mg, 120 Easy to Swallow Capsules",
            rating: 4,
            reviewCount: 174,
            currentPrice: "EGP184.74",
            originalPrice: null,
            badge: null
        },
        {
            id: 6,
            title: "NOW Foods, C-1000, With 100 mg of Bioflavonoids, 100 Tablets",
            rating: 5,
            reviewCount: 2031,
            currentPrice: "EGP86.51",
            originalPrice: null,
            badge: null
        },
        {
            id: 13,
            title: "Extra Product for Carousel Testing 1",
            rating: 4.5,
            reviewCount: 567,
            currentPrice: "EGP299.99",
            originalPrice: null,
            badge: null
        },
        {
            id: 14,
            title: "Extra Product for Carousel Testing 2",
            rating: 4.2,
            reviewCount: 234,
            currentPrice: "EGP199.99",
            originalPrice: "EGP249.99",
            badge: "New"
        }
    ]),
    
    specials: assignImagesToSpecials([
        {
            id: 7,
            title: "California Gold Nutrition, Omega-3 Premium Fish Oil, 100 Fish Gelatin Softgels",
            rating: 5,
            reviewCount: 41341,
            currentPrice: "EGP591.06",
            originalPrice: "EGP618.22",
            badge: "Sale"
        },
        {
            id: 8,
            title: "California Gold Nutrition, Gold C, USP Grade Vitamin C, 500 mg, 240 Veggie Caps",
            rating: 5,
            reviewCount: 19219,
            currentPrice: "EGP747.10",
            originalPrice: "EGP815.18",
            badge: "Sale"
        },
        {
            id: 9,
            title: "California Gold Nutrition, Omega-3, Premium Fish Oil, 240 Fish Gelatin Softgels",
            rating: 5,
            reviewCount: 41517,
            currentPrice: "EGP1,289.64",
            originalPrice: "EGP1,417.22",
            badge: "Sale"
        },
        {
            id: 10,
            title: "California Gold Nutrition, Sport, Creatine Monohydrate, Unflavored, 16 oz (454 g)",
            rating: 5,
            reviewCount: 1307,
            currentPrice: "EGP936.11",
            originalPrice: "EGP1,031.01",
            badge: "Sale"
        },
        {
            id: 11,
            title: "California Gold Nutrition, Omega 800 Ultra-Concentrated Omega-3",
            rating: 5,
            reviewCount: 11647,
            currentPrice: "EGP419.53",
            originalPrice: "EGP459.48",
            badge: "Sale"
        },
        {
            id: 12,
            title: "NOW Foods, Omega-3 Fish Oil, Lemon Flavored, 16.9 fl oz (500 ml)",
            rating: 5,
            reviewCount: 10169,
            currentPrice: "EGP688.81",
            originalPrice: "EGP764.61",
            badge: "Sale"
        },
        {
            id: 15,
            title: "Extra Special Product for Carousel 1",
            rating: 4.8,
            reviewCount: 123,
            currentPrice: "EGP399.99",
            originalPrice: "EGP499.99",
            badge: "Hot"
        },
        {
            id: 16,
            title: "Extra Special Product for Carousel 2",
            rating: 4.9,
            reviewCount: 567,
            currentPrice: "EGP799.99",
            originalPrice: null,
            badge: null
        }
    ]),
    
    trending: assignImagesToProducts([
        {
            id: 17,
            title: "Mist by Nature Witch Hazel, Alcohol Free, Unscented, 8 fl oz (237 ml)",
            rating: 4.3,
            reviewCount: 1285,
            currentPrice: "EGP412.87",
            originalPrice: null,
            badge: null
        },
        {
            id: 18,
            title: "Acti-V Dark Spot Correcting Glow Serum, 1.69 fl oz (50 ml)",
            rating: 4.5,
            reviewCount: 967,
            currentPrice: "EGP969.36",
            originalPrice: null,
            badge: null
        },
        {
            id: 19,
            title: "Act, Anticavity Fluoride Mouthwash, Alcohol Free, Mint, 18 fl oz (532 ml)",
            rating: 4.7,
            reviewCount: 2341,
            currentPrice: "EGP541.66",
            originalPrice: null,
            badge: null
        },
        {
            id: 20,
            title: "Avalon Organics, Thickening Shampoo, Biotin B-Complex, 14 fl oz",
            rating: 4.2,
            reviewCount: 1543,
            currentPrice: "EGP715.18",
            originalPrice: null,
            badge: null
        },
        {
            id: 21,
            title: "21st Century, Potassium Gluconate, 595 mg, 110 Tablets",
            rating: 4.4,
            reviewCount: 876,
            currentPrice: "EGP188.94",
            originalPrice: null,
            badge: null
        },
        {
            id: 22,
            title: "NOW Foods, C-1000, With Rose Hips and Bioflavonoids, 100 Tablets",
            rating: 4.8,
            reviewCount: 3214,
            currentPrice: "EGP536.51",
            originalPrice: null,
            badge: null
        }
    ])
};

// Category data - Main shop by category section
const CATEGORY_DATA = {
    shopByCategory: [
        {
            id: 1,
            title: "Supplements",
            image: "assets/images/shop by categories/Supplements.png",
            icon: "fas fa-pills"
        },
        {
            id: 2,
            title: "Sports",
            image: "assets/images/shop by categories/Sports.png",
            icon: "fas fa-dumbbell"
        },
        {
            id: 3,
            title: "Beauty",
            image: "assets/images/shop by categories/Beauty.png",
            icon: "fas fa-heart"
        },
        {
            id: 4,
            title: "Grocery",
            image: "assets/images/shop by categories/Grocery.png",
            icon: "fas fa-shopping-basket"
        },
        {
            id: 5,
            title: "Bath & Personal Care",
            image: "assets/images/shop by categories/Bath & Personal Care.png",
            icon: "fas fa-bath"
        },
        {
            id: 6,
            title: "Pets",
            image: "assets/images/shop by categories/Pets.png",
            icon: "fas fa-paw"
        },
        {
            id: 7,
            title: "Home",
            image: "assets/images/shop by categories/Home.png",
            icon: "fas fa-home"
        },
        {
            id: 8,
            title: "Baby & Kids",
            image: "assets/images/shop by categories/Baby & Kids.png",
            icon: "fas fa-baby"
        }
    ],
    
    bottomCategories: [
        {
            id: 9,
            title: "Selected for you",
            image: "assets/images/shop by categories/Supplements.png",
            icon: "fas fa-star"
        },
        {
            id: 10,
            title: "Vitamins",
            image: "assets/images/shop by categories/Beauty.png",
            icon: "fas fa-capsules"
        },
        {
            id: 11,
            title: "Minerals",
            image: "assets/images/shop by categories/Grocery.png",
            icon: "fas fa-gem"
        },
        {
            id: 12,
            title: "Herbs",
            image: "assets/images/shop by categories/Bath & Personal Care.png",
            icon: "fas fa-leaf"
        },
        {
            id: 13,
            title: "Protein",
            image: "assets/images/shop by categories/Sports.png",
            icon: "fas fa-dumbbell"
        },
        {
            id: 14,
            title: "Wellness",
            image: "assets/images/shop by categories/Pets.png",
            icon: "fas fa-heart-pulse"
        },
        {
            id: 15,
            title: "Natural",
            image: "assets/images/shop by categories/Home.png",
            icon: "fas fa-seedling"
        },
        {
            id: 16,
            title: "Organic",
            image: "assets/images/shop by categories/Baby & Kids.png",
            icon: "fas fa-apple-alt"
        },
        {
            id: 17,
            title: "Fitness",
            image: "assets/images/shop by categories/Sports.png",
            icon: "fas fa-running"
        }
    ]
};

// Enhanced Category System with SVG Icons
const CATEGORY_ICONS = {
    'Supplements': `<svg viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
    </svg>`,
    'Sports': `<svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>`,
    'Bath & Personal Care': `<svg viewBox="0 0 24 24">
        <path d="M7 17h10v1c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-1zM20 8H4V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2zm-2 2v6H6v-6h12zm-8 2h4v2h-4v-2z"/>
    </svg>`,
    'Beauty': `<svg viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`,
    'Grocery': `<svg viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>`,
    'Home': `<svg viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>`,
    'Baby & Kids': `<svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>`,
    'Pets': `<svg viewBox="0 0 24 24">
        <path d="M4.5 13.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S6.83 12 6 12s-1.5.67-1.5 1.5zM9 9c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S11.33 7.5 10.5 7.5 9 8.17 9 9zm4.5 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5S13.5 8.17 13.5 9zM16.5 13.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zM12 16c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"/>
    </svg>`
};

// Filter items for the enhanced category section
const FILTER_ITEMS = [
    'Supplements', 'Bath & Personal Care', 'Beauty', 'Sports', 
    'Grocery', 'Kids & Babies', 'Pets', 'Home'
];

// Enhanced category section generator
function generateEnhancedCategorySection() {
    const categories = CATEGORY_DATA.shopByCategory || [];
    
    const categoryCards = categories.map(category => {
        return `
            <div class="category-grid-item">
                <div class="category-item-simple" onclick="selectCategory('${category.title}')">
                    <div class="category-image-circle">
                        <img src="${category.image}" alt="${category.title}" class="category-image">
                    </div>
                    <div class="category-label-simple">${category.title}</div>
                </div>
            </div>
        `;
    }).join('');
    
    const filterItems = FILTER_ITEMS.map((item, index) => 
        `<div class="filter-item ${index === 0 ? 'active' : ''}" onclick="selectFilter(this, '${item}')">
            ${item}
            <i class="fas fa-chevron-right filter-item__arrow"></i>
        </div>`
    ).join('');
    
    return `
        <div class="filter-section">
            <div class="container" style="max-width: 1200px;">
                <h3 class="filter-title">
                    Selected for you
                    <span class="nav-arrow" onclick="navigateFilters()">→</span>
                </h3>
                <div class="scroll-container">
                    <div class="filter-items-wrapper" id="filterItems">
                        ${filterItems}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Shop by Category section
function generateShopByCategorySection() {
    const categories = CATEGORY_DATA.shopByCategory || [];
    
    const categoryCards = categories.map(category => {
        return `
            <div class="category-grid-item">
                <div class="category-item-simple" onclick="selectCategory('${category.title}')">
                    <div class="category-image-circle">
                        <img src="${category.image}" alt="${category.title}" class="category-image">
                    </div>
                    <div class="category-label-simple">${category.title}</div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="category-section category-section--no-bg">
            <div class="container" style="max-width: 1200px;">
                <h2 class="category-title">Shop by category</h2>
                <div class="category-grid" id="categoryGrid">
                    ${categoryCards}
                </div>
            </div>
        </div>
    `;
}

// Category interaction functions
function selectCategory(categoryName) {
    console.log('Selected category:', categoryName);
    
    // Add visual feedback
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.style.transform = '';
        item.style.backgroundColor = '';
    });
    
    // Find and highlight selected category
    categoryItems.forEach(item => {
        if (item.querySelector('.category-label').textContent === categoryName) {
            item.style.backgroundColor = '#fff';
            item.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            item.style.transform = 'translateY(-2px)';
            
            setTimeout(() => {
                item.style.backgroundColor = '';
                item.style.boxShadow = '';
                item.style.transform = '';
            }, 2000);
        }
    });
}

function selectFilter(element, filterName) {
    // Remove active class from all filters
    document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected filter
    element.classList.add('active');
    
    console.log('Selected filter:', filterName);
}

function navigateFilters() {
    const filterContainer = document.querySelector('.scroll-container');
    filterContainer.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
    console.log('Navigating to more filters...');
}

// Legacy function for backward compatibility
function generateCategorySection(sectionId = 'shopByCategory', title = 'Shop by category', useImages = true, itemsPerRow = 6) {
    if (sectionId === 'shopByCategory') {
        return generateEnhancedCategorySection();
    }
    
    // Keep the old functionality for other sections
    const categories = CATEGORY_DATA[sectionId] || [];
    const colClass = itemsPerRow === 6 ? 'col-lg-2 col-md-4 col-6' : 'col-lg-3 col-md-4 col-6';
    
    const categoryCards = categories.map(category => {
        const imageOrIcon = useImages && category.image ? 
            `<img src="${category.image}" alt="${category.title}" class="category-card__image">` :
            `<div class="category-card__icon-wrapper">
                <i class="${category.icon} category-card__icon"></i>
            </div>`;
        
        return `
            <div class="${colClass} mb-4">
                <div class="category-card">
                    ${imageOrIcon}
                    <h5 class="category-card__title">${category.title}</h5>
                </div>
            </div>
        `;
    }).join('');
    
    const titleHtml = title ? `<h2 class="category-section__title">${title}</h2>` : '';
    
    return `
        <section class="category-section" style="background-color: #F7F8F7; margin: 2rem 0; padding: 2rem 0;">
            <div class="container" style="max-width: 1200px;">
                ${titleHtml}
                <div class="row">
                    ${categoryCards}
                </div>
            </div>
        </section>
    `;
}

// Main rendering functions
function renderProductSections() {
    // Initialize carousels
    const recommendedCarousel = new ProductCarousel(
        'recommendedProducts', 
        'Recommended for you', 
        PRODUCT_DATA.recommended,
        { hasViewAll: true }
    );
    
    const specialsCarousel = new ProductCarousel(
        'specialsProducts', 
        'Specials picked for you', 
        PRODUCT_DATA.specials,
        { hasViewAll: true }
    );
    
    const bestSellersCarousel = new ProductCarousel(
        'bestSellersProducts', 
        'Best sellers', 
        PRODUCT_DATA.bestSellers,
        { hasViewAll: true }
    );
    
    const newArrivalsCarousel = new ProductCarousel(
        'newArrivalsProducts', 
        'New arrivals', 
        PRODUCT_DATA.newArrivals,
        { hasViewAll: true }
    );
    
    const trendingCarousel = new ProductCarousel(
        'trendingProducts', 
        'Trending now', 
        PRODUCT_DATA.trending,
        { hasViewAll: true }
    );
}

function renderCategorySections() {
    // Render only the filter section (Selected for you)
    const categoryContainer = document.getElementById('categorySection');
    if (categoryContainer) {
        categoryContainer.innerHTML = generateEnhancedCategorySection();
    }
    
    // Render Shop by Category section
    const shopByCategoryContainer = document.getElementById('shopByCategorySection');
    if (shopByCategoryContainer) {
        shopByCategoryContainer.innerHTML = generateShopByCategorySection();
    }
}

// CRUD operations for products
function addProduct(sectionType, productData) {
    if (PRODUCT_DATA[sectionType]) {
        PRODUCT_DATA[sectionType].push(productData);
        renderProductSections(); // Re-render
    }
}

function updateProduct(sectionType, productId, newData) {
    if (PRODUCT_DATA[sectionType]) {
        const index = PRODUCT_DATA[sectionType].findIndex(p => p.id === productId);
        if (index !== -1) {
            PRODUCT_DATA[sectionType][index] = { ...PRODUCT_DATA[sectionType][index], ...newData };
            renderProductSections(); // Re-render
        }
    }
}

function removeProduct(sectionType, productId) {
    if (PRODUCT_DATA[sectionType]) {
        PRODUCT_DATA[sectionType] = PRODUCT_DATA[sectionType].filter(p => p.id !== productId);
        renderProductSections(); // Re-render
    }
}

function getProductData(sectionType = null) {
    return sectionType ? PRODUCT_DATA[sectionType] : PRODUCT_DATA;
}

// CRUD operations for categories
function addCategory(sectionType, categoryData) {
    if (CATEGORY_DATA[sectionType]) {
        CATEGORY_DATA[sectionType].push(categoryData);
        renderCategorySections(); // Re-render
    }
}

function updateCategory(sectionType, categoryId, newData) {
    if (CATEGORY_DATA[sectionType]) {
        const index = CATEGORY_DATA[sectionType].findIndex(c => c.id === categoryId);
        if (index !== -1) {
            CATEGORY_DATA[sectionType][index] = { ...CATEGORY_DATA[sectionType][index], ...newData };
            renderCategorySections(); // Re-render
        }
    }
}

function removeCategory(sectionType, categoryId) {
    if (CATEGORY_DATA[sectionType]) {
        CATEGORY_DATA[sectionType] = CATEGORY_DATA[sectionType].filter(c => c.id !== categoryId);
        renderCategorySections(); // Re-render
    }
}

function getCategoryData(sectionType = null) {
    return sectionType ? CATEGORY_DATA[sectionType] : CATEGORY_DATA;
}

// Add to Cart functionality
function addToCart(productId, productTitle) {
    // Find the product in all sections
    let product = null;
    let sectionType = null;
    
    for (const [section, products] of Object.entries(PRODUCT_DATA)) {
        const foundProduct = products.find(p => p.id === productId);
        if (foundProduct) {
            product = foundProduct;
            sectionType = section;
            break;
        }
    }
    
    if (product) {
        // Show a simple notification
        showAddToCartNotification(product);
        
        // Here you can add actual cart logic
        console.log(`Added to cart: ${productTitle} (ID: ${productId})`);
        console.log('Product details:', product);
        
        // Optional: Update cart counter, save to localStorage, etc.
        updateCartCounter();
    }
}

function showAddToCartNotification(product) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle"></i>
            <div>
                <div style="font-weight: 600;">Added to cart!</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateCartCounter() {
    // Simple cart counter update (you can expand this)
    const cartCounters = document.querySelectorAll('.cart-counter');
    cartCounters.forEach(counter => {
        const currentCount = parseInt(counter.textContent) || 0;
        counter.textContent = currentCount + 1;
        
        // Add a small animation
        counter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
    });
}

// Global function to fix arrow visibility
window.fixProductArrows = function() {
    console.log('Fixing product carousel arrows...');
    
    const arrows = document.querySelectorAll('.nav-btn, .product-slider__arrow, .carousel-nav');
    
    arrows.forEach((arrow) => {
        // Basic visibility fixes
        arrow.style.display = 'flex';
        arrow.style.visibility = 'visible';
        arrow.style.opacity = '1';
        arrow.style.zIndex = '1000';
        arrow.style.pointerEvents = 'auto';
        
        // Ensure icon exists
        if (!arrow.innerHTML.trim() || !arrow.querySelector('i')) {
            const isLeft = arrow.classList.contains('prev') || arrow.classList.contains('prev-btn');
            arrow.innerHTML = `<i class="fas fa-chevron-${isLeft ? 'left' : 'right'}"></i>`;
        }
        
        console.log('Fixed arrow:', arrow.className);
    });
    
    console.log(`Fixed ${arrows.length} arrows`);
};

// Auto-fix arrows after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.fixProductArrows();
    }, 1000);
});

// Test function for product carousels
window.testProductCarousels = function() {
    console.log('Testing product carousels...');
    
    // Test all nav buttons
    const arrows = document.querySelectorAll('.nav-btn, .product-slider__arrow');
    console.log(`Found ${arrows.length} arrows`);
    
    arrows.forEach((arrow, index) => {
        console.log(`Arrow ${index}:`, {
            className: arrow.className,
            visible: window.getComputedStyle(arrow).display !== 'none',
            clickable: arrow.style.pointerEvents !== 'none',
            hasClickListener: arrow.onclick !== null || arrow.addEventListener
        });
    });
    
    // Test carousel containers
    const carousels = document.querySelectorAll('.product-carousel, .specials-container');
    console.log(`Found ${carousels.length} carousels`);
    
    carousels.forEach((carousel, index) => {
        const prevBtn = carousel.querySelector('.nav-btn.prev, .prev-btn');
        const nextBtn = carousel.querySelector('.nav-btn.next, .next-btn');
        
        console.log(`Carousel ${index}:`, {
            id: carousel.id,
            hasPrevBtn: !!prevBtn,
            hasNextBtn: !!nextBtn,
            prevBtnVisible: prevBtn ? window.getComputedStyle(prevBtn).display !== 'none' : false,
            nextBtnVisible: nextBtn ? window.getComputedStyle(nextBtn).display !== 'none' : false
        });
    });
    
    return { arrows: arrows.length, carousels: carousels.length };
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProductCarousel,
        PRODUCT_DATA,
        CATEGORY_DATA,
        renderProductSections,
        renderCategorySections,
        addProduct,
        updateProduct,
        removeProduct,
        getProductData,
        addCategory,
        updateCategory,
        removeCategory,
        getCategoryData,
        selectCategory,
        selectFilter,
        navigateFilters,
        addToCart,
        showAddToCartNotification,
        updateCartCounter
    };
}