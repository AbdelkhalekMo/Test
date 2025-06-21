/**
 * Sales Bar Component JavaScript
 * Handles active states and timer countdown functionality
 */

class SalesBar {
    constructor() {
        this.salesBarItems = $('.sales-bar__item');
        this.salesBarActionItems = $('.sales-bar__action-item');
        this.timer = $('.sales-bar__timer');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initTimer();
    }
    
    bindEvents() {
        // Handle sales bar item clicks
        this.salesBarItems.on('click', (e) => {
            e.preventDefault();
            this.setActiveItem($(e.currentTarget));
        });
        
        // Handle action item clicks
        this.salesBarActionItems.on('click', (e) => {
            e.preventDefault();
            this.setActiveActionItem($(e.currentTarget));
        });
        
        // Remove active state when clicking outside
        $(document).on('click', (e) => {
            if (!$(e.target).closest('.sales-bar').length) {
                this.clearActiveStates();
            }
        });
    }
    
    setActiveItem(clickedItem) {
        // Remove active class from all items
        this.salesBarItems.removeClass('sales-bar__item--active');
        
        // Add active class to clicked item
        clickedItem.addClass('sales-bar__item--active');
        
        // Trigger custom event
        $(document).trigger('salesbar:itemClicked', [clickedItem]);
    }
    
    setActiveActionItem(clickedItem) {
        // Remove active class from all action items
        this.salesBarActionItems.removeClass('sales-bar__action-item--active');
        
        // Add active class to clicked item
        clickedItem.addClass('sales-bar__action-item--active');
        
        // Trigger custom event
        $(document).trigger('salesbar:actionClicked', [clickedItem]);
    }
    
    clearActiveStates() {
        this.salesBarItems.removeClass('sales-bar__item--active');
        this.salesBarActionItems.removeClass('sales-bar__action-item--active');
    }
    
    initTimer() {
        if (this.timer.length === 0) return;
        
        // Extract initial time from timer text
        const timerText = this.timer.text();
        const match = timerText.match(/(\d+)\s*H\s*(\d+)\s*M/);
        
        if (match) {
            let hours = parseInt(match[1]);
            let minutes = parseInt(match[2]);
            
            this.startCountdown(hours, minutes);
        }
    }
    
    startCountdown(hours, minutes) {
        const updateTimer = () => {
            if (minutes === 0) {
                if (hours === 0) {
                    // Timer expired
                    this.timer.text('EXPIRED');
                    this.timer.parent().addClass('sales-bar__item--expired');
                    return;
                }
                hours--;
                minutes = 59;
            } else {
                minutes--;
            }
            
            // Update timer display
            const hoursStr = hours.toString().padStart(2, '0');
            const minutesStr = minutes.toString().padStart(2, '0');
            this.timer.text(`Ends in: ${hoursStr} H ${minutesStr} M`);
        };
        
        // Update every minute (60000ms)
        const intervalId = setInterval(updateTimer, 60000);
        
        // Store interval ID for cleanup
        this.timerInterval = intervalId;
    }
    
    // Public methods
    highlightItem(selector) {
        const item = $(selector);
        if (item.length) {
            this.setActiveItem(item);
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                this.clearActiveStates();
            }, 3000);
        }
    }
    
    updateTimer(hours, minutes) {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startCountdown(hours, minutes);
    }
    
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.salesBarItems.off();
        this.salesBarActionItems.off();
        $(document).off('click');
    }
}

// Initialize sales bar when document is ready
$(document).ready(() => {
    if ($('.sales-bar').length) {
        window.salesBar = new SalesBar();
    }
});

// Export for use in other files
window.SalesBar = SalesBar; 