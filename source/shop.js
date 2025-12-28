const products = [
    { 
        id: 1, 
        name: "Cà phê Robusta 500g", 
        price: 145000, 
        sold: "12k", 
        cat: "hat",
        img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
        description: "Cà phê Robusta nguyên chất 100%, rang xay tại Việt Nam",
        stock: 50
    },
    { 
        id: 2, 
        name: "Máy pha Espresso", 
        price: 1699000, 
        sold: "532",
        cat: "may", 
        img: "https://images.unsplash.com/photo-1517701604599-bb29b5aa5023?w=500",
        description: "Máy pha cà phê Espresso chuyên nghiệp",
        stock: 20
    },
    { 
        id: 3, 
        name: "Cà phê Arabica 500g", 
        price: 195000, 
        sold: "8.5k",
        cat: "hat", 
        img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
        description: "Cà phê Arabica cao cấp, hương vị tinh tế",
        stock: 30
    },
    { 
        id: 4, 
        name: "Phin cà phê Inox", 
        price: 85000, 
        sold: "2.1k",
        cat: "dungcu", 
        img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500",
        description: "Phin cà phê Inox cao cấp, giữ nhiệt tốt",
        stock: 100
    }
];

// ===== BIẾN TOÀN CỤC =====
let currentProduct = null;
let buyQty = 1;

// ===== LOAD THÔNG TIN SẢN PHẨM =====
function loadDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get("id")) || 1;
    
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        currentProduct = products[0];
    }
    
    renderProductDetail();
    updateCartBadge();
}

// ===== RENDER THÔNG TIN SẢN PHẨM =====
function renderProductDetail() {
    document.title = currentProduct.name + " - 4DreamerCoffee";
    
    const mainImg = document.getElementById("mainImg");
    mainImg.src = currentProduct.img;
    mainImg.alt = currentProduct.name;
    mainImg.onerror = function() {
        this.src = "https://via.placeholder.com/500?text=No+Image";
    };
    
    document.getElementById("prodTitle").innerText = currentProduct.name;
    document.getElementById("soldCount").innerText = currentProduct.sold;
    
    const originalPrice = Math.round(currentProduct.price * 1.2);
    document.getElementById("oldPrice").innerText = "₫" + originalPrice.toLocaleString("vi-VN");
    document.getElementById("currPrice").innerText = "₫" + currentProduct.price.toLocaleString("vi-VN");
    
    buyQty = 1;
    document.getElementById("inputQty").value = buyQty;
}

// ===== THAY ĐỔI SỐ LƯỢNG =====
function changeQty(delta) {
    const newQty = buyQty + delta;
    
    if (newQty < 1) {
        showNotification("Số lượng tối thiểu là 1", "warning");
        return;
    }
    
    if (newQty > currentProduct.stock) {
        showNotification(`Chỉ còn ${currentProduct.stock} sản phẩm trong kho`, "warning");
        return;
    }
    
    buyQty = newQty;
    document.getElementById("inputQty").value = buyQty;
}

// ===== THÊM VÀO GIỎ HÀNG =====
function addToCart(buyNow = false) {
    if (!currentProduct) {
        showNotification("Không tìm thấy sản phẩm", "error");
        return;
    }
    
    if (buyQty > currentProduct.stock) {
        showNotification(`Chỉ còn ${currentProduct.stock} sản phẩm trong kho`, "error");
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        const totalQty = existingItem.qty + buyQty;
        
        if (totalQty > currentProduct.stock) {
            showNotification(`Tổng số lượng không được vượt quá ${currentProduct.stock}`, "error");
            return;
        }
        
        existingItem.qty += buyQty;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            img: currentProduct.img,
            qty: buyQty
        });
    }
    
    localStorage.setItem("myCart", JSON.stringify(cart));
    updateCartBadge();
    
    if (buyNow) {
        localStorage.setItem("checkoutItems", JSON.stringify(cart));
        window.location.href = "../pages/checkout.html";
    } else {
        showToast();
        showNotification(`Đã thêm ${buyQty} sản phẩm vào giỏ hàng`, "success");
        
        buyQty = 1;
        document.getElementById("inputQty").value = buyQty;
    }
}

