/**
 * Hero Slider Component JavaScript
 * Handles slider functionality, auto-play, navigation, and section indicators
 */

class HeroSlider {
    constructor(selector) {
        this.slider = $(selector);
        this.slides = this.slider.find('.hero-slider__slide');
        this.slidesContainer = this.slider.find('.hero-slider__slides');
        this.sections = this.slider.find('.hero-slider__section');
        this.prevArrow = this.slider.find('.hero-slider__arrow--prev');
        this.nextArrow = this.slider.find('.hero-slider__arrow--next');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.updateSlider();
    }
    
    bindEvents() {
        // Arrow navigation
        this.prevArrow.on('click', () => {
            this.prevSlide();
        });
        
        this.nextArrow.on('click', () => {
            this.nextSlide();
        });
        
        // Section navigation
        this.sections.on('click', (e) => {
            const $section = $(e.currentTarget);
            
            // Handle "SEE ALL" section differently
            if ($section.hasClass('hero-slider__section--see-all')) {
                // You can add custom functionality here for "SEE ALL"
                console.log('See All clicked');
                return;
            }
            
            const slideIndex = parseInt($section.data('slide'));
            if (!isNaN(slideIndex)) {
                this.goToSlide(slideIndex);
            }
        });
        
        // Pause auto-play on hover
        this.slider.on('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.slider.on('mouseleave', () => {
            this.resumeAutoPlay();
        });
        
        // Keyboard navigation
        $(document).on('keydown', (e) => {
            if (this.slider.is(':hover')) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;
        
        this.slider.on('touchstart', (e) => {
            startX = e.originalEvent.touches[0].clientX;
        });
        
        this.slider.on('touchend', (e) => {
            endX = e.originalEvent.changedTouches[0].clientX;
            const swipeDistance = Math.abs(endX - startX);
            
            if (swipeDistance > minSwipeDistance) {
                if (endX < startX) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlider();
            this.resetAutoPlay();
        }
    }
    
    updateSlider() {
        // Add sliding class for smooth transition
        this.slidesContainer.addClass('sliding');
        
        // Calculate transform value
        const translateX = -this.currentSlide * 25; // 25% per slide
        this.slidesContainer.css('transform', `translateX(${translateX}%)`);
        
        // Update active slide
        this.slides.removeClass('hero-slider__slide--active');
        this.slides.eq(this.currentSlide).addClass('hero-slider__slide--active');
        
        // Update active section
        this.sections.removeClass('hero-slider__section--active');
        this.sections.filter(`[data-slide="${this.currentSlide}"]`).addClass('hero-slider__section--active');
        
        // Remove sliding class after transition
        setTimeout(() => {
            this.slidesContainer.removeClass('sliding');
        }, 500);
    }
    
    startAutoPlay() {
        if (this.isAutoPlaying && this.totalSlides > 1) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        this.pauseAutoPlay();
    }
    
    // Public methods
    play() {
        this.isAutoPlaying = true;
        this.startAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    destroy() {
        this.pauseAutoPlay();
        this.slider.off();
        $(document).off('keydown');
    }
}

// Initialize hero slider when document is ready
$(document).ready(() => {
    if ($('.hero-slider').length) {
        window.heroSlider = new HeroSlider('.hero-slider');
    }
});

// Export for use in other files
window.HeroSlider = HeroSlider; 