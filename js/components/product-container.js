// Product Container JavaScript - BEM Structure
$(document).ready(function() {
    // Sample product data
    const products = [
        {
            id: 1,
            image: 'assets/images/yellow-container/12.jpg.png',
            title: 'Jarrow\'s Best GABA 750 mg GUMMIES',
            rating: 4.5,
            ratingCount: '24,714',
            price: 'EGP523.23',
            origin: 'United States'
        },
        {
            id: 2,
            image: 'assets/images/yellow-container/17.jpg.png',
            title: 'Citricidal Grapefruit Seed Extract Liquid',
            rating: 4.0,
            ratingCount: '3,156',
            price: 'EGP202.90',
            origin: 'Japan'
        },
        {
            id: 3,
            image: 'assets/images/yellow-container/24.jpg.png',
            title: 'Weens Multivitamins Soft of Life LIFE',
            rating: 4.8,
            ratingCount: '1,899',
            price: 'EGP593.99',
            origin: 'United States'
        },
        {
            id: 4,
            image: 'assets/images/yellow-container/39.jpg.png',
            title: 'Chlorella Superfood Tablets Supplement',
            rating: 4.2,
            ratingCount: '5,420',
            price: 'EGP312.45',
            origin: 'United States'
        },
        {
            id: 5,
            image: 'assets/images/yellow-container/44.jpg.png',
            title: 'Himalaya LiverCare for Liver Health',
            rating: 4.6,
            ratingCount: '8,932',
            price: 'EGP167.22',
            origin: 'United States'
        },
        {
            id: 6,
            image: 'assets/images/yellow-container/53.jpg.png',
            title: 'Healthfarm Vegan Amino Blend Collagen',
            rating: 4.3,
            ratingCount: '2,156',
            price: 'EGP343.86',
            origin: 'United States'
        },
        {
            id: 7,
            image: 'assets/images/yellow-container/58.jpg.png',
            title: 'Nature\'s Way Rhodiola 250 mg, 60 Capsules',
            rating: 4.4,
            ratingCount: '1,673',
            price: 'EGP584.97',
            origin: 'Japan'
        },

    ];

    let currentPage = 0;
    const itemsPerPage = 8;
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Generate product card HTML
    function generateProductCard(product) {
        return `
            <div class="col">
                <div class="product-card" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-title">${product.title}</div>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <div class="product-price">${product.price}</div>
                </div>
            </div>
        `;
    }
    
    // Generate country label HTML
    function generateCountryLabel(origin) {
        return `
            <div class="col">
                <div class="product-origin">${origin}</div>
            </div>
        `;
    }
    
    // Render products
    function renderProducts() {
        const productGrid = $('#productGrid');
        const countryLabels = $('#countryLabels');
        productGrid.empty();
        countryLabels.empty();
        
        // Show all 8 products in one row
        products.forEach(product => {
            productGrid.append(generateProductCard(product));
            countryLabels.append(generateCountryLabel(product.origin));
        });
    }
    
    // Product card click handler
    $(document).on('click', '.product-card', function() {
        const productId = $(this).data('product-id');
        const product = products.find(p => p.id === productId);
        
        // Add click animation
        $(this).addClass('animate__animated animate__pulse');
        setTimeout(() => {
            $(this).removeClass('animate__animated animate__pulse');
        }, 600);
        
        // Show product details (you can customize this)
        alert(`Clicked on: ${product.title}\nPrice: ${product.price}`);
    });
    
    // Info icon tooltip
    $('.info-icon').hover(
        function() {
            $(this).attr('title', 'Live product updates available');
        }
    );
    
    // Responsive behavior
    function handleResize() {
        const width = $(window).width();
        if (width < 768) {
            // Mobile: show 2 products per row, adjust items per page
            itemsPerPage = 4;
        } else if (width < 992) {
            // Tablet: show 3 products per row
            itemsPerPage = 6;
        } else {
            // Desktop: show 4 products per row
            itemsPerPage = 8;
        }
        
        currentPage = 0; // Reset to first page
        renderProducts();
    }
    
    // Handle window resize
    $(window).resize(handleResize);
    
    // Initialize
    renderProducts();
    
    // Add some interactive effects
    $('.live-badge').click(function() {
        $(this).addClass('animate__animated animate__heartBeat');
        setTimeout(() => {
            $(this).removeClass('animate__animated animate__heartBeat');
        }, 1000);
    });
    
    $('.notification-badge').click(function() {
        alert('You have 8 new notifications!');
    });
    

}); 