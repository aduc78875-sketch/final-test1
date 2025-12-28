// ===== CONTACT FORM HANDLER =====

document.addEventListener('DOMContentLoaded', function() {
    // Lấy form liên hệ chính
    const contactForm = document.querySelector('.main-form');
    
    // Lấy form newsletter ở footer
    const newsletterForm = document.querySelector('.footer-newsletter');
    
    // Xử lý form liên hệ
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Thêm validation real-time cho số điện thoại
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneInput);
            phoneInput.addEventListener('blur', validatePhone);
        }
        
        // Thêm validation cho email
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
        }
    }
    
    // Xử lý form newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

// ===== XỬ LÝ FORM LIÊN HỆ =====
function handleContactSubmit(e) {
    e.preventDefault();
    
    // Lấy dữ liệu form
    const formData = {
        name: e.target.querySelector('input[placeholder="Họ và tên"]').value.trim(),
        phone: e.target.querySelector('input[type="tel"]').value.trim(),
        email: e.target.querySelector('input[type="email"]').value.trim(),
        subject: e.target.querySelector('input[placeholder="Tiêu đề"]').value.trim(),
        message: e.target.querySelector('textarea').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Validate dữ liệu
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Hiển thị loading
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    
    // Giả lập gửi dữ liệu (thực tế sẽ gửi lên server)
    setTimeout(() => {
        // Lưu vào localStorage (hoặc gửi API)
        saveContactMessage(formData);
        
        // Reset form
        e.target.reset();
        
        // Khôi phục nút
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Hiển thị thông báo thành công
        showSuccessMessage('Cảm ơn bạn đã phản hồi, chờ vài phút để nhân viên phản hồi bạn yêu nhé 💕');
        
    }, 1500);
}

// ===== VALIDATE FORM LIÊN HỆ =====
function validateContactForm(data) {
    // Validate tên
    if (!data.name || data.name.length < 2) {
        showErrorMessage('Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự)');
        return false;
    }
    
    // Validate số điện thoại
    const phoneRegex = /^0\d{9,10}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
        showErrorMessage('Vui lòng nhập số điện thoại hợp lệ (10-11 số, bắt đầu bằng 0)');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showErrorMessage('Vui lòng nhập email hợp lệ');
        return false;
    }
    
    // Validate tiêu đề
    if (!data.subject || data.subject.length < 5) {
        showErrorMessage('Vui lòng nhập tiêu đề (tối thiểu 5 ký tự)');
        return false;
    }
    
    // Validate nội dung
    if (!data.message || data.message.length < 10) {
        showErrorMessage('Vui lòng nhập nội dung (tối thiểu 10 ký tự)');
        return false;
    }
    
    return true;
}

// ===== FORMAT SỐ ĐIỆN THOẠI =====
function formatPhoneInput(e) {
    // Chỉ cho phép nhập số
    this.value = this.value.replace(/[^\d]/g, '');
    
    // Giới hạn 11 số
    if (this.value.length > 11) {
        this.value = this.value.slice(0, 11);
    }
}

// ===== VALIDATE SỐ ĐIỆN THOẠI =====
function validatePhone() {
    const phoneRegex = /^0\d{9,10}$/;
    
    if (this.value && !phoneRegex.test(this.value)) {
        this.style.borderColor = '#ff4444';
        this.style.boxShadow = '0 0 5px rgba(255, 68, 68, 0.3)';
        
        // Thêm tooltip lỗi
        showInputError(this, 'Số điện thoại phải có 10-11 số và bắt đầu bằng 0');
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
        removeInputError(this);
    }
}

// ===== VALIDATE EMAIL =====
function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#ff4444';
        this.style.boxShadow = '0 0 5px rgba(255, 68, 68, 0.3)';
        
        showInputError(this, 'Email không hợp lệ');
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
        removeInputError(this);
    }
}

// ===== HIỂN THỊ LỖI INPUT =====
function showInputError(input, message) {
    // Xóa lỗi cũ nếu có
    removeInputError(input);
    
    // Tạo element lỗi
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 13px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    // Thêm vào sau input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

// ===== XÓA LỖI INPUT =====
function removeInputError(input) {
    const errorDiv = input.parentNode.querySelector('.input-error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===== LƯU TIN NHẮN LIÊN HỆ =====
function saveContactMessage(data) {
    // Lấy danh sách tin nhắn hiện có
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // Thêm tin nhắn mới
    messages.push(data);
    
    // Lưu lại
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    console.log('✅ Đã lưu tin nhắn:', data);
}

// ===== XỬ LÝ FORM NEWSLETTER =====
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showErrorMessage('Vui lòng nhập email hợp lệ');
        return;
    }
    
    // Lưu email đăng ký
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    
    // Kiểm tra email đã tồn tại chưa
    if (subscribers.includes(email)) {
        showErrorMessage('Email này đã đăng ký newsletter');
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    
    // Reset form
    emailInput.value = '';
    
    // Hiển thị thông báo
    showSuccessMessage('Đăng ký newsletter thành công! Cảm ơn bạn 💌');
}

// ===== HIỂN THỊ THÔNG BÁO THÀNH CÔNG =====
function showSuccessMessage(message) {
    createNotification(message, 'success');
}

// ===== HIỂN THỊ THÔNG BÁO LỖI =====
function showErrorMessage(message) {
    createNotification(message, 'error');
}

// ===== TẠO THÔNG BÁO =====
function createNotification(message, type) {
    // Xóa thông báo cũ nếu có
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Tạo thông báo mới
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <i class="fas fa-times" style="cursor: pointer; opacity: 0.8;"></i>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động đóng sau 5 giây
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Đóng khi click vào nút X
    notification.querySelector('.fa-times').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

// ===== ĐÓNG THÔNG BÁO =====
function closeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== THÊM CSS ANIMATIONS =====
const style = document.createElement('style');
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
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Responsive notification */
    @media (max-width: 768px) {
        .custom-notification {
            left: 20px !important;
            right: 20px !important;
            max-width: calc(100% - 40px) !important;
        }
    }
`;
document.head.appendChild(style);