/**
 * Reusable Product Carousel Component
 * A flexible carousel that can be used for different product sections
 */

class ReusableProductCarousel {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.title = config.title || 'Products';
        this.products = config.products || [];
        this.backgroundColor = config.backgroundColor || '#f8f9fa';
        this.productsPerPage = config.productsPerPage || 6;
        this.currentStartIndex = 0;
        this.isSliding = false;
        this.autoSlideInterval = null;
        this.config = config;
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        this.startAutoSlide();
    }
    
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Create the carousel section with background
        const carouselHTML = `
            <div class="carousel-section" style="background-color: ${this.backgroundColor}; padding: 40px 0; width: 100%; margin: 20px 0;">
                <div class="carousel-container" style="max-width: 1200px; margin: 0 auto; position: relative; padding: 0 20px;">
                    <h3 class="mb-4" style="text-align: center; font-size: 28px; font-weight: 700; color: #333; margin-bottom: 30px;">${this.title}</h3>
                    <div class="carousel-content" style="display: flex; align-items: center; justify-content: space-between;">
                        <div class="carousel-arrow carousel-arrow-prev" style="background: linear-gradient(135deg, #6DB33F 0%, #2C7500 100%); border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50; box-shadow: 0 4px 15px rgba(109, 179, 63, 0.3);">
                            <i class="fas fa-chevron-left" style="font-size: 18px; color: white;"></i>
                        </div>
                        
                        <div class="products-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; flex: 1; margin: 0 20px; overflow: hidden; transition: all 0.5s ease-in-out;">
                            <!-- Products will be dynamically inserted here -->
                        </div>
                        
                        <div class="carousel-arrow carousel-arrow-next" style="background: linear-gradient(135deg, #6DB33F 0%, #2C7500 100%); border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50; box-shadow: 0 4px 15px rgba(109, 179, 63, 0.3);">
                            <i class="fas fa-chevron-right" style="font-size: 18px; color: white;"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = carouselHTML;
        this.updateProductsContent();
    }
    
    updateProductsContent() {
        const grid = this.getProductsGrid();
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (let i = 0; i < this.productsPerPage; i++) {
            const productIndex = (this.currentStartIndex + i) % this.products.length;
            const product = this.products[productIndex];
            
            const productCard = `
                <div class="product-card" style="background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; cursor: pointer; border: 1px solid rgba(0,0,0,0.04); overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6DB33F, #2C7500); transform: scaleX(0); transition: transform 0.3s ease; transform-origin: left;"></div>
                    <img src="${product.image}" alt="${product.title}" class="product-image" style="width: 120px; height: 100px; object-fit: contain; margin-bottom: 15px; border-radius: 8px; transition: transform 0.3s ease;">
                    <div class="product-title" style="font-size: 12px; color: #333; line-height: 1.3; margin-bottom: 20px; height: 50px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; font-weight: 500;">${this.truncateTitle(product.title)}</div>
                    <div class="product-rating" style="margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 3px;">
                        <div class="stars" style="color: #ffc107; font-size: 10px;">${this.generateStars(product.rating)}</div>
                        <span style="color: #666; font-size: 8px;">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price" style="font-weight: 700; color: #2C7500; font-size: 12px; margin-bottom: 15px;">${product.price}</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}" style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6DB33F 0%, #2C7500 100%); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; opacity: 0; visibility: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">Add to Cart</button>
                </div>
            `;
            
            grid.insertAdjacentHTML('beforeend', productCard);
        }
        
        // Add hover effects
        this.addHoverEffects();
        
        // Apply responsive font sizes immediately
        this.handleResize();
    }
    
    addHoverEffects() {
        const cards = this.getProductsGrid().querySelectorAll('.product-card');
        cards.forEach(card => {
            const topBar = card.querySelector('div[style*="scaleX(0)"]');
            const image = card.querySelector('.product-image');
            const button = card.querySelector('.add-to-cart-btn');
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                if (topBar) topBar.style.transform = 'scaleX(1)';
                if (image) image.style.transform = 'scale(1.05)';
                if (button) {
                    button.style.opacity = '1';
                    button.style.visibility = 'visible';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                if (topBar) topBar.style.transform = 'scaleX(0)';
                if (image) image.style.transform = 'scale(1)';
                if (button) {
                    button.style.opacity = '0';
                    button.style.visibility = 'hidden';
                }
            });
        });
        
        // Add arrow hover effects
        const arrows = document.querySelectorAll(`#${this.containerId} .carousel-arrow`);
        arrows.forEach(arrow => {
            arrow.addEventListener('mouseenter', () => {
                arrow.style.transform = 'scale(1.1)';
                arrow.style.boxShadow = '0 6px 20px rgba(109, 179, 63, 0.4)';
            });
            
            arrow.addEventListener('mouseleave', () => {
                arrow.style.transform = 'scale(1)';
                arrow.style.boxShadow = '0 4px 15px rgba(109, 179, 63, 0.3)';
            });
        });
    }
    
    bindEvents() {
        const prevBtn = document.querySelector(`#${this.containerId} .carousel-arrow-prev`);
        const nextBtn = document.querySelector(`#${this.containerId} .carousel-arrow-next`);
        const container = document.getElementById(this.containerId);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.slideNext());
        }
        
        // Add to cart functionality
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                const product = this.products.find(p => p.id == productId);
                if (product) {
                    this.addToCart(product);
                }
            }
        });
        
        // Pause auto slide on hover
        container.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        container.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
        
        // Responsive grid updates
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        const grid = this.getProductsGrid();
        if (!grid) return;
        
        const width = window.innerWidth;
        let columns = 6;
        
        if (width <= 480) {
            columns = 1;
            // Update font sizes for very small screens
            this.updateMobileFontSizes('small');
        } else if (width <= 768) {
            columns = 2;
            // Update font sizes for mobile
            this.updateMobileFontSizes('medium');
        } else if (width <= 1200) {
            columns = 4;
            // Reset to default font sizes
            this.updateMobileFontSizes('large');
        } else {
            // Reset to default font sizes
            this.updateMobileFontSizes('default');
        }
        
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        const container = document.querySelector(`#${this.containerId} .carousel-container`);
        if (container) {
            if (width <= 768) {
                container.style.padding = '0 15px';
            } else {
                container.style.padding = '0 20px';
            }
        }
    }
    
    updateMobileFontSizes(size) {
        const cards = this.getProductsGrid().querySelectorAll('.product-card');
        cards.forEach(card => {
            const title = card.querySelector('.product-title');
            const rating = card.querySelector('.product-rating');
            const price = card.querySelector('.product-price');
            const stars = card.querySelector('.stars');
            const reviewCount = card.querySelector('.product-rating span');
            
            if (size === 'small') {
                if (title) {
                    title.style.fontSize = '10px';
                    title.style.height = '45px';
                    title.style.marginBottom = '16px';

                }
                if (stars) stars.style.fontSize = '8px';
                if (reviewCount) reviewCount.style.fontSize = '6px';
                if (price) price.style.fontSize = '10px';
                if (rating) rating.style.marginBottom = '12px';
            } else if (size === 'medium') {
                if (title) {
                    title.style.fontSize = '11px';
                    title.style.height = '48px';
                    title.style.marginBottom = '18px';
                }
                if (stars) stars.style.fontSize = '9px';
                if (reviewCount) reviewCount.style.fontSize = '7px';
                if (price) price.style.fontSize = '11px';
                if (rating) rating.style.marginBottom = '14px';
            } else if (size === 'large') {
                if (title) {
                    title.style.fontSize = '12px';
                    title.style.height = '50px';
                    title.style.marginBottom = '20px';
                }
                if (stars) stars.style.fontSize = '10px';
                if (reviewCount) reviewCount.style.fontSize = '8px';
                if (price) price.style.fontSize = '12px';
                if (rating) rating.style.marginBottom = '15px';
            } else {
                // Default sizes
                if (title) {
                    title.style.fontSize = '12px';
                    title.style.height = '50px';
                    title.style.marginBottom = '20px';
                }
                if (stars) stars.style.fontSize = '10px';
                if (reviewCount) reviewCount.style.fontSize = '8px';
                if (price) price.style.fontSize = '12px';
                if (rating) rating.style.marginBottom = '15px';
            }
        });
    }
    
    slideNext() {
        if (this.isSliding) return;
        this.currentStartIndex = (this.currentStartIndex + 1) % this.products.length;
        this.renderProducts(true);
        this.resetAutoSlide();
    }
    
    slidePrev() {
        if (this.isSliding) return;
        this.currentStartIndex = (this.currentStartIndex - 1 + this.products.length) % this.products.length;
        this.renderProducts(true);
        this.resetAutoSlide();
    }
    
    renderProducts(animate = false) {
        if (this.isSliding) return;
        
        const grid = this.getProductsGrid();
        if (!grid) return;
        
        if (animate) {
            this.isSliding = true;
            grid.style.opacity = '0.7';
            
            setTimeout(() => {
                this.updateProductsContent();
                grid.style.opacity = '1';
                
                setTimeout(() => {
                    this.isSliding = false;
                }, 100);
            }, 200);
        } else {
            this.updateProductsContent();
        }
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.slideNext();
        }, 4000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    getProductsGrid() {
        return document.querySelector(`#${this.containerId} .products-grid`);
    }
    
    truncateTitle(title) {
        return title.length > 45 ? title.substring(0, 45) + '...' : title;
    }
    
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    addToCart(product) {
        // Simple notification for now
        alert(`Added "${product.title}" to cart!`);
        
        // You can extend this to integrate with a real cart system
        console.log('Product added to cart:', product);
    }
    
    // Method to update products dynamically
    updateProducts(newProducts, newTitle = null) {
        this.products = newProducts;
        if (newTitle) this.title = newTitle;
        this.currentStartIndex = 0;
        this.render();
        this.bindEvents();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReusableProductCarousel;
} 