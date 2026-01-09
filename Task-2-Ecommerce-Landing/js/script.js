// Product Data
const products = [
    { id: 1, name: 'MacBook Pro M3', category: 'laptops', price: 1299, emoji: '💻', badge: 'New' },
    { id: 2, name: 'Dell XPS 15', category: 'laptops', price: 1099, emoji: '💻', badge: 'Popular' },
    { id: 3, name: 'iPhone 15 Pro', category: 'phones', price: 999, emoji: '📱', badge: 'Trending' },
    { id: 4, name: 'Samsung Galaxy S24', category: 'phones', price: 899, emoji: '📱', badge: 'New' },
    { id: 5, name: 'Sony WH-1000XM5', category: 'audio', price: 349, emoji: '🎧', badge: 'Best Seller' },
    { id: 6, name: 'AirPods Pro', category: 'audio', price: 249, emoji: '🎧', badge: 'Popular' },
    { id: 7, name: 'Magic Keyboard', category: 'accessories', price: 129, emoji: '⌨️', badge: '' },
    { id: 8, name: 'Logitech MX Master', category: 'accessories', price: 99, emoji: '🖱️', badge: '' }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    setupEventListeners();
    console.log('TechStore E-Commerce Landing Page Loaded! 🛍️');
});

// Display Products
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">High-quality ${product.category} for your daily needs</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Add to Cart
function addToCart(e) {
    const button = e.target;
    const productId = button.dataset.id;
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Item added to cart!');
    
    // Button animation
    button.textContent = '✓ Added!';
    button.style.background = '#10b981';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.background = '';
    }, 1000);
}

// Update Cart Display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">×</button>
            </div>
        `).join('');

        // Add remove event listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', removeFromCart);
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(e) {
    const productId = e.target.dataset.id;
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart');
}

// Toggle Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart toggle
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Display filtered products
            const category = this.dataset.category;
            displayProducts(category);
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Newsletter form
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    // Add to cart for deal items
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Newsletter Form Validation
function handleNewsletterSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('subscriberName');
    const emailInput = document.getElementById('subscriberEmail');
    const errorMessages = document.querySelectorAll('.newsletter-error');
    const successMessage = document.getElementById('newsletterSuccess');

    let isValid = true;

    // Hide all errors
    errorMessages.forEach(msg => msg.classList.add('hidden'));
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');

    // Validate name
    if (nameInput.value.trim() === '') {
        showFieldError(nameInput, 'Please enter your name');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        showFieldError(emailInput, 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    // If valid, show success
    if (isValid) {
        console.log('Newsletter Subscription:', {
            name: nameInput.value.trim(),
            email: emailInput.value.trim()
        });

        successMessage.classList.remove('hidden');
        newsletterForm.reset();

        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
}

// Show Field Error
function showFieldError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    input.classList.add('error');

    input.addEventListener('input', function clearError() {
        errorElement.classList.add('hidden');
        input.classList.remove('error');
        input.removeEventListener('input', clearError);
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.style.animation = 'slideDown 0.5s ease-out';
    notification.textContent = message;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Active Navigation Link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'font-bold');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('text-blue-600', 'font-bold');
        }
    });
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);