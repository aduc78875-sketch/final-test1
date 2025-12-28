// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    initSignUpForm();
    initSocialButtons();
    addPasswordValidation();
});

// ===== KHỞI TẠO FORM ĐĂNG KÝ =====
function initSignUpForm() {
    const form = document.querySelector('.form-signup form');
    if (!form) return;
    
    form.addEventListener('submit', handleSignUp);
    
    // Thêm toggle hiển thị mật khẩu cho cả 2 ô
    addPasswordToggles();
}

// ===== THÊM TOGGLE HIỂN THỊ MẬT KHẨU =====
function addPasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const container = input.closest('.input-form');
        container.style.position = 'relative';
        
        const toggleBtn = document.createElement('i');
        toggleBtn.className = 'bi bi-eye-fill password-toggle';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 15px;
            cursor: pointer;
            color: #8B7355;
            font-size: 18px;
            z-index: 1;
        `;
        
        container.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                this.className = 'bi bi-eye-slash-fill password-toggle';
            } else {
                input.type = 'password';
                this.className = 'bi bi-eye-fill password-toggle';
            }
        });
    });
}

// ===== THÊM VALIDATION REAL-TIME CHO MẬT KHẨU =====
function addPasswordValidation() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const passwordInput = passwordInputs[0]; // Mật khẩu
    const confirmInput = passwordInputs[1]; // Xác nhận mật khẩu
    
    if (!passwordInput || !confirmInput) return;
    
    // Tạo strength indicator cho mật khẩu
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.cssText = `
        margin-top: 8px;
        font-size: 13px;
        display: none;
    `;
    passwordInput.closest('.input-form').appendChild(strengthIndicator);
    
    // Kiểm tra độ mạnh mật khẩu
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            strengthIndicator.style.display = 'none';
            return;
        }
        
        strengthIndicator.style.display = 'block';
        const strength = calculatePasswordStrength(password);
        
        strengthIndicator.innerHTML = `
            <div style="display: flex; gap: 4px; margin-bottom: 5px;">
                <div style="flex: 1; height: 4px; background: ${strength.score >= 1 ? strength.color : '#e0e0e0'}; border-radius: 2px;"></div>
                <div style="flex: 1; height: 4px; background: ${strength.score >= 2 ? strength.color : '#e0e0e0'}; border-radius: 2px;"></div>
                <div style="flex: 1; height: 4px; background: ${strength.score >= 3 ? strength.color : '#e0e0e0'}; border-radius: 2px;"></div>
                <div style="flex: 1; height: 4px; background: ${strength.score >= 4 ? strength.color : '#e0e0e0'}; border-radius: 2px;"></div>
            </div>
            <span style="color: ${strength.color}; font-weight: 500;">${strength.text}</span>
        `;
    });
    
    // Kiểm tra khớp mật khẩu
    confirmInput.addEventListener('blur', function() {
        if (this.value && this.value !== passwordInput.value) {
            this.style.borderColor = '#ef4444';
            showInputError(this, 'Mật khẩu không khớp');
        } else {
            this.style.borderColor = '';
            removeInputError(this);
        }
    });
}

// ===== TÍNH ĐIỂM MẬT KHẨU =====
function calculatePasswordStrength(password) {
    let score = 0;
    
    // Độ dài
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    
    // Có chữ hoa và chữ thường
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    
    // Có số
    if (/\d/.test(password)) score++;
    
    // Có ký tự đặc biệt
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const levels = [
        { score: 0, text: 'Rất yếu', color: '#ef4444' },
        { score: 1, text: 'Yếu', color: '#f59e0b' },
        { score: 2, text: 'Trung bình', color: '#eab308' },
        { score: 3, text: 'Mạnh', color: '#22c55e' },
        { score: 4, text: 'Rất mạnh', color: '#10b981' }
    ];
    
    return { ...levels[Math.min(score, 4)], score };
}

// ===== XỬ LÝ ĐĂNG KÝ =====
function handleSignUp(e) {
    e.preventDefault();
    
    const inputs = this.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    // Validate
    if (!validateSignUp(name, email, password, confirmPassword)) {
        return;
    }
    
    // Hiển thị loading
    const submitBtn = this.querySelector('.btn-sign');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang xử lý...';
    
    // Giả lập đăng ký (thực tế sẽ gọi API)
    setTimeout(() => {
        // Lấy danh sách users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Kiểm tra email đã tồn tại
        if (users.some(u => u.email === email)) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            showNotification('Email này đã được đăng ký', 'error');
            return;
        }
        
        // Thêm user mới
        users.push({
            id: Date.now(),
            name: name,
            email: email,
            password: password, // Trong thực tế phải hash
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Tự động đăng nhập
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        }));
        
        // Thông báo thành công
        showNotification('Đăng ký thành công! Chào mừng bạn đến với 4DreamerCoffee 🎉', 'success');
        
        // Reset form
        this.reset();
        
        // Chuyển hướng sau 1.5 giây
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        
    }, 1000);
}

// ===== VALIDATE ĐĂNG KÝ =====
function validateSignUp(name, email, password, confirmPassword) {
    // Validate tên
    if (!name || name.length < 2) {
        showNotification('Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự)', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showNotification('Vui lòng nhập email hợp lệ', 'error');
        return false;
    }
    
    // Validate mật khẩu
    if (!password || password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return false;
    }
    
    // Kiểm tra độ mạnh mật khẩu
    const strength = calculatePasswordStrength(password);
    if (strength.score < 2) {
        showNotification('Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn', 'warning');
        return false;
    }
    
    // Validate xác nhận mật khẩu
    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp', 'error');
        return false;
    }
    
    return true;
}

// ===== HIỂN THỊ LỖI INPUT =====
function showInputError(input, message) {
    removeInputError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 13px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    input.closest('.input-form').appendChild(errorDiv);
}

// ===== XÓA LỖI INPUT =====
function removeInputError(input) {
    const errorDiv = input.closest('.input-form').querySelector('.input-error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===== KHỞI TẠO CÁC NÚT ĐĂNG KÝ XÃ HỘI =====
function initSocialButtons() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    const linkedinBtn = document.querySelector('.btn-linkedin');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialSignUp('Google'));
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleSocialSignUp('Facebook'));
    }
    
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', () => handleSocialSignUp('LinkedIn'));
    }
}

// ===== XỬ LÝ ĐĂNG KÝ XÃ HỘI =====
function handleSocialSignUp(provider) {
    showNotification(`Tính năng đăng ký bằng ${provider} đang được phát triển`, 'info');
}

// ===== HIỂN THỊ NOTIFICATION =====
function showNotification(message, type = 'info') {
    const oldNotif = document.querySelector('.signup-notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'signup-notification';
    
    let icon, bgColor;
    switch(type) {
        case 'success':
            icon = 'bi-check-circle-fill';
            bgColor = '#10b981';
            break;
        case 'error':
            icon = 'bi-exclamation-circle-fill';
            bgColor = '#ef4444';
            break;
        case 'warning':
            icon = 'bi-exclamation-triangle-fill';
            bgColor = '#f59e0b';
            break;
        default:
            icon = 'bi-info-circle-fill';
            bgColor = '#3b82f6';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
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
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="bi ${icon}" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <i class="bi bi-x" style="cursor: pointer; font-size: 20px; opacity: 0.8;"></i>
    `;
    
    document.body.appendChild(notification);
    
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    notification.querySelector('.bi-x').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

// ===== ĐÓNG NOTIFICATION =====
function closeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
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
    
    /* Responsive */
    @media (max-width: 768px) {
        .signup-notification {
            left: 20px !important;
            right: 20px !important;
            max-width: calc(100% - 40px) !important;
        }
    }
    
    /* Hover effect cho social buttons */
    .btn-google:hover,
    .btn-facebook:hover,
    .btn-linkedin:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    /* Loading animation */
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .btn-sign:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .btn-sign:disabled i {
        animation: spin 1s linear infinite;
    }
    
    /* Input focus effect */
    .input-form input:focus {
        border-color: #8B7355;
        box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);