// ===== HIỂN THỊ TOAST =====
function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// ===== CẬP NHẬT BADGE GIỎ HÀNG =====
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    const badge = document.getElementById("cartBadge");
    if (badge) {
        badge.innerText = totalItems;
        badge.classList.add("bounce");
        setTimeout(() => {
            badge.classList.remove("bounce");
        }, 500);
    }
}

// ===== HIỂN THỊ NOTIFICATION =====
function showNotification(message, type = "info") {
    const oldNotif = document.querySelector(".product-notification");
    if (oldNotif) {
        oldNotif.remove();
    }
    
    const notification = document.createElement("div");
    notification.className = "product-notification";
    
    let icon, bgColor;
    switch(type) {
        case "success":
            icon = "fa-check-circle";
            bgColor = "#10b981";
            break;
        case "error":
            icon = "fa-exclamation-circle";
            bgColor = "#ef4444";
            break;
        case "warning":
            icon = "fa-exclamation-triangle";
            bgColor = "#f59e0b";
            break;
        default:
            icon = "fa-info-circle";
            bgColor = "#3b82f6";
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <i class="fas fa-times" style="cursor: pointer; opacity: 0.8; font-size: 16px;"></i>
    `;
    
    document.body.appendChild(notification);
    
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    notification.querySelector(".fa-times").addEventListener("click", () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

// ===== ĐÓNG NOTIFICATION =====
function closeNotification(notification) {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== KHỞI TẠO ICON TÌM KIẾM TRONG HEADER =====
function initSearchIcon() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const cartIcon = headerActions.querySelector('.cart-icon-header');
    if (!cartIcon) return;
    
    // Tạo icon tìm kiếm
    const searchBtn = document.createElement('a');
    searchBtn.href = '#';
    searchBtn.className = 'search-icon-header';
    searchBtn.title = 'Tìm kiếm';
    searchBtn.innerHTML = '<i class="fas fa-search"></i>';
    searchBtn.style.cssText = `
        font-size: 20px;
        color: var(--text-dark);
        margin-right: 15px;
        transition: color 0.3s ease;
    `;
    
    searchBtn.addEventListener('mouseenter', function() {
        this.style.color = 'var(--gold)';
    });
    
    searchBtn.addEventListener('mouseleave', function() {
        this.style.color = 'var(--text-dark)';
    });
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSearchPopup();
    });
    
    cartIcon.parentNode.insertBefore(searchBtn, cartIcon);
}

// ===== KHỞI TẠO ICON GIỎ HÀNG =====
function initCartIcon() {
    const cartIcon = document.querySelector('.cart-icon-header');
    if (!cartIcon) return;
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openCartPopup();
    });
}

// ===== MỞ POPUP TÌM KIẾM =====
function openSearchPopup() {
    const oldPopup = document.querySelector('.search-popup');
    if (oldPopup) {
        oldPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.className = 'search-popup';
    popup.innerHTML = `
        <div class="search-popup-overlay"></div>
        <div class="search-popup-content">
            <div class="search-popup-header">
                <h3><i class="fas fa-search"></i> Tìm kiếm sản phẩm</h3>
                <button class="close-search-popup"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-popup-body">
                <div class="popup-search-box">
                    <input type="text" id="popupSearchInput" placeholder="Nhập tên sản phẩm..." autofocus>
                    <i class="fas fa-search"></i>
                </div>
                <div id="popupSearchResults"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    popup.querySelector('.close-search-popup').addEventListener('click', closeSearchPopup);
    popup.querySelector('.search-popup-overlay').addEventListener('click', closeSearchPopup);
    
    const popupInput = document.getElementById('popupSearchInput');
    let searchTimeout;
    
    popupInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performPopupSearch(this.value.trim());
        }, 300);
    });
    
    popupInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performPopupSearch(this.value.trim());
        }
    });
    
    popupInput.focus();
}

