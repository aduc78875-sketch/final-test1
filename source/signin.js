// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    initSignInForm();
    initSocialButtons();
    checkRememberedUser();
});

// ===== KHỞI TẠO FORM ĐĂNG NHẬP =====
function initSignInForm() {
    const form = document.querySelector('.form-signin form');
    if (!form) return;
    
    form.addEventListener('submit', handleSignIn);
    
    // Thêm toggle hiển thị mật khẩu
    addPasswordToggle();
}

// ===== THÊM TOGGLE HIỂN THỊ MẬT KHẨU =====
function addPasswordToggle() {
    const passwordInput = document.querySelector('input[type="password"]');
    if (!passwordInput) return;
    
    const passwordContainer = passwordInput.closest('.input-form');
    
    // Tạo nút toggle
    const toggleBtn = document.createElement('i');
    toggleBtn.className = 'bi bi-eye-fill password-toggle';
    toggleBtn.style.cssText = `
        position: absolute;
        right: 15px;
        cursor: pointer;
        color: #8B7355;
        font-size: 18px;
    `;
    
    passwordContainer.style.position = 'relative';
    passwordContainer.appendChild(toggleBtn);
    
    // Xử lý click
    toggleBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.className = 'bi bi-eye-slash-fill password-toggle';
        } else {
            passwordInput.type = 'password';
            this.className = 'bi bi-eye-fill password-toggle';
        }
    });
}

// ===== XỬ LÝ ĐĂNG NHẬP =====
function handleSignIn(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const passwordInput = this.querySelector('input[type="password"]');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate
    if (!validateSignIn(email, password)) {
        return;
    }
    
    // Hiển thị loading
    const submitBtn = this.querySelector('.btn-sign');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Đang xử lý...';
    
    // Giả lập đăng nhập (thực tế sẽ gọi API)
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Đăng nhập thành công
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: user.name,
                loginTime: new Date().toISOString()
            }));
            
            showNotification('Đăng nhập thành công! Chào mừng bạn trở lại 🎉', 'success');
            
            // Chuyển hướng sau 1.5 giây
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            // Đăng nhập thất bại
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            showNotification('Email hoặc mật khẩu không đúng', 'error');
        }
    }, 1000);
}

// ===== VALIDATE ĐĂNG NHẬP =====
function validateSignIn(email, password) {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showNotification('Vui lòng nhập email hợp lệ', 'error');
        return false;
    }
    
    // Validate password
    if (!password || password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return false;
    }
    
    return true;
}

// ===== KHỞI TẠO CÁC NÚT ĐĂNG NHẬP XÃ HỘI =====
function initSocialButtons() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    const linkedinBtn = document.querySelector('.btn-linkedin');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
    }
    
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', () => handleSocialLogin('LinkedIn'));
    }
}

// ===== XỬ LÝ ĐĂNG NHẬP XÃ HỘI =====
function handleSocialLogin(provider) {
    showNotification(`Tính năng đăng nhập bằng ${provider} đang được phát triển`, 'info');
    
    // Trong thực tế, bạn sẽ tích hợp OAuth2
    // Ví dụ cho Google:
    // window.location.href = 'https://accounts.google.com/o/oauth2/auth?...';
}

// ===== KIỂM TRA USER ĐÃ ĐĂNG NHẬP =====
function checkRememberedUser() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            
            // Kiểm tra thời gian đăng nhập (ví dụ: tự động logout sau 24h)
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                // Hỏi người dùng có muốn tiếp tục với tài khoản cũ không
                showWelcomeBackNotification(user.name || user.email);
            } else {
                // Đã quá 24h, xóa session
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// ===== THÔNG BÁO CHÀO MỪNG TRỞ LẠI =====
function showWelcomeBackNotification(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="bi bi-person-circle" style="font-size: 32px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 5px;">Chào mừng trở lại!</div>
                <div style="font-size: 14px; opacity: 0.9;">${name}</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="continueAsUser()" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                ">Tiếp tục</button>
                <button onclick="closeWelcomeBack(this)" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                ">Đổi tài khoản</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động đóng sau 10 giây
    setTimeout(() => {
        if (notification.parentElement) {
            closeWelcomeBack(notification);
        }
    }, 10000);
}

// ===== TIẾP TỤC VỚI USER CŨ =====
function continueAsUser() {
    showNotification('Đang chuyển hướng...', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 500);
}

// ===== ĐÓNG WELCOME BACK =====
function closeWelcomeBack(element) {
    const notification = element.closest('div[style*="position: fixed"]') || element;
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== HIỂN THỊ NOTIFICATION =====
function showNotification(message, type = 'info') {
    const oldNotif = document.querySelector('.signin-notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'signin-notification';
    
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
    
    /* Responsive */
    @media (max-width: 768px) {
        .signin-notification,
        div[style*="position: fixed"][style*="top: 20px"] {
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
`;
document.head.appendChild(style);