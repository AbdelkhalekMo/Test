/**
 * Wellness Hub Section JavaScript
 * Handles interactions for wellness articles and hub navigation
 */

// Wellness article data
const WELLNESS_ARTICLES = {
    'castor-oil': {
        title: 'Castor Oil In Your Belly Button: Benefits + Side Effects',
        summary: 'Discover the ancient practice of applying castor oil to your belly button and its potential health benefits.',
        readTime: '5 min read',
        category: 'Natural Remedies'
    },
    'prenatal-supplements': {
        title: 'Prenatal Supplement Safety: What You Should Know',
        summary: 'Essential guide to choosing safe and effective prenatal supplements for expectant mothers.',
        readTime: '7 min read',
        category: 'Pregnancy Health'
    },
    'polyphenols': {
        title: '3 Polyphenols + Their Benefits: Green Tea, Grape Seed, Pine Bark Extract',
        summary: 'Learn about powerful antioxidants and their role in supporting overall health and wellness.',
        readTime: '6 min read',
        category: 'Nutrition'
    },
    'collagen-masks': {
        title: 'Collagen Face Masks: Why This Skincare Staple Has Taken Over Your Feed',
        summary: 'Understanding the science behind collagen masks and their benefits for skin health.',
        readTime: '4 min read',
        category: 'Skincare'
    },
    'beef-organs': {
        title: 'Beef Organ Supplements',
        summary: 'Exploring the nutritional benefits of organ supplements and their role in optimal health.',
        readTime: '8 min read',
        category: 'Supplements'
    },
    'electrolyte-supplements': {
        title: 'Types Of Electrolyte Supplements + Their Benefits',
        summary: 'Complete guide to different types of electrolyte supplements and how they support hydration and performance.',
        readTime: '6 min read',
        category: 'Supplements'
    }
};

// Open wellness article function
function openWellnessArticle(articleId) {
    const article = WELLNESS_ARTICLES[articleId];
    
    if (!article) {
        console.log('Article not found:', articleId);
        return;
    }
    
    // Add click animation
    const clickedCard = event.currentTarget;
    clickedCard.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        clickedCard.style.transform = '';
    }, 150);
    
    // Show article modal or navigate to article page
    showWellnessModal(article);
    
    // Track analytics (if needed)
    console.log('Wellness article opened:', article.title);
}

// Open wellness hub function
function openWellnessHub() {
    // Add click animation
    const clickedCard = event.currentTarget;
    clickedCard.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        clickedCard.style.transform = '';
    }, 150);
    
    // Navigate to wellness hub page or show all articles
    console.log('Wellness Hub opened');
    
    // Could redirect to a dedicated wellness page
    // window.location.href = '/wellness-hub';
    
    // Or show a modal with all wellness topics
    showWellnessHubModal();
}

