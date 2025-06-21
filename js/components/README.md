# Dynamic Product Management System

This system provides a clean, maintainable way to manage product data and render product sections dynamically using JavaScript templates.

## Features

- **Data-driven rendering**: All product and category data is centralized in `product-data.js`
- **Template-based HTML generation**: Reusable templates for consistent markup
- **Dynamic content management**: Easy functions to add, update, or remove products and categories
- **Multiple category sections**: Support for main categories and additional bottom sections
- **Image-based categories**: Uses actual category images from assets folder
- **Automatic re-rendering**: Changes trigger automatic page updates
- **BEM methodology**: Consistent CSS class naming throughout
- **Responsive design**: Automatic column adjustments based on number of items

## File Structure

```
js/components/
├── product-data.js          # Main data and template system
├── product-slider.js        # Slider functionality
└── README.md               # This documentation
```

## Usage

### Adding New Products

```javascript
// Add a new product to the recommended section
addProduct('recommended', {
    id: 13,
    title: "New Product Name",
    image: "https://example.com/image.jpg",
    rating: 5,
    reviewCount: 100,
    currentPrice: "EGP99.99",
    originalPrice: "EGP129.99", // optional
    badge: "New" // optional
});
```

### Updating Existing Products

```javascript
// Update product with ID 1 in recommended section
updateProduct('recommended', 1, {
    currentPrice: "EGP139.99",
    badge: "Hot Deal"
});
```

### Removing Products

```javascript
// Remove product with ID 5 from specials section
removeProduct('specials', 5);
```

### Getting Product Data

```javascript
// Get all product data
const allData = getProductData();

// Get specific section data
const recommendedProducts = getProductData('recommended');
const specialProducts = getProductData('specials');
```

### Managing Categories

```javascript
// Add a new category to bottom section
addCategory('bottomCategories', {
    id: 18,
    title: "New Category",
    image: "assets/images/shop by categories/Supplements.png",
    icon: "fas fa-star"
});

// Update existing category
updateCategory('shopByCategory', 1, {
    title: "Updated Supplements",
    image: "assets/images/shop by categories/NewImage.png"
});

// Remove category
removeCategory('bottomCategories', 15);

// Get category data
const allCategories = getCategoryData();
const shopCategories = getCategoryData('shopByCategory');
const bottomCategories = getCategoryData('bottomCategories');
```

## Product Data Structure

Each product object should have the following structure:

```javascript
{
    id: 1,                          // Unique identifier
    title: "Product Name",          // Product title
    image: "image-url",            // Product image URL
    rating: 5,                     // Star rating (1-5)
    reviewCount: 100,              // Number of reviews
    currentPrice: "EGP99.99",      // Current price
    originalPrice: "EGP129.99",    // Original price (optional, for sale items)
    badge: "Sale"                  // Badge text (optional)
}
```

## Category Data Structure

Each category object should have:

```javascript
{
    id: 1,                         // Unique identifier
    title: "Category Name",        // Category title
    icon: "fas fa-icon-name"       // Font Awesome icon class
}
```

## Template Functions

The system includes several template functions for generating HTML:

- `generateProductCard(product)` - Creates a single product card
- `generateCategoryCard(category)` - Creates a single category card
- `generateProductSection(id, title, products, hasViewAll)` - Creates a complete product section
- `generateCategorySection()` - Creates the category section
- `generateStarRating(rating, reviewCount)` - Creates star rating HTML
- `generatePriceHtml(current, original)` - Creates price display HTML
- `generateBadgeHtml(badge)` - Creates badge HTML

## Benefits

1. **Maintainability**: All product data is centralized and easy to modify
2. **Consistency**: Templates ensure uniform HTML structure and BEM naming
3. **Performance**: Only renders when needed, no unnecessary DOM manipulation
4. **Scalability**: Easy to add new sections or modify existing ones
5. **Clean Code**: Separation of data, templates, and functionality
6. **Developer Experience**: Simple API for common operations

## Example: Adding a New Section

To add a new product section (e.g., "Featured Products"):

1. Add data to `PRODUCT_DATA`:
```javascript
featured: [
    // ... product objects
]
```

2. Update the render function:
```javascript
function renderProductSections() {
    // ... existing code ...
    const featuredSection = generateProductSection('featured', 'Featured Products', PRODUCT_DATA.featured, true);
    
    sectionsContainer.innerHTML = recommendedSection + specialsSection + featuredSection + categorySection;
    // ... rest of function
}
```

This approach makes the codebase much cleaner and more maintainable compared to having hundreds of lines of repetitive HTML. 