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
    const formData = new URLSearchParams();
    formData.append('quantity', quantity);
    formData.append('ajax', '1');

    fetch(`/add_to_cart/${productId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateCartCount();
                showNotification(`Added ${quantity > 1 ? quantity + ' items' : 'item'} to your bag!`);
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
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-wider text-white transform translate-y-4 opacity-0 transition-all duration-300 ${type === 'success' ? 'bg-black' : 'bg-red-600'}`;
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #111827, #000000)';
        toast.style.border = '1px solid rgba(255,255,255,0.15)';
    }

    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle text-green-400 text-sm' : 'fas fa-exclamation-circle text-white text-sm';
    toast.appendChild(icon);

    const span = document.createElement('span');
    span.innerText = message;
    toast.appendChild(span);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 350);
    }, 3200);
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