// ===== ĐÓNG POPUP TÌM KIẾM =====
function closeSearchPopup() {
    const popup = document.querySelector('.search-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// ===== TÌM KIẾM TRONG POPUP =====
function performPopupSearch(keyword) {
    const resultsDiv = document.getElementById('popupSearchResults');
    
    if (!keyword) {
        resultsDiv.innerHTML = `
            <div class="popup-search-empty">
                <i class="fas fa-search"></i>
                <p>Nhập từ khóa để tìm kiếm sản phẩm</p>
            </div>
        `;
        return;
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="popup-search-empty">
                <i class="fas fa-search"></i>
                <p>Không tìm thấy sản phẩm "${keyword}"</p>
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = `
        <div class="popup-search-header">Tìm thấy ${results.length} sản phẩm</div>
        <div class="popup-search-list">
            ${results.map(product => `
                <div class="popup-search-item" onclick="goToProduct(${product.id})">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
                    <div class="popup-search-item-info">
                        <div class="popup-search-item-name">${highlightKeyword(product.name, keyword)}</div>
                        <div class="popup-search-item-price">₫${product.price.toLocaleString('vi-VN')}</div>
                        <div class="popup-search-item-sold">Đã bán ${product.sold}</div>
                    </div>
                    <button class="popup-search-item-add" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== HIGHLIGHT TỪ KHÓA =====
function highlightKeyword(text, keyword) {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + keyword.length);
    const after = text.substring(index + keyword.length);
    
    return `${before}<mark style="background: #ffd700; padding: 2px 4px; border-radius: 3px;">${match}</mark>${after}`;
}

// ===== CHUYỂN ĐẾN SẢN PHẨM KHÁC =====
function goToProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// ===== THÊM NHANH VÀO GIỎ =====
function quickAddToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            qty: 1
        });
    }
    
    localStorage.setItem("myCart", JSON.stringify(cart));
    updateCartBadge();
    showToast();
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
}

