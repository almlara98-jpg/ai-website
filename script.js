// قاعدة بيانات المنتجات
let products = [
    {
        id: 1,
        name: 'أيفون 14 برو',
        price: 4900,
        category: 'الكترونيات',
        description: 'هاتف ذكي متطور بشاشة OLED وكاميرا احترافية',
        icon: '📱'
    },
    {
        id: 2,
        name: 'لاب توب ماك بوك برو',
        price: 3500,
        category: 'الكترونيات',
        description: 'لابتوب بشاشة ريتينا ومعالج M2',
        icon: '💻'
    },
    {
        id: 3,
        name: 'سماعات لاسلكية',
        price: 120,
        category: 'الكترونيات',
        description: 'سماعات بلوتوث مع عزل الضوضاء',
        icon: '🎧'
    },
    {
        id: 4,
        name: 'تيشيرت قطني',
        price: 35,
        category: 'ملابس',
        description: 'تيشيرت قطني 100%، متوفر بألوان متعددة',
        icon: '👕'
    },
    {
        id: 5,
        name: 'بنطلون جينز',
        price: 75,
        category: 'ملابس',
        description: 'بنطلون جينز كلاسيكي، مقاسات متعددة',
        icon: '👖'
    },
    {
        id: 6,
        name: 'طقم صالون',
        price: 2500,
        category: 'منزل',
        description: 'طقم صالون مودرن 3 قطع',
        icon: '🛋️'
    },
    {
        id: 7,
        name: 'طقم صحون',
        price: 32,
        category: 'منزل',
        description: 'طقم صحون',
        icon: '🍽️'
    },
    {
        id: 8,
        name: 'أدوات رياضية',
        price: 50,
        category: 'رياضة',
        description: 'طقم أدوات رياضية كامل',
        icon: '⚽'
    }
];

// سلة التسوق
let cart = [];

// تحميل السلة من localStorage عند بدء التشغيل
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// حفظ السلة في localStorage
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

// عرض المنتجات
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price} د.ل </div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})"> + أضف إلى السلة</button>
                    <button class="view-details" onclick="viewDetails(${product.id})">🔍 تفاصيل</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    saveCart();
    
    // عرض رسالة تأكيد
    showNotification(`تم إضافة ${product.name} إلى السلة`);
}

// عرض تفاصيل المنتج
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`
            ${product.icon} ${product.name}
            السعر: ${product.price} د.ل
            التصنيف: ${product.category}
            الوصف: ${product.description}
        `);
    }
}

// تصفية المنتجات حسب الفئة
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// البحث عن المنتجات
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}

// إظهار إشعار
function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff1515 0%, #6c0b0b 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayProducts();
    
    // إضافة أنماط للـ animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});