/**
 * Special Brands Section Component
 * Enhanced product slider with infinite scroll and brand logos
 */

class SpecialBrandsSlider {
    constructor() {
        this.specialsData = [
            {
                id: 1,
                name: "ECT",
                image: "assets/images/second special picked/ECT.png",
                featured: false
            },
            {
                id: 2,
                name: "GDP",
                image: "assets/images/second special picked/GDP.png",
                featured: true
            },
            {
                id: 3,
                name: "KLS",
                image: "assets/images/second special picked/KLS.png",
                featured: false
            },
            {
                id: 4,
                name: "PEN",
                image: "assets/images/second special picked/PEN.png",
                featured: false
            },
            {
                id: 5,
                name: "LSE",
                image: "assets/images/second special picked/LSE.png",
                featured: true
            },
            {
                id: 6,
                name: "HBP",
                image: "assets/images/second special picked/HBP.png",
                featured: false
            },
            {
                id: 7,
                name: "ARM",
                image: "assets/images/second special picked/ARM.png",
                featured: false
            },
            {
                id: 8,
                name: "PTG",
                image: "assets/images/second special picked/PTG.png",
                featured: false
            },
            {
                id: 9,
                name: "Link 1",
                image: "assets/images/second special picked/Link (1).png",
                featured: true
            },
            {
                id: 10,
                name: "Link 2",
                image: "assets/images/second special picked/Link (2).png",
                featured: false
            }
        ];
        
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.isAnimating = false;
        this.autoScrollInterval = null;
        this.isHovered = false;
        
        this.init();
    }
    
    // Get items per view based on screen size
    getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 992) return 4;
        if (width >= 768) return 3;
        if (width >= 576) return 2;
        return 1;
    }
    
    // Generate HTML for special items
    generateSpecialHTML(item) {
        const featuredBadge = item.featured ? '<div class="featured-badge">Hot!</div>' : '';
        return `
            <div class="special-item" data-id="${item.id}" data-name="${item.name}">
                ${featuredBadge}
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
        `;
    }
    
    // Create infinite loop by duplicating items
    createInfiniteLoop() {
        const wrapper = document.getElementById('specialsWrapper');
        if (!wrapper) return;
        
        wrapper.innerHTML = '';
        
        // Create enough duplicates for smooth infinite scrolling
        const totalItems = this.specialsData.length * 3; // Triple the items
        
        for (let i = 0; i < totalItems; i++) {
            const productIndex = i % this.specialsData.length;
            wrapper.insertAdjacentHTML('beforeend', this.generateSpecialHTML(this.specialsData[productIndex]));
        }
        
        // Start from the middle set to allow infinite scrolling in both directions
        this.currentIndex = this.specialsData.length;
        this.updateSliderPosition(false);
    }
    
    // Update slider position
    updateSliderPosition(animate = true) {
        const wrapper = document.getElementById('specialsWrapper');
        if (!wrapper) return;
        
        const itemWidth = 100 / this.itemsPerView;
        const translateX = -this.currentIndex * itemWidth;
        
        if (animate) {
            wrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            wrapper.style.transition = 'none';
        }
        
        wrapper.style.transform = `translateX(${translateX}%)`;
    }
    
    // Move to next slide
    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentIndex++;
        this.updateSliderPosition();
        
        setTimeout(() => {
            // Reset position if we've reached the end of duplicated items
            if (this.currentIndex >= this.specialsData.length * 2) {
                this.currentIndex = this.specialsData.length;
                this.updateSliderPosition(false);
            }
            this.isAnimating = false;
        }, 500);
    }
    
    // Move to previous slide
    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentIndex--;
        this.updateSliderPosition();
        
        setTimeout(() => {
            // Reset position if we've reached the beginning of duplicated items
            if (this.currentIndex < 0) {
                this.currentIndex = this.specialsData.length - 1;
                this.updateSliderPosition(false);
            }
            this.isAnimating = false;
        }, 500);
    }
    
    // Auto-scroll functionality
    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            if (!this.isHovered && !this.isAnimating) {
                this.nextSlide();
            }
        }, 3000);
    }
    
    stopAutoScroll() {
        clearInterval(this.autoScrollInterval);
    }
    
    // Handle swipe for mobile
    handleSwipe(touchStartX, touchEndX) {
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    // Bind events
    bindEvents() {
        // Navigation button handlers
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const container = document.getElementById('specialsContainer');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Product click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.special-item')) {
                const item = e.target.closest('.special-item');
                const itemName = item.getAttribute('data-name');
                const itemId = item.getAttribute('data-id');
                
                // Add click animation
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
                
                console.log(`Clicked on: ${itemName} (ID: ${itemId})`);
            }
        });
        
        // Mouse hover handlers
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
        
        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (container) {
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                this.stopAutoScroll();
            });
            
            container.addEventListener('touchmove', (e) => {
                // Allow vertical scrolling but prevent horizontal
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStartX);
                const deltaY = Math.abs(touch.clientY - touchStartX);
                
                if (deltaX > deltaY) {
                    e.preventDefault();
                }
            });
            
            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe(touchStartX, touchEndX);
                if (!this.isHovered) {
                    this.startAutoScroll();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() !== 'input') {
                switch(e.keyCode) {
                    case 37: // Left arrow
                        this.prevSlide();
                        break;
                    case 39: // Right arrow
                        this.nextSlide();
                        break;
                }
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            const newItemsPerView = this.getItemsPerView();
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.updateSliderPosition(false);
            }
        });
    }
    
    // Render the section HTML
    render() {
        const container = document.getElementById('specialBrandsSection');
        if (!container) return;
        
        container.innerHTML = `
            <div class="specials-section">
                <div class="slider-container">
                    <div class="section-header">
                        <h2 class="section-title">Special Brands</h2>
                        <p class="section-subtitle">Discover premium brands and exclusive offers</p>
                    </div>
                    
                    <div class="specials-container" id="specialsContainer">
                        <div class="specials-nav-btn prev" id="prevBtn"></div>
                        <div class="specials-nav-btn next" id="nextBtn"></div>
                        
                        <div class="specials-wrapper" id="specialsWrapper">
                            <!-- Items will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Initialize the slider
    init() {
        this.render();
        this.createInfiniteLoop();
        this.bindEvents();
        
        // Add slide-in animation to items
        setTimeout(() => {
            const items = document.querySelectorAll('.special-item');
            items.forEach(item => item.classList.add('slide-in'));
        }, 100);
        
        this.startAutoScroll();
    }
    
    // Public method to reload with new data
    reloadSpecials(newData) {
        if (newData && Array.isArray(newData) && newData.length > 0) {
            this.stopAutoScroll();
            const wrapper = document.getElementById('specialsWrapper');
            if (wrapper) {
                wrapper.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
            }
            
            setTimeout(() => {
                this.specialsData = [...newData];
                this.createInfiniteLoop();
                this.bindEvents();
                this.startAutoScroll();
            }, 1000);
        }
    }
}

// Function to generate Special Brands section
function generateSpecialBrandsSection() {
    return new SpecialBrandsSlider();
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.SpecialBrandsSlider = SpecialBrandsSlider;
    window.generateSpecialBrandsSection = generateSpecialBrandsSection;
} 