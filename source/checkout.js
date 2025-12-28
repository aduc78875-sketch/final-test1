// Lấy dữ liệu giỏ hàng
let cartItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
let currentTotalMoney = 0;

// Render danh sách đơn hàng
function renderOrder() {
    const box = document.getElementById("orderItems");
    let sub = 0;
    box.innerHTML = "";

    if (cartItems.length === 0) {
        box.innerHTML = "<p style='text-align:center; color:#999; padding:20px;'>Không có sản phẩm trong giỏ hàng</p>";
        // Disable nút submit nếu không có sản phẩm
        document.querySelector(".btn-submit-order").disabled = true;
        return;
    }

    cartItems.forEach(item => {
        const itemTotal = item.price * item.qty;
        sub += itemTotal;
        
        box.innerHTML += `
            <div class="order-item">
                <img src="${item.img}" 
                     alt="${item.name}"
                     onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-qty">Số lượng: ${item.qty}</div>
                </div>
                <div class="item-price">₫${itemTotal.toLocaleString("vi-VN")}</div>
            </div>
        `;
    });

    // Cập nhật tổng tiền
    document.getElementById("countItems").innerText = cartItems.length;
    document.getElementById("subTotal").innerText = "₫" + sub.toLocaleString("vi-VN");
    
    const shippingFee = 30000;
    currentTotalMoney = sub + shippingFee;
    document.getElementById("finalTotal").innerText = "₫" + currentTotalMoney.toLocaleString("vi-VN");
}

// Chọn phương thức thanh toán
function selectPayment(el) {
    document.querySelectorAll(".payment-option").forEach(e => e.classList.remove("active"));
    el.classList.add("active");
    el.querySelector("input").checked = true;
}

// Validate form
function validateForm() {
    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.querySelector('input[placeholder="Địa chỉ chi tiết"]').value.trim();
    
    // Validate tên
    if (!fullname || fullname.length < 2) {
        alert("Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự)");
        document.getElementById("fullname").focus();
        return false;
    }
    
    // Validate số điện thoại (10-11 số, bắt đầu bằng 0)
    const phoneRegex = /^0\d{9,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10-11 số, bắt đầu bằng 0)");
        document.getElementById("phone").focus();
        return false;
    }
    
    // Validate địa chỉ
    if (!address || address.length < 10) {
        alert("Vui lòng nhập địa chỉ chi tiết (tối thiểu 10 ký tự)");
        document.querySelector('input[placeholder="Địa chỉ chi tiết"]').focus();
        return false;
    }
    
    // Kiểm tra giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
        alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.");
        return false;
    }
    
    return true;
}

// Xử lý thanh toán
function handleCheckout(e) {
    e.preventDefault();
    
    // Validate form trước
    if (!validateForm()) {
        return;
    }
    
    // Lấy thông tin khách hàng
    const customerInfo = {
        fullname: document.getElementById("fullname").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.querySelector('input[placeholder="Email (không bắt buộc)"]').value.trim(),
        address: document.querySelector('input[placeholder="Địa chỉ chi tiết"]').value.trim(),
        note: document.querySelector('textarea').value.trim()
    };
    
    // Lấy phương thức thanh toán
    const method = document.querySelector("input[name=payment]:checked").value;
    
    // Lưu thông tin đơn hàng (có thể gửi lên server)
    const orderData = {
        customer: customerInfo,
        items: cartItems,
        subtotal: currentTotalMoney - 30000,
        shippingFee: 30000,
        total: currentTotalMoney,
        paymentMethod: method,
        orderDate: new Date().toISOString()
    };
    
    // Lưu vào localStorage (hoặc gửi API)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Xử lý theo phương thức thanh toán
    if (method === "bank") {
        showQrPopup();
    } else {
        showSuccessPopup();
    }
}

// Hiển thị popup QR
function showQrPopup() {
    document.getElementById("transferAmount").innerText =
        "₫" + currentTotalMoney.toLocaleString("vi-VN");
    document.getElementById("qrModal").classList.remove("hidden");
}

// Đóng popup QR
function closeQrModal() {
    document.getElementById("qrModal").classList.add("hidden");
}

// Hoàn tất chuyển khoản
function finishBankTransfer() {
    closeQrModal();
    showSuccessPopup();
}

// Hiển thị popup thành công
function showSuccessPopup() {
    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    
    // Xóa giỏ hàng
    localStorage.removeItem("checkoutItems");
    
    // Hiển thị thông tin đơn hàng
    document.getElementById("successMsg").innerHTML = `
        <p style="margin: 10px 0;">Cảm ơn <strong>${fullname}</strong>!</p>
        <p style="margin: 10px 0;">Đơn hàng của bạn đang được xử lý</p>
        <p style="margin: 10px 0; color: #666;">Chúng tôi sẽ liên hệ qua số <strong>${phone}</strong></p>
        <p style="margin: 10px 0; color: #666;">Tổng tiền: <strong>₫${currentTotalMoney.toLocaleString("vi-VN")}</strong></p>
    `;
    
    document.getElementById("successModal").classList.remove("hidden");
}

// Format số điện thoại khi nhập
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById("phone");
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Chỉ cho phép nhập số
            this.value = this.value.replace(/[^\d]/g, '');
            
            // Giới hạn 11 số
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
        });
        
        phoneInput.addEventListener('blur', function() {
            // Kiểm tra khi blur ra khỏi input
            const phoneRegex = /^0\d{9,10}$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // Render đơn hàng khi trang load
    renderOrder();
    
    // Nếu không có sản phẩm, hiển thị cảnh báo
    if (cartItems.length === 0) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: center;
        `;
        warning.innerHTML = `
            <p style="margin: 0 0 10px 0; color: #856404;">
                ⚠️ Giỏ hàng của bạn đang trống!
            </p>
            <a href="cart.html" style="color: #007bff; text-decoration: underline;">
                Quay lại giỏ hàng
            </a>
            hoặc
            <a href="shop.html" style="color: #007bff; text-decoration: underline;">
                Tiếp tục mua sắm
            </a>
        `;
        
        const container = document.querySelector('.checkout-wrapper');
        container.insertBefore(warning, container.firstChild);
    }
});