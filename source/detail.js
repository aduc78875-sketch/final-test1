const products = [
    { 
        id: 1, 
        name: "Cà phê Robusta 500g", 
        price: 145000, 
        sold: "12k", 
        img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
        description: "Cà phê Robusta nguyên chất 100%, rang xay tại Việt Nam",
        stock: 50
    },
    { 
        id: 2, 
        name: "Máy pha Espresso", 
        price: 1699000, 
        sold: "532", 
        img: "https://images.unsplash.com/photo-1517701604599-bb29b5aa5023?w=500",
        description: "Máy pha cà phê Espresso chuyên nghiệp",
        stock: 20
    },
    { 
        id: 3, 
        name: "Cà phê Arabica 500g", 
        price: 195000, 
        sold: "8.5k", 
        img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
        description: "Cà phê Arabica cao cấp, hương vị tinh tế",
        stock: 30
    },
    { 
        id: 4, 
        name: "Phin cà phê Inox", 
        price: 85000, 
        sold: "2.1k", 
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
    // Lấy ID từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get("id")) || 1;
    
    // Tìm sản phẩm
    currentProduct = products.find(p => p.id === productId);
    
    // Nếu không tìm thấy, dùng sản phẩm đầu tiên
    if (!currentProduct) {
        currentProduct = products[0];
    }
    
    // Cập nhật UI
    renderProductDetail();
    updateCartBadge();
}

// ===== RENDER THÔNG TIN SẢN PHẨM =====
function renderProductDetail() {
    // Cập nhật tiêu đề trang
    document.title = currentProduct.name + " - 4DreamerCoffee";
    
    // Cập nhật hình ảnh
    const mainImg = document.getElementById("mainImg");
    mainImg.src = currentProduct.img;
    mainImg.alt = currentProduct.name;
    mainImg.onerror = function() {
        this.src = "https://via.placeholder.com/500?text=No+Image";
    };
    
    // Cập nhật tên sản phẩm
    document.getElementById("prodTitle").innerText = currentProduct.name;
    
    // Cập nhật số lượng đã bán
    document.getElementById("soldCount").innerText = currentProduct.sold;
    
    // Tính giá gốc (tăng 20%)
    const originalPrice = Math.round(currentProduct.price * 1.2);
    document.getElementById("oldPrice").innerText = "₫" + originalPrice.toLocaleString("vi-VN");
    
    // Giá hiện tại
    document.getElementById("currPrice").innerText = "₫" + currentProduct.price.toLocaleString("vi-VN");
    
    // Reset số lượng về 1
    buyQty = 1;
    document.getElementById("inputQty").value = buyQty;
}

// ===== THAY ĐỔI SỐ LƯỢNG =====
function changeQty(delta) {
    const newQty = buyQty + delta;
    
    // Kiểm tra giới hạn
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
    // Kiểm tra sản phẩm
    if (!currentProduct) {
        showNotification("Không tìm thấy sản phẩm", "error");
        return;
    }
    
    // Kiểm tra tồn kho
    if (buyQty > currentProduct.stock) {
        showNotification(`Chỉ còn ${currentProduct.stock} sản phẩm trong kho`, "error");
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        // Kiểm tra tổng số lượng
        const totalQty = existingItem.qty + buyQty;
        
        if (totalQty > currentProduct.stock) {
            showNotification(`Tổng số lượng không được vượt quá ${currentProduct.stock}`, "error");
            return;
        }
        
        existingItem.qty += buyQty;
    } else {
        // Thêm sản phẩm mới
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            img: currentProduct.img,
            qty: buyQty
        });
    }
    
    // Lưu giỏ hàng
    localStorage.setItem("myCart", JSON.stringify(cart));
    
    // Cập nhật badge
    updateCartBadge();
    
    if (buyNow) {
        // Nếu mua ngay, chuyển sang trang thanh toán
        localStorage.setItem("checkoutItems", JSON.stringify(cart));
        window.location.href = "../pages/checkout.html";
    } else {
        // Hiển thị toast thành công
        showToast();
        
        // Hiển thị notification
        showNotification(`Đã thêm ${buyQty} sản phẩm vào giỏ hàng`, "success");
        
        // Reset số lượng về 1
        buyQty = 1;
        document.getElementById("inputQty").value = buyQty;
    }
}

