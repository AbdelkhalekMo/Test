/**
 * Hero Slider Component
 * Handles slide transitions, navigation, and mobile touch interactions
 */

class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.querySelector('.hero-nav-prev');
        this.nextBtn = document.querySelector('.hero-nav-next');
        this.sectionButtons = document.querySelectorAll('.hero-slider__section[data-slide]');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        // Navigation button event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Section button event listeners
        this.sectionButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-slide and hover events
        this.startAutoSlide();
        this.addHoverEvents();
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Remove active class from all section buttons
        this.sectionButtons.forEach(button => button.classList.remove('hero-slider__section--active'));
        
        // Add active class to current slide and section button
        this.slides[index].classList.add('active');
        if (this.sectionButtons[index]) {
            this.sectionButtons[index].classList.add('hero-slider__section--active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoSlide() {
        this.slideInterval = setInterval(() => this.nextSlide(), 4000);
    }
    
    stopAutoSlide() {
        clearInterval(this.slideInterval);
    }
    
    addHoverEvents() {
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    addTouchSupport() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        if (!sliderContainer) return;
        
        let startX = 0;
        let endX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Prevent default touch behavior to avoid conflicts
        sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    handleSwipe() {
        const threshold = 50; // Minimum distance for a swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left - go to next slide
                this.nextSlide();
            } else {
                // Swiped right - go to previous slide
                this.prevSlide();
            }
        }
    }
}

// Initialize the hero slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});

// Export for use in other files
window.HeroSlider = HeroSlider;