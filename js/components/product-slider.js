/**
 * Product Slider Component
 * Handles horizontal scrolling of product cards with arrow navigation
 */

class ProductSlider {
    constructor(element) {
        this.slider = element;
        this.track = this.slider.querySelector('.product-slider__track');
        this.slides = this.slider.querySelectorAll('.product-slider__slide');
        this.prevBtn = this.slider.querySelector('.product-slider__arrow--prev');
        this.nextBtn = this.slider.querySelector('.product-slider__arrow--next');
        
        this.currentIndex = 0;
        this.slidesToShow = this.getSlidesToShow();
        this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
        
        this.init();
    }
    
    init() {
        this.updateArrowStates();
        this.bindEvents();
        this.handleResize();
    }
    
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width >= 1200) return 6;
        if (width >= 992) return 5;
        if (width >= 768) return 4;
        if (width >= 576) return 3;
        if (width >= 400) return 2;
        return 1;
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        // Mouse drag support
        let mouseStartX = 0;
        let isMouseDragging = false;
        
        this.track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.track.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            this.track.style.cursor = 'grab';
            
            const endX = e.clientX;
            const diff = mouseStartX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.slidesToShow = this.getSlidesToShow();
            this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateSlider();
        });
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        const slideWidth = 100 / this.slidesToShow;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateArrowStates();
    }
    
    updateArrowStates() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        
        // Update visual states
        if (this.prevBtn.disabled) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }
        
        if (this.nextBtn.disabled) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }
    
    // Auto-play functionality (optional)
    startAutoPlay(interval = 3000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSlider();
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Keyboard navigation
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
        }
    }
}

// Initialize all product sliders when DOM is loaded
function initializeProductSliders() {
    const sliders = document.querySelectorAll('.product-slider');
    
    sliders.forEach(slider => {
        new ProductSlider(slider);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders immediately if they exist
    initializeProductSliders();
    
    // Also initialize after a short delay to catch dynamically generated content
    setTimeout(initializeProductSliders, 100);
    
    // Add keyboard navigation to focused sliders
    document.addEventListener('keydown', function(e) {
        const focusedSlider = document.activeElement.closest('.product-slider');
        if (focusedSlider && focusedSlider.productSlider) {
            focusedSlider.productSlider.handleKeyboard(e);
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductSlider;
} 