// ===== HIỂN thị TOAST =====
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
        
        // Thêm animation khi số lượng thay đổi
        badge.classList.add("bounce");
        setTimeout(() => {
            badge.classList.remove("bounce");
        }, 500);
    }
}

// ===== HIỂN THỊ NOTIFICATION =====
function showNotification(message, type = "info") {
    // Xóa notification cũ
    const oldNotif = document.querySelector(".product-notification");
    if (oldNotif) {
        oldNotif.remove();
    }
    
    // Tạo notification mới
    const notification = document.createElement("div");
    notification.className = "product-notification";
    
    // Icon theo type
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
    
    // Tự động đóng
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    // Đóng khi click X
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

// ===== THÊM CSS ANIMATIONS =====
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
        
        /* Toast styles */
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
        
        /* Responsive */
        @media (max-width: 768px) {
            .product-notification {
                left: 20px !important;
                right: 20px !important;
                top: 80px !important;
                max-width: calc(100% - 40px) !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== KHỞI TẠO =====
document.addEventListener("DOMContentLoaded", function() {
    addStyles();
    loadDetail();
});

// ===== XỬ LÝ NÚT ENTER TRÊN INPUT SỐ LƯỢNG =====
document.addEventListener("DOMContentLoaded", function() {
    const qtyInput = document.getElementById("inputQty");
    
    if (qtyInput) {
        qtyInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                addToCart(false);
            }
        });
    }
});

// ===== THÊM Ô TÌM KIẾM SẢN PHẨM =====
function addSearchBox() {
    // Kiểm tra xem đã có chưa
    if (document.querySelector('.product-search-box')) return;
    
    // Tìm container để thêm
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Tạo search box
    const searchBox = document.createElement('div');
    searchBox.className = 'product-search-box';
    searchBox.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin: 20px 0;
    `;
    
    searchBox.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: center;">
            <div style="flex: 1; position: relative;">
                <input 
                    type="text" 
                    id="detailSearchInput" 
                    placeholder="Tìm kiếm sản phẩm khác..."
                    style="
                        width: 100%;
                        padding: 12px 45px 12px 15px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 15px;
                        transition: all 0.3s ease;
                    "
                />
                <i class="fas fa-search" style="
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    font-size: 16px;
                "></i>
            </div>
            <button 
                onclick="clearSearch()" 
                class="btn-clear-search"
                style="
                    padding: 12px 20px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    color: #6b7280;
                    cursor: pointer;
                    font-weight: 500;
                    display: none;
                "
            >
                <i class="fas fa-times"></i> Xóa
            </button>
        </div>
        <div id="searchResults" style="margin-top: 15px;"></div>
    `;
    
    // Chèn vào sau back button
    const backNav = document.querySelector('.back-nav');
    if (backNav) {
        backNav.after(searchBox);
    } else {
        container.insertBefore(searchBox, container.firstChild);
    }
    
    // Khởi tạo tìm kiếm
    initDetailSearch();
}

// ===== KHỞI TẠO TÌM KIẾM TRONG TRANG DETAIL =====
function initDetailSearch() {
    const searchInput = document.getElementById('detailSearchInput');
    const clearBtn = document.querySelector('.btn-clear-search');
    
    if (!searchInput) return;
    
    // Focus effect
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#8B7355';
        this.style.boxShadow = '0 0 0 3px rgba(139, 115, 85, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#e5e7eb';
        this.style.boxShadow = 'none';
    });
    
    // Tìm kiếm real-time
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        const keyword = this.value.trim();
        
        // Hiển thị/ẩn nút clear
        if (keyword) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performDetailSearch(keyword);
        }, 300);
    });
    
    // Enter để tìm kiếm
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performDetailSearch(this.value.trim());
        }
    });
}

