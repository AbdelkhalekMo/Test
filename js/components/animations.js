/**
 * Animation Utilities
 * Handles scroll-triggered animations and other interactive effects
 */

class AnimationController {
    constructor() {
        this.animatedElements = $('.animate-on-scroll');
        this.cards = $('.card');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkAnimations();
    }
    
    bindEvents() {
        $(window).on('scroll', () => {
            this.checkAnimations();
        });
        
        // Card hover effects
        this.cards.on('mouseenter', (e) => {
            $(e.currentTarget).addClass('card--hovered');
        });
        
        this.cards.on('mouseleave', (e) => {
            $(e.currentTarget).removeClass('card--hovered');
        });
    }
    
    checkAnimations() {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        
        this.animatedElements.each((index, element) => {
            const $element = $(element);
            const elementTop = $element.offset().top;
            
            if (elementTop < scrollTop + windowHeight - 100) {
                $element.addClass('animate-fade-in-up');
                $element.removeClass('animate-on-scroll');
            }
        });
    }
    
    // Smooth scroll to element
    scrollTo(target, offset = 0) {
        const $target = $(target);
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top - offset
            }, 800, 'easeInOutQuart');
        }
    }
    
    // Parallax effect
    parallax(element, speed = 0.5) {
        const scrollTop = $(window).scrollTop();
        const translate = scrollTop * speed;
        
        $(element).css({
            transform: `translateY(${translate}px)`
        });
    }
    
    // Counter animation
    animateCounter(element, target, duration = 2000) {
        const $element = $(element);
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            $element.text(Math.floor(current));
            
            if (current >= target) {
                $element.text(target);
                clearInterval(timer);
            }
        }, 16);
    }
}

// Initialize animations when document is ready
$(document).ready(() => {
    window.animationController = new AnimationController();
    
    // Add easing function for smooth scrolling
    $.easing.easeInOutQuart = function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
});

// Product Cards Animation
$(document).ready(function() {
    // Animate product cards on scroll
    function animateProductCards() {
        $('.product-card').each(function() {
            const card = $(this);
            const cardTop = card.offset().top;
            const cardBottom = cardTop + card.outerHeight();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + $(window).height();
            
            if (cardBottom > windowTop && cardTop < windowBottom) {
                if (!card.hasClass('animated')) {
                    card.addClass('animated');
                    card.css({
                        'opacity': '0',
                        'transform': 'translateY(30px)'
                    }).animate({
                        'opacity': '1'
                    }, 600).css('transform', 'translateY(0)');
                }
            }
        });
    }
    
    // Animate category cards on scroll
    function animateCategoryCards() {
        $('.category-card').each(function() {
            const card = $(this);
            const cardTop = card.offset().top;
            const cardBottom = cardTop + card.outerHeight();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + $(window).height();
            
            if (cardBottom > windowTop && cardTop < windowBottom) {
                if (!card.hasClass('animated')) {
                    card.addClass('animated');
                    card.css({
                        'opacity': '0',
                        'transform': 'translateY(30px) scale(0.9)'
                    }).animate({
                        'opacity': '1'
                    }, 600).css('transform', 'translateY(0) scale(1)');
                }
            }
        });
    }
    
    // Product card hover effects
    $('.product-card').hover(
        function() {
            $(this).find('.product-card__img').css('transform', 'scale(1.05)');
        },
        function() {
            $(this).find('.product-card__img').css('transform', 'scale(1)');
        }
    );
    
    // Category card hover effects
    $('.category-card').hover(
        function() {
            $(this).find('.category-card__icon').css('transform', 'scale(1.1)');
        },
        function() {
            $(this).find('.category-card__icon').css('transform', 'scale(1)');
        }
    );
    
    // Rating stars interaction
    $('.rating').each(function() {
        const rating = $(this);
        const stars = rating.find('i');
        
        stars.hover(
            function() {
                const index = $(this).index();
                stars.each(function(i) {
                    if (i <= index) {
                        $(this).removeClass('far').addClass('fas');
                    } else {
                        $(this).removeClass('fas').addClass('far');
                    }
                });
            },
            function() {
                // Reset to original rating
                stars.each(function() {
                    const originalClass = $(this).data('original-class') || 'fas';
                    $(this).removeClass('fas far').addClass(originalClass);
                });
            }
        );
    });
    
    // Initialize animations on scroll
    $(window).on('scroll', function() {
        animateProductCards();
        animateCategoryCards();
    });
    
    // Trigger animations on page load
    animateProductCards();
    animateCategoryCards();
    
    // Lazy loading for product images
    function lazyLoadImages() {
        $('.product-card__img').each(function() {
            const img = $(this);
            const imgTop = img.offset().top;
            const imgBottom = imgTop + img.outerHeight();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + $(window).height();
            
            if (imgBottom > windowTop && imgTop < windowBottom) {
                if (!img.hasClass('loaded')) {
                    img.addClass('loaded');
                    // Add loading animation
                    img.parent().addClass('loading');
                    
                    img.on('load', function() {
                        img.parent().removeClass('loading');
                    });
                }
            }
        });
    }
    
    $(window).on('scroll', lazyLoadImages);
    lazyLoadImages();
}); 