/**
 * Header Component JavaScript
 * Handles mobile menu toggle, scroll effects, and touch interactions
 */

class Header {
    constructor() {
        this.header = $('.header');
        this.toggle = $('.header__toggle');
        this.mobileMenu = $('.header__mobile-menu');
        this.mobileMenuContent = $('.header__mobile-menu-content');
        this.mobileLinks = $('.header__mobile-link');
        this.body = $('body');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.toggle.on('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking overlay
        this.mobileMenu.on('click', (e) => {
            if (e.target === this.mobileMenu[0]) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu when clicking close button (pseudo-element)
        this.mobileMenuContent.on('click', (e) => {
            const rect = this.mobileMenuContent[0].getBoundingClientRect();
            const closeButtonArea = {
                left: rect.right - 60,
                right: rect.right - 20,
                top: rect.top + 20,
                bottom: rect.top + 60
            };
            
            if (e.clientX >= closeButtonArea.left && e.clientX <= closeButtonArea.right &&
                e.clientY >= closeButtonArea.top && e.clientY <= closeButtonArea.bottom) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu when clicking on links
        this.mobileLinks.on('click', () => {
            this.closeMobileMenu();
        });
        
        // Handle scroll effects
        $(window).on('scroll', () => {
            this.handleScroll();
        });
        
        // Close mobile menu on window resize
        $(window).on('resize', () => {
            if (window.innerWidth > 992) {
                this.closeMobileMenu();
            }
        });
        
        // Handle escape key
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu.hasClass('header__mobile-menu--open')) {
                this.closeMobileMenu();
            }
        });
        
        // Touch support for mobile menu
        this.addTouchSupport();
    }
    
    toggleMobileMenu() {
        this.toggle.toggleClass('header__toggle--active');
        this.mobileMenu.toggleClass('header__mobile-menu--open');
        
        if (this.mobileMenu.hasClass('header__mobile-menu--open')) {
            this.body.addClass('mobile-menu-open');
            // Focus trap for accessibility
            this.mobileMenuContent.find('input, a, button').first().focus();
        } else {
            this.body.removeClass('mobile-menu-open');
        }
    }
    
    closeMobileMenu() {
        this.toggle.removeClass('header__toggle--active');
        this.mobileMenu.removeClass('header__mobile-menu--open');
        this.body.removeClass('mobile-menu-open');
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let isMenuOpen = false;
        
        // Touch start
        $(document).on('touchstart', (e) => {
            startX = e.originalEvent.touches[0].clientX;
            startY = e.originalEvent.touches[0].clientY;
            isMenuOpen = this.mobileMenu.hasClass('header__mobile-menu--open');
        });
        
        // Touch end - swipe gestures
        $(document).on('touchend', (e) => {
            if (!e.originalEvent.changedTouches) return;
            
            const endX = e.originalEvent.changedTouches[0].clientX;
            const endY = e.originalEvent.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            // Horizontal swipe detection
            if (Math.abs(diffX) > 50 && diffY < 100) {
                if (diffX > 0 && isMenuOpen) {
                    // Swipe left to close menu
                    this.closeMobileMenu();
                } else if (diffX < 0 && !isMenuOpen && startX > window.innerWidth - 50) {
                    // Swipe right from edge to open menu
                    this.toggleMobileMenu();
                }
            }
        });
    }
    
    handleScroll() {
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 50) {
            this.header.addClass('header--scrolled');
        } else {
            this.header.removeClass('header--scrolled');
        }
    }
    
    // Method to programmatically set active state
    setActiveLink(href) {
        this.mobileLinks.removeClass('header__mobile-link--active');
        $(`.header__mobile-link[href="${href}"]`).addClass('header__mobile-link--active');
    }
}

// Initialize header when document is ready
$(document).ready(() => {
    window.headerComponent = new Header();
}); 