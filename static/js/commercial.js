// VELORA Commercial E-Commerce Engine

document.addEventListener('DOMContentLoaded', () => {
    initMiniCartDrawer();
    initCurrencySwitcher();
    initConciergeChat();
    initFlashCountdown();
});

// ----------------------------------------------------
// 1. SLIDE-OUT MINI CART DRAWER
// ----------------------------------------------------
function initMiniCartDrawer() {
    // Intercept clicks on cart icon
    const cartIcons = document.querySelectorAll('#cart-icon, .js-open-cart-drawer');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // If on cart or checkout page, allow normal navigation if desired, or open drawer
            if (window.location.pathname !== '/checkout') {
                e.preventDefault();
                openCartDrawer();
            }
        });
    });

    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeCartDrawer);
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.remove('translate-x-full');
    if (backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = 'hidden';
    refreshCartDrawer();
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.add('translate-x-full');
    if (backdrop) {
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
    }
    document.body.style.overflow = '';
}

function refreshCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    if (!container) return;

    fetch('/api/cart/drawer')
        .then(res => res.json())
        .then(data => {
            // Update header cart count badge
            const cartBadges = document.querySelectorAll('#cart-icon');
            cartBadges.forEach(b => b.setAttribute('data-notify', data.count));

            // Free shipping bar
            const shippingBar = document.getElementById('drawer-shipping-progress');
            const shippingText = document.getElementById('drawer-shipping-text');
            if (shippingBar && shippingText) {
                shippingBar.style.width = `${data.freeShippingProgress}%`;
                if (data.isFreeShipping) {
                    shippingText.innerHTML = '<span class="text-emerald-400 font-black"><i class="fas fa-check-circle mr-1"></i> Complimentary White-Glove Express Courier Unlocked!</span>';
                    shippingBar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-500';
                } else {
                    shippingText.innerHTML = `Add <span class="text-white font-black">${data.freeShippingRemaining}</span> more for <span class="text-amber-300 font-bold">Complimentary Express Courier</span>`;
                    shippingBar.className = 'h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500';
                }
            }

            // Totals
            const subtotalEl = document.getElementById('drawer-subtotal');
            const discountWrap = document.getElementById('drawer-discount-wrap');
            const discountEl = document.getElementById('drawer-discount');
            const promoTag = document.getElementById('drawer-promo-tag');
            const totalEl = document.getElementById('drawer-total');
            const shippingFeeEl = document.getElementById('drawer-shipping-fee');

            if (subtotalEl) subtotalEl.textContent = data.subtotal;
            if (totalEl) totalEl.textContent = data.total;
            if (shippingFeeEl) shippingFeeEl.textContent = data.shippingFee;

            if (discountWrap && discountEl) {
                if (data.promoCode) {
                    discountWrap.classList.remove('hidden');
                    discountEl.textContent = `-${data.discount}`;
                    if (promoTag) promoTag.textContent = data.promoCode;
                } else {
                    discountWrap.classList.add('hidden');
                }
            }

            // Gift wrap checkbox
            const giftCheckbox = document.getElementById('drawer-gift-checkbox');
            const giftWrapFee = document.getElementById('drawer-gift-fee');
            if (giftCheckbox) giftCheckbox.checked = data.giftWrapped;
            if (giftWrapFee) giftWrapFee.textContent = data.giftWrapFee;

            // Render items
            if (data.items.length === 0) {
                container.innerHTML = `
                    <div class="py-16 text-center text-gray-400">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 text-2xl">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <p class="text-sm font-bold text-gray-300 uppercase tracking-widest">Your Shopping Bag Is Empty</p>
                        <p class="text-xs text-gray-500 mt-1">Discover handcrafted luxury garments in our catalog.</p>
                        <a href="/shop" onclick="closeCartDrawer()" class="inline-block mt-6 px-6 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-amber-400 transition-all">Explore Catalog</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = data.items.map(item => `
                <div class="flex items-start space-x-4 py-4 border-b border-gray-800/80 group">
                    <img src="${item.image_url}" alt="${item.name}" class="w-16 h-20 object-cover rounded-xl border border-gray-800 bg-gray-900 flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <h4 class="text-xs font-bold text-white truncate pr-2">${item.name}</h4>
                            <button onclick="drawerRemoveItem('${item.key}')" class="text-gray-500 hover:text-red-400 text-xs transition-colors p-1" title="Remove item">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="flex items-center space-x-2 mt-1 text-[11px] text-gray-400">
                            <span class="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">${item.size}</span>
                            <span class="truncate text-gray-400">${item.color}</span>
                        </div>
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1">
                                <button onclick="drawerUpdateQty('${item.key}', ${item.quantity - 1})" class="text-gray-400 hover:text-white text-xs px-1">-</button>
                                <span class="text-xs font-bold text-white px-1.5">${item.quantity}</span>
                                <button onclick="drawerUpdateQty('${item.key}', ${item.quantity + 1})" class="text-gray-400 hover:text-white text-xs px-1">+</button>
                            </div>
                            <span class="text-xs font-black text-white">${item.itemTotal}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Render cross-sells
            const crossSellsContainer = document.getElementById('drawer-cross-sells');
            if (crossSellsContainer && data.crossSells && data.crossSells.length > 0) {
                crossSellsContainer.innerHTML = data.crossSells.map(cs => `
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/90 border border-gray-800/80 hover:border-gray-700 transition-all">
                        <div class="flex items-center space-x-3 min-w-0">
                            <img src="${cs.image_url}" alt="${cs.name}" class="w-10 h-10 object-cover rounded-lg flex-shrink-0">
                            <div class="min-w-0">
                                <p class="text-[11px] font-bold text-white truncate">${cs.name}</p>
                                <p class="text-[10px] text-gray-400 font-semibold">${cs.price}</p>
                            </div>
                        </div>
                        <button onclick="drawerAddCrossSell(${cs.id})" class="px-3 py-1 bg-white hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider rounded-full transition-all flex-shrink-0">
                            + Add
                        </button>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error fetching cart drawer:', err));
}

function drawerUpdateQty(itemKey, qty) {
    const formData = new URLSearchParams();
    formData.append('quantity', qty);
    formData.append('ajax', '1');

    fetch(`/update_cart/${itemKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(() => refreshCartDrawer())
    .catch(err => console.error(err));
}

function drawerRemoveItem(itemKey) {
    fetch(`/remove_from_cart/${itemKey}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(() => {
        refreshCartDrawer();
        if (typeof showNotification === 'function') {
            showNotification('Item removed from shopping bag');
        }
    })
    .catch(err => console.error(err));
}

function drawerAddCrossSell(productId) {
    const formData = new URLSearchParams();
    formData.append('quantity', '1');
    formData.append('ajax', '1');

    fetch(`/add_to_cart/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(() => {
        refreshCartDrawer();
        if (typeof showNotification === 'function') {
            showNotification('Curated piece added to bag!');
        }
    });
}

function applyDrawerPromo() {
    const input = document.getElementById('drawer-promo-input');
    if (!input || !input.value.trim()) return;

    fetch('/api/cart/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: input.value.trim() })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            refreshCartDrawer();
            if (typeof showNotification === 'function') {
                showNotification(data.message);
            }
            input.value = '';
        } else {
            if (typeof showNotification === 'function') {
                showNotification(data.message, 'error');
            }
        }
    });
}

function removeDrawerPromo() {
    fetch('/api/cart/remove-promo', { method: 'POST' })
        .then(() => {
            refreshCartDrawer();
            if (typeof showNotification === 'function') {
                showNotification('Promo code removed');
            }
        });
}

function toggleDrawerGiftWrap(checkbox) {
    const messageInput = document.getElementById('drawer-gift-message');
    const msg = messageInput ? messageInput.value : '';

    fetch('/api/cart/gift-wrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift_wrapped: checkbox.checked, gift_message: msg })
    })
    .then(res => res.json())
    .then(() => refreshCartDrawer());
}

// ----------------------------------------------------
// 2. CURRENCY SWITCHER
// ----------------------------------------------------
function initCurrencySwitcher() {
    const selectors = document.querySelectorAll('.js-currency-select');
    selectors.forEach(sel => {
        sel.addEventListener('change', (e) => {
            const currency = e.target.value;
            fetch('/api/currency/set', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currency })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                }
            });
        });
    });
}

