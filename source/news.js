// ===== DANH SÁCH BÀI VIẾT =====
const newsArticles = [
    {
        id: 1,
        title: "Workshop: Nghệ thuật pha chế tại nhà",
        excerpt: "Học cách tạo ra ly Latte Art hình trái tim chuẩn vị ngay tại căn bếp của bạn.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "15", month: "Th10" },
        category: "workshop"
    },
    {
        id: 2,
        title: "Ra mắt Bộ sưu tập Mùa Đông",
        excerpt: "Hương vị ấm áp của gừng, quế và socola nóng đã sẵn sàng phục vụ bạn.",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "02", month: "Th11" },
        category: "product"
    },
    {
        id: 3,
        title: "Hành trình từ Nông trại đến Tách cà phê",
        excerpt: "Chuyến đi thực tế đến Buôn Ma Thuột gặp gỡ những người nông dân tâm huyết.",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "20", month: "Th11" },
        category: "story"
    },
    {
        id: 4,
        title: "Đêm nhạc Acoustic: Giai điệu mùa thu",
        excerpt: "Thưởng thức cà phê trong không gian lãng mạn cùng những bản tình ca.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "25", month: "Th11" },
        category: "event"
    },
    {
        id: 5,
        title: "Chiến dịch Sống Xanh cùng 4Dreamer",
        excerpt: "Giảm 10% khi mang bình cá nhân. Cam kết sử dụng ống hút giấy.",
        image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "05", month: "Th12" },
        category: "promotion"
    },
    {
        id: 6,
        title: "Tri ân khách hàng thân thiết 2025",
        excerpt: "Cơ hội nhận thẻ Gold Member và hàng ngàn voucher miễn phí.",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "12", month: "Th12" },
        category: "promotion"
    },
    {
        id: 7,
        title: "Cách phân biệt Arabica và Robusta",
        excerpt: "Kiến thức cơ bản giúp bạn trở thành người sành cà phê chính hiệu.",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "18", month: "Th12" },
        category: "knowledge"
    },
    {
        id: 8,
        title: "Menu Giáng Sinh Special",
        excerpt: "Món quà ngọt ngào dành tặng người thương trong đêm Noel.",
        image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "24", month: "Th12" },
        category: "product"
    },
    {
        id: 9,
        title: "Chào đón năm mới 2026",
        excerpt: "Lịch hoạt động và các chương trình khuyến mãi dịp Tết Dương Lịch.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: { day: "01", month: "Th01" },
        category: "event"
    }
];

// ===== BIẾN PHÂN TRANG =====
let currentPage = 1;
const itemsPerPage = 9;
let filteredArticles = [...newsArticles];

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initPagination();
    initNewsletterForms();
    renderNews();
    addScrollAnimations();
});

// ===== KHỞI TẠO TÌM KIẾM =====
function initSearch() {
    const searchInput = document.querySelector('.search-bar-container input');
    const searchButton = document.querySelector('.search-bar-container button');
    
    if (searchInput && searchButton) {
        // Tìm kiếm khi click nút
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // Tìm kiếm khi nhấn Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
        
        // Tìm kiếm real-time (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 500);
        });
    }
}

// ===== THỰC HIỆN TÌM KIẾM =====
function performSearch(keyword) {
    keyword = keyword.toLowerCase().trim();
    
    if (!keyword) {
        filteredArticles = [...newsArticles];
    } else {
        filteredArticles = newsArticles.filter(article => {
            return article.title.toLowerCase().includes(keyword) ||
                   article.excerpt.toLowerCase().includes(keyword);
        });
    }
    
    currentPage = 1;
    renderNews();
    renderPagination();
    
    // Hiển thị thông báo nếu không tìm thấy
    if (filteredArticles.length === 0) {
        showNotification('Không tìm thấy bài viết nào phù hợp', 'info');
    }
}

