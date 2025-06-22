/**
 * Main JavaScript File
 * Coordinates all components and handles global functionality
 */

$(document).ready(function() {
    
    // Initialize product carousels and category sections
    if (typeof renderProductSections === 'function') {
        renderProductSections();
    }
    
    if (typeof renderCategorySections === 'function') {
        renderCategorySections();
    }
    
    // Initialize enhanced category functionality
    initializeEnhancedCategoryFeatures();
    
    // Initialize Special Brands section
    if (typeof generateSpecialBrandsSection === 'function') {
        generateSpecialBrandsSection();
    }
    
    // Initialize smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        const target = $(this.getAttribute('href'));
        if (target.length) {
            window.animationController.scrollTo(target, 80);
        }
    });
    
    // Add loading states to buttons
    $('.button').on('click', function() {
        const $button = $(this);
        
        if (!$button.hasClass('button--disabled')) {
            $button.addClass('button--loading');
            
            // Remove loading state after 2 seconds (simulate API call)
            setTimeout(() => {
                $button.removeClass('button--loading');
            }, 2000);
        }
    });
    
    // Form validation and submission
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submitButton = $form.find('button[type="submit"]');
        
        // Add loading state
        $submitButton.addClass('button--loading');
        
        // Simulate form submission
        setTimeout(() => {
            $submitButton.removeClass('button--loading');
            showNotification('Form submitted successfully!', 'success');
        }, 1500);
    });
    
    // Notification system
    window.showNotification = function(message, type = 'info') {
        const notification = $(`
            <div class="notification notification--${type}">
                <span class="notification__message">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Show notification
        setTimeout(() => {
            notification.addClass('notification--show');
        }, 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        notification.find('.notification__close').on('click', () => {
            hideNotification(notification);
        });
    };
    
    function hideNotification($notification) {
        $notification.removeClass('notification--show');
        setTimeout(() => {
            $notification.remove();
        }, 300);
    }
    
    // Lazy loading for images
    $('img[data-src]').each(function() {
        const $img = $(this);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(this);
    });
    
    // Search functionality
    $('.search-input').on('input', debounce(function() {
        const query = $(this).val().toLowerCase();
        const $searchResults = $('.search-results');
        
        if (query.length > 2) {
            // Simulate search
            $searchResults.html('<div class="search-loading">Searching...</div>');
            
            setTimeout(() => {
                $searchResults.html(`
                    <div class="search-result">
                        <h4>Search Result for "${query}"</h4>
                        <p>This is a sample search result.</p>
                    </div>
                `);
            }, 500);
        } else {
            $searchResults.empty();
        }
    }, 300));
    
    // Debounce utility function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Tab functionality
    $('.tab-button').on('click', function() {
        const $button = $(this);
        const target = $button.data('tab');
        
        // Update active button
        $button.siblings().removeClass('tab-button--active');
        $button.addClass('tab-button--active');
        
        // Update active content
        $('.tab-content').removeClass('tab-content--active');
        $(target).addClass('tab-content--active');
    });
    
    // Modal functionality
    $('[data-modal]').on('click', function() {
        const modalId = $(this).data('modal');
        const $modal = $(modalId);
        
        $modal.addClass('modal--show');
        $('body').addClass('modal-open');
    });
    
    $('.modal__close, .modal__backdrop').on('click', function() {
        const $modal = $(this).closest('.modal');
        $modal.removeClass('modal--show');
        $('body').removeClass('modal-open');
    });
    
    // Prevent modal close when clicking on modal content
    $('.modal__content').on('click', function(e) {
        e.stopPropagation();
    });
    
    console.log('Main JavaScript initialized successfully!');
});

// Enhanced Category Features Initialization
function initializeEnhancedCategoryFeatures() {
    // Add smooth scrolling to filter section
    setTimeout(() => {
        const filterContainer = document.querySelector('.scroll-container');
        if (filterContainer) {
            let isDown = false;
            let startX;
            let scrollLeft;

            filterContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - filterContainer.offsetLeft;
                scrollLeft = filterContainer.scrollLeft;
            });

            filterContainer.addEventListener('mouseleave', () => {
                isDown = false;
            });

            filterContainer.addEventListener('mouseup', () => {
                isDown = false;
            });

            filterContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - filterContainer.offsetLeft;
                const walk = (x - startX) * 2;
                filterContainer.scrollLeft = scrollLeft - walk;
            });
        }
    }, 100);
}

// Make category functions globally available
window.selectCategory = function(categoryName) {
    if (typeof selectCategory === 'function') {
        selectCategory(categoryName);
    }
};

window.selectFilter = function(element, filterName) {
    if (typeof selectFilter === 'function') {
        selectFilter(element, filterName);
    }
};

window.navigateFilters = function() {
    if (typeof navigateFilters === 'function') {
        navigateFilters();
    }
}; 