// ===== THỰC HIỆN TÌM KIẾM =====
function performDetailSearch(keyword) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!keyword) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Tìm sản phẩm (loại trừ sản phẩm hiện tại)
    const results = products.filter(p => 
        p.id !== currentProduct.id && 
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Hiển thị kết quả
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #9ca3af;">
                <i class="fas fa-search" style="font-size: 32px; margin-bottom: 10px;"></i>
                <p>Không tìm thấy sản phẩm phù hợp</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        ">
            ${results.slice(0, 6).map(product => `
                <div 
                    class="search-result-card"
                    onclick="goToProduct(${product.id})"
                    style="
                        background: #f9fafb;
                        border-radius: 8px;
                        overflow: hidden;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                    <img 
                        src="${product.img}" 
                        alt="${product.name}"
                        style="
                            width: 100%;
                            height: 150px;
                            object-fit: cover;
                        "
                        onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'"
                    />
                    <div style="padding: 12px;">
                        <div style="
                            font-weight: 500;
                            font-size: 14px;
                            color: #1f2937;
                            margin-bottom: 8px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        ">${product.name}</div>
                        <div style="
                            color: #8B7355;
                            font-weight: 600;
                            font-size: 15px;
                        ">₫${product.price.toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ${results.length > 6 ? `
            <div style="text-align: center; margin-top: 15px;">
                <a href="../pages/shop.html" style="
                    color: #8B7355;
                    text-decoration: none;
                    font-weight: 500;
                ">
                    Xem tất cả ${results.length} kết quả <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        ` : ''}
    `;
}

// ===== CHUYỂN ĐẾN SẢN PHẨM KHÁC =====
function goToProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// ===== XÓA TÌM KIẾM =====
function clearSearch() {
    const searchInput = document.getElementById('detailSearchInput');
    const resultsContainer = document.getElementById('searchResults');
    const clearBtn = document.querySelector('.btn-clear-search');
    
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (clearBtn) clearBtn.style.display = 'none';
}

// ===== HIỂN THỊ SẢN PHẨM LIÊN QUAN =====
function initRelatedProducts() {
    if (!currentProduct) return;
    
    // Tìm sản phẩm cùng danh mục
    const related = products.filter(p => 
        p.id !== currentProduct.id && 
        p.cat === currentProduct.cat
    ).slice(0, 4);
    
    if (related.length === 0) return;
    
    // Tạo section sản phẩm liên quan
    const container = document.querySelector('.container');
    if (!container) return;
    
    const relatedSection = document.createElement('div');
    relatedSection.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-top: 30px;
    `;
    
    relatedSection.innerHTML = `
        <h2 style="
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
        ">Sản phẩm liên quan</h2>
        <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
        ">
            ${related.map(product => `
                <div 
                    class="related-product-card"
                    onclick="goToProduct(${product.id})"
                    style="
                        background: #f9fafb;
                        border-radius: 8px;
                        overflow: hidden;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.1)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                    <img 
                        src="${product.img}" 
                        alt="${product.name}"
                        style="
                            width: 100%;
                            height: 180px;
                            object-fit: cover;
                        "
                        onerror="this.src='https://via.placeholder.com/220x180?text=No+Image'"
                    />
                    <div style="padding: 15px;">
                        <div style="
                            font-weight: 500;
                            font-size: 15px;
                            color: #1f2937;
                            margin-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            min-height: 40px;
                        ">${product.name}</div>
                        <div style="
                            color: #8B7355;
                            font-weight: 600;
                            font-size: 16px;
                            margin-bottom: 10px;
                        ">₫${product.price.toLocaleString('vi-VN')}</div>
                        <button 
                            onclick="event.stopPropagation(); quickAddToCart(${product.id})"
                            style="
                                width: 100%;
                                padding: 8px;
                                background: #8B7355;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 500;
                                font-size: 14px;
                                transition: background 0.3s ease;
                            "
                            onmouseover="this.style.background='#6d5a44'"
                            onmouseout="this.style.background='#8B7355'"
                        >
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.appendChild(relatedSection);
}

// ===== THÊM NHANH VÀO GIỎ HÀNG =====
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