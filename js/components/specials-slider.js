// Specials Picked For You Component
class SpecialsSlider {
    constructor() {
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.isTransitioning = false;
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
                name: "LINK 2",
                image: "assets/images/second special picked/Link (2).png",
                featured: false
            },
            {
                id: 6,
                name: "LSE",
                image: "assets/images/second special picked/LSE.png",
                featured: true
            },
            {
                id: 7,
                name: "HBP",
                image: "assets/images/second special picked/HBP.png",
                featured: false
            },
            {
                id: 8,
                name: "ARM",
                image: "assets/images/second special picked/ARM.png",
                featured: false
            },
            {
                id: 9,
                name: "PTG",
                image: "assets/images/second special picked/PTG.png",
                featured: false
            },
            {
                id: 10,
                name: "LINK 1",
                image: "assets/images/second special picked/Link (1).png",
                featured: true
            }
        ];
        
        this.autoScrollInterval = null;
        this.isHovered = false;
        
        this.init();
    }
    
    init() {
        this.renderSpecials();
        this.bindEvents();
        this.startAutoScroll();
        this.handleResize();
    }
    
    getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 10; // Show all 10 items on large screens
        if (width >= 992) return 8;
        if (width >= 768) return 6;
        if (width >= 576) return 4;
        return 3;
    }
    
    createInfiniteLoop() {
        // Create clones for infinite loop
        const cloneCount = this.itemsPerView;
        const frontClones = [];
        const backClones = [];
        
        // Create clones at the end (for going forward)
        for (let i = 0; i < cloneCount; i++) {
            frontClones.push({
                ...this.specialsData[i],
                id: `clone-front-${i}`,
                isClone: true
            });
        }
        
        // Create clones at the beginning (for going backward)
        for (let i = this.specialsData.length - cloneCount; i < this.specialsData.length; i++) {
            backClones.push({
                ...this.specialsData[i],
                id: `clone-back-${i}`,
                isClone: true
            });
        }
        
        return [...backClones, ...this.specialsData, ...frontClones];
    }
    
    generateSpecialHTML(item) {
        const featuredBadge = item.featured ? '<div class="featured-badge">Hot!</div>' : '';
        return `
            <div class="special-item specials-slide-in" data-id="${item.id}" data-name="${item.name}">
                ${featuredBadge}
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
        `;
    }
    
    renderSpecials() {
        const wrapper = document.getElementById('specialsWrapper');
        if (!wrapper) return;
        
        wrapper.innerHTML = '';
        
        // Create infinite loop data
        const infiniteData = this.createInfiniteLoop();
        
        infiniteData.forEach(item => {
            wrapper.insertAdjacentHTML('beforeend', this.generateSpecialHTML(item));
        });
        
        // Set initial position to show original items (skip back clones)
        this.currentIndex = this.itemsPerView;
        this.updatePosition(false);
    }
    
    updatePosition(animate = true) {
        const wrapper = document.getElementById('specialsWrapper');
        if (!wrapper) return;
        
        const itemWidth = wrapper.children[0]?.offsetWidth || 120;
        const gap = 20;
        const totalItemWidth = itemWidth + gap;
        
        if (animate) {
            wrapper.style.transition = 'transform 0.4s ease';
        } else {
            wrapper.style.transition = 'none';
        }
        
        const translateX = -this.currentIndex * totalItemWidth;
        wrapper.style.transform = `translateX(${translateX}px)`;
        
        // Reset transition after animation
        if (animate) {
            setTimeout(() => {
                wrapper.style.transition = 'transform 0.4s ease';
            }, 400);
        }
    }
    
    checkInfiniteLoop() {
        const wrapper = document.getElementById('specialsWrapper');
        if (!wrapper) return;
        
        const totalItems = wrapper.children.length;
        const cloneCount = this.itemsPerView;
        
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
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        this.updatePosition(true);
        this.checkInfiniteLoop();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400);
    }
    
    handleItemClick(event) {
        const item = event.currentTarget;
        const itemName = item.dataset.name;
        const itemId = item.dataset.id;
        
        // Add click animation
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
        
        // Handle the click - replace with your logic
        console.log(`Clicked on: ${itemName} (ID: ${itemId})`);
        
        // Example: redirect or show modal
        // You can add your custom logic here
        // window.location.href = `/special/${itemId}`;
    }
    
    startAutoScroll() {
        if (this.isHovered) return;
        
        this.autoScrollInterval = setInterval(() => {
            if (this.isHovered || this.isTransitioning) return;
            
            this.nextSlide();
        }, 3000);
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
    
    handleSwipe(startX, endX) {
        const minSwipeDistance = 50;
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe left - next
                this.nextSlide();
            } else {
                // Swipe right - previous
                this.prevSlide();
            }
        }
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            const oldItemsPerView = this.itemsPerView;
            this.itemsPerView = this.getItemsPerView();
            
            // Re-render if items per view changed
            if (oldItemsPerView !== this.itemsPerView) {
                this.renderSpecials();
            } else {
                this.updatePosition(false);
            }
        });
    }
    
    bindEvents() {
        // Navigation buttons - Updated to use new modern arrows
        const prevBtn = document.getElementById('specialsPrevBtn');
        const nextBtn = document.getElementById('specialsNextBtn');
        const container = document.getElementById('specialsContainer');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
            
            // Add modern arrow hover effects
            prevBtn.addEventListener('mouseenter', () => {
                prevBtn.style.transform = 'translateY(-50%) scale(1.1)';
                prevBtn.style.boxShadow = '0 6px 20px rgba(109, 179, 63, 0.4)';
            });
            
            prevBtn.addEventListener('mouseleave', () => {
                prevBtn.style.transform = 'translateY(-50%) scale(1)';
                prevBtn.style.boxShadow = '0 4px 15px rgba(109, 179, 63, 0.3)';
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Add modern arrow hover effects
            nextBtn.addEventListener('mouseenter', () => {
                nextBtn.style.transform = 'translateY(-50%) scale(1.1)';
                nextBtn.style.boxShadow = '0 6px 20px rgba(109, 179, 63, 0.4)';
            });
            
            nextBtn.addEventListener('mouseleave', () => {
                nextBtn.style.transform = 'translateY(-50%) scale(1)';
                nextBtn.style.boxShadow = '0 4px 15px rgba(109, 179, 63, 0.3)';
            });
        }
        
        // Item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.special-item')) {
                this.handleItemClick(e);
            }
        });
        
        // Mouse hover
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
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (container) {
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            container.addEventListener('touchmove', (e) => {
                e.preventDefault(); // Prevent scrolling
            });
            
            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe(touchStartX, touchEndX);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.specials-container')) {
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
    }
    
    // Public method to reload data
    reloadSpecials(newData) {
        if (newData && Array.isArray(newData)) {
            this.specialsData = newData;
            this.currentSlide = 0;
            this.renderSpecials();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if specials container exists before initializing
    if (document.getElementById('specialsContainer')) {
        window.specialsSlider = new SpecialsSlider();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpecialsSlider;
} 