// Show wellness article modal
function showWellnessModal(article) {
    const modal = document.createElement('div');
    modal.className = 'wellness-modal-overlay';
    modal.innerHTML = `
        <div class="wellness-modal">
            <div class="wellness-modal-header">
                <h2>${article.title}</h2>
                <button class="wellness-modal-close" onclick="closeWellnessModal()">&times;</button>
            </div>
            <div class="wellness-modal-content">
                <div class="wellness-modal-meta">
                    <span class="wellness-category">${article.category}</span>
                    <span class="wellness-read-time">${article.readTime}</span>
                </div>
                <p class="wellness-summary">${article.summary}</p>
                <div class="wellness-modal-actions">
                    <button class="btn-primary" onclick="readFullArticle('${Object.keys(WELLNESS_ARTICLES).find(key => WELLNESS_ARTICLES[key] === article)}')">
                        Read Full Article
                    </button>
                    <button class="btn-secondary" onclick="closeWellnessModal()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#wellness-modal-styles')) {
        addWellnessModalStyles();
    }
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Show wellness hub modal
function showWellnessHubModal() {
    const modal = document.createElement('div');
    modal.className = 'wellness-modal-overlay';
    modal.innerHTML = `
        <div class="wellness-modal wellness-hub-modal">
            <div class="wellness-modal-header">
                <h2>Wellness Hub</h2>
                <button class="wellness-modal-close" onclick="closeWellnessModal()">&times;</button>
            </div>
            <div class="wellness-modal-content">
                <p>Explore our comprehensive collection of wellness articles, health tips, and expert insights.</p>
                <div class="wellness-categories">
                    <div class="wellness-category-item" onclick="filterWellnessCategory('nutrition')">
                        <i class="fas fa-leaf"></i>
                        <span>Nutrition</span>
                    </div>
                    <div class="wellness-category-item" onclick="filterWellnessCategory('supplements')">
                        <i class="fas fa-pills"></i>
                        <span>Supplements</span>
                    </div>
                    <div class="wellness-category-item" onclick="filterWellnessCategory('skincare')">
                        <i class="fas fa-spa"></i>
                        <span>Skincare</span>
                    </div>
                    <div class="wellness-category-item" onclick="filterWellnessCategory('fitness')">
                        <i class="fas fa-dumbbell"></i>
                        <span>Fitness</span>
                    </div>
                </div>
                <div class="wellness-modal-actions">
                    <button class="btn-primary" onclick="exploreAllArticles()">
                        Explore All Articles
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#wellness-modal-styles')) {
        addWellnessModalStyles();
    }
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Close wellness modal
function closeWellnessModal() {
    const modal = document.querySelector('.wellness-modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Read full article function
function readFullArticle(articleId) {
    console.log('Reading full article:', articleId);
    closeWellnessModal();
    
    // Here you would typically navigate to the full article page
    // window.location.href = `/articles/${articleId}`;
    
    // For demo purposes, show a message
    alert('Redirecting to full article... (Demo mode)');
}

// Filter wellness category
function filterWellnessCategory(category) {
    console.log('Filtering wellness category:', category);
    closeWellnessModal();
    
    // Here you would filter articles by category
    // For demo purposes, show a message
    alert(`Showing ${category} articles... (Demo mode)`);
}

// Explore all articles
function exploreAllArticles() {
    console.log('Exploring all wellness articles');
    closeWellnessModal();
    
    // Here you would navigate to the full wellness hub
    // window.location.href = '/wellness-hub/all';
    
    // For demo purposes, show a message
    alert('Exploring all wellness articles... (Demo mode)');
}

// Add modal styles
function addWellnessModalStyles() {
    const styles = document.createElement('style');
    styles.id = 'wellness-modal-styles';
    styles.textContent = `
        .wellness-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .wellness-modal-overlay.show {
            opacity: 1;
        }
        
        .wellness-modal {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .wellness-modal-overlay.show .wellness-modal {
            transform: scale(1);
        }
        
        .wellness-modal-header {
            padding: 20px 20px 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .wellness-modal-header h2 {
            margin: 0;
            font-size: 1.3rem;
            color: #333;
        }
        
        .wellness-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .wellness-modal-content {
            padding: 20px;
        }
        
        .wellness-modal-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .wellness-category {
            background: #6DB33F;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
        }
        
        .wellness-read-time {
            color: #666;
            font-size: 0.9rem;
        }
        
        .wellness-summary {
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .wellness-modal-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .btn-primary, .btn-secondary {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #6DB33F;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5A9A35;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        .wellness-categories {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        
        .wellness-category-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .wellness-category-item:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }
        
        .wellness-category-item i {
            color: #6DB33F;
            font-size: 1.2rem;
        }
        
        @media (max-width: 576px) {
            .wellness-modal {
                width: 95%;
                margin: 10px;
            }
            
            .wellness-categories {
                grid-template-columns: 1fr;
            }
            
            .wellness-modal-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Initialize wellness section interactions
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wellness Hub initialized');
    
    // Add hover effects to wellness cards
    const wellnessCards = document.querySelectorAll('.wellness-card');
    wellnessCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}); 