/**
 * Header Component JavaScript
 * Handles mobile menu toggle and scroll effects
 */

class Header {
    constructor() {
        this.header = $('.header');
        this.toggle = $('.header__toggle');
        this.nav = $('.header__nav');
        this.navLinks = $('.header__nav-link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.toggle.on('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on links
        this.navLinks.on('click', () => {
            if (window.innerWidth <= 768) {
                this.closeMobileMenu();
            }
        });
        
        // Handle scroll effects
        $(window).on('scroll', () => {
            this.handleScroll();
        });
        
        // Close mobile menu on window resize
        $(window).on('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.toggle.toggleClass('header__toggle--active');
        this.nav.toggleClass('header__nav--open');
    }
    
    closeMobileMenu() {
        this.toggle.removeClass('header__toggle--active');
        this.nav.removeClass('header__nav--open');
    }
    
    handleScroll() {
        const scrollTop = $(window).scrollTop();
        
        if (scrollTop > 50) {
            this.header.addClass('header--scrolled');
        } else {
            this.header.removeClass('header--scrolled');
        }
    }
    
    setActiveLink(href) {
        this.navLinks.removeClass('header__nav-link--active');
        $(`.header__nav-link[href="${href}"]`).addClass('header__nav-link--active');
    }
}

// Initialize header when document is ready
$(document).ready(() => {
    window.headerComponent = new Header();
}); 