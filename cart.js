// سلة التسوق
let cart = [];

// تحميل السلة من localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    displayCart();
    updateCartCount();
}

// عرض محتويات السلة
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} د.ل </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">${itemTotal} د.ل </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    updateSummary();
}

// تحديث الكمية
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

// حذف منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    showNotification('تم حذف المنتج من السلة');
}

// تحديث المجموع
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `${subtotal} د.ل`;
    document.getElementById('shipping').textContent = `${shipping} د.ل`;
    document.getElementById('total').textContent = `${total} د.ل`;
}

// إتمام الشراء
function checkout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة! أضف منتجات أولاً');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50;
    
    if (confirm(`إجمالي المشتريات: ${total} د.ل\nهل تريد إتمام عملية الشراء؟`)) {
        // هنا يمكن إضافة كود الدفع الفعلي
        showNotification('شكراً لتسوقك! سيتم التواصل معك قريباً');
        
        // تفريغ السلة
        cart = [];
        saveCart();
        displayCart();
        
        // التوجيه للصفحة الرئيسية بعد ثانيتين
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// حفظ السلة
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// إظهار إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff0b0b 0%, #640505 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// تحميل السلة عند بدء التشغيل
document.addEventListener('DOMContentLoaded', loadCart);