// ===== MỞ POPUP GIỎ HÀNG =====
function openCartPopup() {
    const oldPopup = document.querySelector('.cart-popup');
    if (oldPopup) {
        oldPopup.remove();
    }
    
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.innerHTML = `
        <div class="cart-popup-overlay"></div>
        <div class="cart-popup-content">
            <div class="cart-popup-header">
                <h3><i class="fas fa-shopping-bag"></i> Giỏ hàng của bạn</h3>
                <button class="close-cart-popup"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-popup-body">
                ${cart.length === 0 ? `
                    <div class="cart-popup-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Giỏ hàng trống</p>
                        <button onclick="closeCartPopup(); window.location.href='../pages/shop.html'" class="btn-continue-shopping">
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ` : `
                    <div class="cart-popup-list">
                        ${cart.map(item => `
                            <div class="cart-popup-item">
                                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
                                <div class="cart-popup-item-info">
                                    <div class="cart-popup-item-name">${item.name}</div>
                                    <div class="cart-popup-item-price">₫${item.price.toLocaleString('vi-VN')}</div>
                                    <div class="cart-popup-item-qty">Số lượng: ${item.qty}</div>
                                </div>
                                <button class="cart-popup-item-remove" onclick="removeFromCart(${item.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-popup-footer">
                        <div class="cart-popup-total">
                            <span>Tổng cộng:</span>
                            <span class="cart-popup-total-price">₫${calculateTotal().toLocaleString('vi-VN')}</span>
                        </div>
                        <button onclick="window.location.href='../pages/cart.html'" class="btn-view-cart">
                            Xem giỏ hàng
                        </button>
                        <button onclick="window.location.href='../pages/checkout.html'" class="btn-checkout">
                            Thanh toán
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    popup.querySelector('.close-cart-popup').addEventListener('click', closeCartPopup);
    popup.querySelector('.cart-popup-overlay').addEventListener('click', closeCartPopup);
}

// ===== ĐÓNG POPUP GIỎ HÀNG =====
function closeCartPopup() {
    const popup = document.querySelector('.cart-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// ===== TÍNH TỔNG GIỎ HÀNG =====
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('myCart')) || [];
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ===== XÓA SẢN PHẨM KHỎI GIỎ =====
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('myCart', JSON.stringify(cart));
    
    updateCartBadge();
    closeCartPopup();
    setTimeout(() => {
        openCartPopup();
    }, 100);
    
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
}

// ===== THÊM CSS =====
function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .cart-badge-header.bounce {
            animation: bounce 0.5s ease;
        }
        
        .toast-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 9999;
            text-align: center;
            transition: all 0.3s ease;
            opacity: 0;
        }
        
        .toast-box.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        
        .toast-box i {
            color: #10b981;
        }

        /* POPUP TÌM KIẾM */
        .search-popup, .cart-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .search-popup.show, .cart-popup.show {
            opacity: 1;
            pointer-events: all;
        }

        .search-popup-overlay, .cart-popup-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }

        .search-popup-content, .cart-popup-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .search-popup-header, .cart-popup-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .search-popup-header h3, .cart-popup-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .close-search-popup, .close-cart-popup {
            background: none;
            border: none;
            font-size: 24px;
            color: #6b7280;
            cursor: pointer;
            padding: 5px;
            line-height: 1;
            transition: color 0.3s ease;
        }

        .close-search-popup:hover, .close-cart-popup:hover {
            color: #1f2937;
        }

        .search-popup-body, .cart-popup-body {
            padding: 20px 24px;
            overflow-y: auto;
            flex: 1;
        }

        .popup-search-box {
            position: relative;
            margin-bottom: 20px;
        }

        .popup-search-box input {
            width: 100%;
            padding: 14px 45px 14px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .popup-search-box input:focus {
            outline: none;
            border-color: #8B7355;
            box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .popup-search-box i {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 18px;
        }

        .popup-search-empty {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
        }

        .popup-search-empty i {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .popup-search-empty p {
            font-size: 16px;
            margin: 0;
        }

        .popup-search-header {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
            font-weight: 500;
        }

        .popup-search-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .popup-search-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .popup-search-item:hover {
            background: #f3f4f6;
            transform: translateX(5px);
        }

        .popup-search-item img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 8px;
        }

        .popup-search-item-info {
            flex: 1;
        }

        .popup-search-item-name {
            font-weight: 600;
            font-size: 15px;
            color: #1f2937;
            margin-bottom: 5px;
        }

        .popup-search-item-price {
            font-size: 16px;
            color: #8B7355;
            font-weight: 600;
            margin-bottom: 3px;
        }

        .popup-search-item-sold {
            font-size: 13px;
            color: #9ca3af;
        }

        .popup-search-item-add {
            width: 40px;
            height: 40px;
            border: none;
            background: #8B7355;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .popup-search-item-add:hover {
            background: #6d5a44;
            transform: scale(1.1);
        }

        /* POPUP GIỎ HÀNG */
        .cart-popup-empty {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
        }

        .cart-popup-empty i {
            font-size: 64px;
            margin-bottom: 20px;
            color: #d1d5db;
        }

        .cart-popup-empty p {
            font-size: 18px;
            margin-bottom: 25px;
            color: #6b7280;
        }

        .btn-continue-shopping {
            padding: 12px 30px;
            background: #8B7355;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.3s ease;
        }

        .btn-continue-shopping:hover {
            background: #6d5a44;
            transform: translateY(-2px);
        }

        .cart-popup-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }

        .cart-popup-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 10px;
        }

        .cart-popup-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }

        .cart-popup-item-info {
            flex: 1;
        }

        .cart-popup-item-name {
            font-weight: 600;
            font-size: 15px;
            color: #1f2937;
            margin-bottom: 8px;
        }

        .cart-popup-item-price {
            font-size: 16px;
            color: #8B7355;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .cart-popup-item-qty {
            font-size: 14px;
            color: #6b7280;
        }

        .cart-popup-item-remove {
            width: 40px;
            height: 40px;
            border: none;
            background: #fee2e2;
            color: #ef4444;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .cart-popup-item-remove:hover {
            background: #fecaca;
            transform: scale(1.1);
        }

        .cart-popup-footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        .cart-popup-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 600;
        }

        .cart-popup-total-price {
            color: #8B7355;
            font-size: 22px;
        }

        .btn-view-cart, .btn-checkout {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-view-cart {
            background: white;
            color: #8B7355;
            border: 2px solid #8B7355;
            margin-bottom: 10px;
        }

        .btn-view-cart:hover {
            background: #f9fafb;
        }

        .btn-checkout {
            background: #8B7355;
            color: white;
        }

        .btn-checkout:hover {
            background: #6d5a44;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .product-notification {
                left: 20px !important;
                right: 20px !important;
                top: 80px !important;
                max-width: calc(100% - 40px) !important;
            }

            .search-popup-content, .cart-popup-content {
                width: 95%;
                max-height: 90vh;
            }

            .popup-search-item, .cart-popup-item {
                padding: 10px;
            }

            .popup-search-item img, .cart-popup-item img {
                width: 60px;
                height: 60px;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== KHỞI TẠO =====
document.addEventListener("DOMContentLoaded", function() {
    addStyles();
    loadDetail();
    initSearchIcon();
    initCartIcon();
});