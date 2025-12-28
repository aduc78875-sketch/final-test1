// Đóng menu khi click vào overlay
document.querySelector('.mobile-menu-overlay').addEventListener('click', function() {
    document.getElementById('menu-toggle').checked = false;
});

// Đóng menu khi click vào link
document.querySelectorAll('.mobile-list a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu-toggle').checked = false;
    });
});
// Đóng menu khi click vào overlay
document.querySelector('.mobile-menu-overlay').addEventListener('click', function() {
    document.getElementById('menu-toggle').checked = false;
});

// Đóng menu khi click vào link
document.querySelectorAll('.mobile-list a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu-toggle').checked = false;
    });
});
function processCheckout() {
    const checkedItems = document.querySelectorAll(".item-chk:checked");
    
    if (checkedItems.length === 0) {
        alert("Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng!");
        return;
    }
    
    // Lưu các sản phẩm được chọn vào localStorage
    const selectedItems = [];
    checkedItems.forEach((checkbox, index) => {
        const itemIndex = Array.from(document.querySelectorAll(".item-chk")).indexOf(checkbox);
        selectedItems.push(cart[itemIndex]);
    });
    
    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    window.location.href = "checkout.html";
}
function removeItem(i) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        cart.splice(i, 1);
        localStorage.setItem("myCart", JSON.stringify(cart));
        loadCart();
    }
}