// ===== RENDER BÀI VIẾT =====
function renderNews() {
    const container = document.querySelector('.grid-container.col-3');
    if (!container) return;
    
    // Tính toán bài viết hiển thị
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);
    
    // Clear container
    container.innerHTML = '';
    
    // Render bài viết
    if (articlesToShow.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: #666; font-weight: 500;">Không tìm thấy bài viết</h3>
                <p style="color: #999; margin-top: 10px;">Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }
    
    articlesToShow.forEach((article, index) => {
        const articleCard = document.createElement('article');
        articleCard.className = 'news-card';
        articleCard.style.opacity = '0';
        articleCard.style.transform = 'translateY(20px)';
        
        articleCard.innerHTML = `
            <div class="news-img">
                <img src="${article.image}" 
                     alt="${article.title}"
                     onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
                <div class="date-badge">
                    <span class="day">${article.date.day}</span>
                    <span class="month">${article.date.month}</span>
                </div>
            </div>
            <div class="news-content">
                <h3 class="news-title">
                    <a href="#" onclick="viewArticle(${article.id}); return false;">
                        ${article.title}
                    </a>
                </h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <a href="#" onclick="viewArticle(${article.id}); return false;" class="read-more">
                    Xem chi tiết <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        container.appendChild(articleCard);
        
        // Animation stagger
        setTimeout(() => {
            articleCard.style.transition = 'all 0.4s ease';
            articleCard.style.opacity = '1';
            articleCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===== XEM CHI TIẾT BÀI VIẾT =====
function viewArticle(articleId) {
    const article = newsArticles.find(a => a.id === articleId);
    if (!article) return;
    
    showNotification(`Đang mở bài viết: "${article.title}"`, 'info');
    
    // Có thể chuyển hướng đến trang chi tiết
    // window.location.href = `news-detail.html?id=${articleId}`;
}

// ===== KHỞI TẠO PHÂN TRANG =====
function initPagination() {
    renderPagination();
}

// ===== RENDER PHÂN TRANG =====
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Nút Previous
    const prevBtn = document.createElement('a');
    prevBtn.href = '#';
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
    prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderNews();
            renderPagination();
            scrollToTop();
        }
    };
    if (currentPage === 1) prevBtn.style.opacity = '0.5';
    paginationContainer.appendChild(prevBtn);
    
    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('a');
        pageBtn.href = '#';
        pageBtn.className = 'page-btn';
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.textContent = i;
        pageBtn.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            renderNews();
            renderPagination();
            scrollToTop();
        };
        paginationContainer.appendChild(pageBtn);
    }
    
    // Nút Next
    const nextBtn = document.createElement('a');
    nextBtn.href = '#';
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderNews();
            renderPagination();
            scrollToTop();
        }
    };
    if (currentPage === totalPages) nextBtn.style.opacity = '0.5';
    paginationContainer.appendChild(nextBtn);
}

// ===== SCROLL LÊN TOP =====
function scrollToTop() {
    const newsSection = document.getElementById('news');
    if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== KHỞI TẠO NEWSLETTER FORMS =====
function initNewsletterForms() {
    const forms = document.querySelectorAll('.footer-newsletter, .main-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
}

// ===== XỬ LÝ NEWSLETTER =====
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showNotification('Vui lòng nhập email hợp lệ', 'error');
        return;
    }
    
    // Lưu email
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    
    if (subscribers.includes(email)) {
        showNotification('Email này đã đăng ký newsletter', 'warning');
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    
    // Reset form
    emailInput.value = '';
    
    // Thông báo thành công
    showNotification('Đăng ký nhận tin thành công! Cảm ơn bạn 💌', 'success');
}

// ===== ANIMATION KHI SCROLL =====
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Quan sát các phần tử cần animation
    document.querySelectorAll('.news-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== HIỂN THỊ NOTIFICATION =====
function showNotification(message, type = 'info') {
    const oldNotif = document.querySelector('.news-notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'news-notification';
    
    let icon, bgColor;
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            bgColor = '#10b981';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            bgColor = '#ef4444';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            bgColor = '#f59e0b';
            break;
        default:
            icon = 'fa-info-circle';
            bgColor = '#3b82f6';
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
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="font-size: 20px;"></i>
        <span style="flex: 1;">${message}</span>
        <i class="fas fa-times" style="cursor: pointer; opacity: 0.8;"></i>
    `;
    
    document.body.appendChild(notification);
    
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    notification.querySelector('.fa-times').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

// ===== ĐÓNG NOTIFICATION =====
function closeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
}

// ===== THÊM CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .news-card.animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .news-notification {
            left: 20px !important;
            right: 20px !important;
            top: 80px !important;
            max-width: calc(100% - 40px) !important;
        }
    }
`;
document.head.appendChild(style);