// Social proof nudges disabled per user request
function dismissSocialProof() {
    const toast = document.getElementById('social-proof-toast');
    if (toast) toast.remove();
}

// ----------------------------------------------------
// 4. LIVE LUXURY CONCIERGE CHAT
// ----------------------------------------------------
function initConciergeChat() {
    const trigger = document.getElementById('concierge-trigger');
    const modal = document.getElementById('concierge-modal');
    const closeBtn = document.getElementById('concierge-close');
    const form = document.getElementById('concierge-form');
    const input = document.getElementById('concierge-input');
    const messages = document.getElementById('concierge-messages');

    if (trigger && modal) {
        trigger.addEventListener('click', () => {
            modal.classList.toggle('hidden');
            if (!modal.classList.contains('hidden') && input) {
                input.focus();
            }
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (form && input && messages) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            // Append user message
            const userMsg = document.createElement('div');
            userMsg.className = 'flex justify-end mb-3';
            userMsg.innerHTML = `
                <div class="bg-amber-400 text-black px-4 py-2.5 rounded-2xl rounded-tr-none text-xs font-medium max-w-[80%] shadow">
                    ${escapeHtml(text)}
                </div>
            `;
            messages.appendChild(userMsg);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            // Send to concierge endpoint
            fetch('/api/concierge/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })
            .then(res => res.json())
            .then(data => {
                const botMsg = document.createElement('div');
                botMsg.className = 'flex justify-start mb-3';
                botMsg.innerHTML = `
                    <div class="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs leading-relaxed max-w-[85%] shadow">
                        <div class="flex items-center space-x-1.5 mb-1 text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                            <i class="fas fa-crown text-[8px]"></i>
                            <span>Atelier Concierge</span>
                        </div>
                        ${data.reply}
                    </div>
                `;
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            });
        });
    }
}

function conciergeQuickAsk(promptText) {
    const input = document.getElementById('concierge-input');
    const form = document.getElementById('concierge-form');
    if (input && form) {
        input.value = promptText;
        form.dispatchEvent(new Event('submit'));
    }
}

// ----------------------------------------------------
// 5. FLASH COUNTDOWN PROMO TICKER
// ----------------------------------------------------
function initFlashCountdown() {
    const countdownEl = document.getElementById('flash-countdown');
    if (!countdownEl) return;

    // 2 days, 14 hours, 32 minutes from current session
    let totalSeconds = 2 * 86400 + 14 * 3600 + 32 * 60 + 45;

    setInterval(() => {
        if (totalSeconds <= 0) return;
        totalSeconds--;

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        countdownEl.textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    }, 1000);
}

// Utility: Escape HTML
function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
}
