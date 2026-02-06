// Theme Management
const colors = [
    { name: 'Accent Blue', value: '#717fe0' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Coral', value: '#ff7f50' },
    { name: 'Gold', value: '#facc15' },
    { name: 'Crimson', value: '#dc2626' },
    { name: 'Purple', value: '#8b5cf6' }
];

let currentColorIndex = 0;

function rotateThemeColor() {
    const root = document.documentElement;
    const color = colors[currentColorIndex];

    // Set global dynamic color variable
    root.style.setProperty('--dynamic-color', color.value);

    // Update elements that need direct style updates if any
    const coloredLogo = document.getElementById('logo-velora');
    if (coloredLogo) {
        coloredLogo.style.color = color.value;
    }

    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

// Cart and Wishlist management
function updateCartCount() {
    fetch('/cart_count')
        .then(response => response.json())
        .then(data => {
            const badge = document.getElementById('cart-icon');
            if (badge) {
                badge.setAttribute('data-notify', data.count);
            }
        });
}

function updateWishlistCount() {
    fetch('/wishlist_count')
        .then(response => response.json())
        .then(data => {
            const badge = document.getElementById('wishlist-icon');
            if (badge) {
                badge.setAttribute('data-notify', data.count);
            }
        });
}

function addToCart(productId, quantity = 1) {
    // Determine the method based on the route requirement (POST)
    fetch(`/add_to_cart/${productId}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateCartCount();
                showNotification('Added to cart!');
            } else {
                showNotification(data.message || 'Error adding to cart', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.reload();
        });
}

function showNotification(message, type = 'success') {
    // Simple alert for now, can be improved to a toast
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl z-[2000] text-sm font-bold animate-fade-in-up ${type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'}`;
    toast.style.backgroundColor = type === 'success' ? 'var(--dynamic-color)' : '#dc2626';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Search Modal
function showSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('invisible', 'opacity-0');
        modal.querySelector('input').focus();
    }
}

function hideSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('invisible', 'opacity-0');
    }
}

// Initial calls
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateWishlistCount();

    // Start color rotation
    setInterval(rotateThemeColor, 5000);
    rotateThemeColor();

    // Search modal toggle
    const searchBtn = document.querySelector('.js-show-modal-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', showSearchModal);
    }
});