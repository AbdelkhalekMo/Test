/**
 * Hero Slider Component
 * Handles slide transitions, navigation, and mobile touch interactions
 */

class HeroSlider {
    constructor() {
        this.slider = $('.hero-slider');
        this.slides = $('.hero-slider__slides');
        this.slideItems = $('.hero-slider__slide');
        this.prevBtn = $('.hero-slider__arrow--prev');
        this.nextBtn = $('.hero-slider__arrow--next');
        this.sections = $('.hero-slider__section');
        this.currentSlide = 0;
        this.totalSlides = this.slideItems.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        if (this.slideItems.length === 0) {
            return;
        }
        
        // Ensure initial state is set correctly
        this.slideItems.removeClass('hero-slider__slide--active');
        this.slideItems.eq(0).addClass('hero-slider__slide--active');
        this.sections.removeClass('hero-slider__section--active');
        this.sections.filter('[data-slide="0"]').addClass('hero-slider__section--active');
        
        this.bindEvents();
        this.updateSlidePosition();
        this.addTouchSupport();
        this.addKeyboardSupport();
        this.makeResponsive();
        
        // Start auto-play after a short delay to ensure everything is ready
        setTimeout(() => {
            this.startAutoPlay();
        }, 100);
    }
    
    bindEvents() {
        // Arrow navigation
        this.prevBtn.on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.prevSlide();
        });
        
        this.nextBtn.on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        });
        
        // Section navigation
        this.sections.on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const $section = $(e.currentTarget);
            
            // Handle "SEE ALL" section differently
            if ($section.hasClass('hero-slider__section--see-all')) {
                return;
            }
            
            const slideIndex = parseInt($section.data('slide'));
            
            if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < this.totalSlides) {
                this.goToSlide(slideIndex);
            }
        });
        
        // Pause on hover
        this.slider.on('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.slider.on('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Handle window resize
        $(window).on('resize', () => {
            this.makeResponsive();
            this.updateSlidePosition();
        });
        
        // Pause when page is not visible
        $(document).on('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }
    
    addTouchSupport() {
        // Touch events for mobile swipe
        this.slider.on('touchstart', (e) => {
            this.touchStartX = e.originalEvent.touches[0].clientX;
            this.touchStartY = e.originalEvent.touches[0].clientY;
            this.pauseAutoPlay();
        });
        
        this.slider.on('touchmove', (e) => {
            // Prevent scrolling during horizontal swipe
            const touchX = e.originalEvent.touches[0].clientX;
            const touchY = e.originalEvent.touches[0].clientY;
            const diffX = Math.abs(touchX - this.touchStartX);
            const diffY = Math.abs(touchY - this.touchStartY);
            
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        });
        
        this.slider.on('touchend', (e) => {
            if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length > 0) {
                this.touchEndX = e.originalEvent.changedTouches[0].clientX;
                this.touchEndY = e.originalEvent.changedTouches[0].clientY;
                this.handleSwipe();
            }
            this.startAutoPlay();
        });
        
        // Handle section navigation touch scrolling
        const sectionsContainer = $('.hero-slider__sections');
        if (sectionsContainer.length) {
            sectionsContainer.on('touchstart', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    addKeyboardSupport() {
        // Keyboard navigation
        $(document).on('keydown', (e) => {
            if (!this.slider.is(':visible')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    this.isAutoPlaying() ? this.pauseAutoPlay() : this.startAutoPlay();
                    break;
            }
        });
    }
    
    handleSwipe() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = Math.abs(this.touchStartY - this.touchEndY);
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > this.minSwipeDistance && diffY < 100) {
            if (diffX > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }
    
    makeResponsive() {
        const windowWidth = $(window).width();
        
        // Adjust slider height based on screen size
        if (windowWidth <= 480) {
            this.slider.find('.hero-slider__wrapper').css('height', '200px');
        } else if (windowWidth <= 576) {
            this.slider.find('.hero-slider__wrapper').css('height', '220px');
        } else if (windowWidth <= 768) {
            this.slider.find('.hero-slider__wrapper').css('height', '250px');
        } else if (windowWidth <= 992) {
            this.slider.find('.hero-slider__wrapper').css('height', '300px');
        } else {
            this.slider.find('.hero-slider__wrapper').css('height', '350px');
        }
        
        // Handle section navigation scrolling on mobile
        const sectionsContainer = $('.hero-slider__sections');
        if (windowWidth <= 768 && sectionsContainer.length) {
            // Enable horizontal scrolling on mobile
            sectionsContainer.css({
                'overflow-x': 'auto',
                'overflow-y': 'hidden',
                'scrollbar-width': 'none',
                '-ms-overflow-style': 'none'
            });
            
            // Hide webkit scrollbar
            sectionsContainer.addClass('hide-scrollbar');
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) {
            return;
        }
        
        const prevSlide = this.currentSlide;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prevSlide() {
        if (this.isTransitioning) {
            return;
        }
        
        const prevSlide = this.currentSlide;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) {
            return;
        }
        
        const prevSlide = this.currentSlide;
        this.currentSlide = slideIndex;
        this.updateSlide();
    }
    
    updateSlide() {
        this.isTransitioning = true;
        this.slides.addClass('sliding');
        
        this.updateSlidePosition();
        this.updateSectionStates();
        
        // Remove transition class after animation
        setTimeout(() => {
            this.slides.removeClass('sliding');
            this.isTransitioning = false;
        }, 500);
    }
    
    updateSlidePosition() {
        // Calculate correct transform for 4 slides at 25% width each
        const translateX = -this.currentSlide * 25; // 25% per slide
        this.slides.css('transform', `translateX(${translateX}%)`);
        
        // Update active slide class
        this.slideItems.removeClass('hero-slider__slide--active');
        this.slideItems.eq(this.currentSlide).addClass('hero-slider__slide--active');
    }
    
    updateSectionStates() {
        this.sections.removeClass('hero-slider__section--active');
        const activeSection = this.sections.filter(`[data-slide="${this.currentSlide}"]`);
        activeSection.addClass('hero-slider__section--active');
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        
        if (this.totalSlides > 1) {
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
    
    isAutoPlaying() {
        return this.autoPlayInterval !== null;
    }
    
    // Public methods for external control
    play() {
        this.startAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    // Method to reset auto-play (useful for manual navigation)
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
    
    // Manual test method
    testSlider() {
        console.log('Testing slider positioning...');
        
        // Test slide 0
        this.slides.css('transform', 'translateX(0%)');
        console.log('Set to slide 0 (translateX(0%))');
        
        setTimeout(() => {
            // Test slide 1
            this.slides.css('transform', 'translateX(-25%)');
            console.log('Set to slide 1 (translateX(-25%))');
            
            setTimeout(() => {
                // Test slide 2
                this.slides.css('transform', 'translateX(-50%)');
                console.log('Set to slide 2 (translateX(-50%))');
                
                setTimeout(() => {
                    // Test slide 3
                    this.slides.css('transform', 'translateX(-75%)');
                    console.log('Set to slide 3 (translateX(-75%))');
                    
                    setTimeout(() => {
                        // Back to slide 0
                        this.slides.css('transform', 'translateX(0%)');
                        console.log('Back to slide 0');
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
    
    // Destroy method for cleanup
    destroy() {
        this.pauseAutoPlay();
        this.slider.off();
        $(window).off('resize.heroSlider');
        $(document).off('keydown.heroSlider');
        $(document).off('visibilitychange.heroSlider');
    }
}

// Initialize hero slider when document is ready
$(document).ready(() => {
    if ($('.hero-slider').length > 0) {
        // Create new instance
        window.heroSlider = new HeroSlider();
        console.log('Hero Slider initialized');
        
        // Add global test function for debugging
        window.testHeroSlider = () => {
            if (window.heroSlider) {
                window.heroSlider.testSlider();
            }
        };
    } else {
        console.warn('Hero slider element not found');
    }
});

// Export for use in other files
window.HeroSlider = HeroSlider; 