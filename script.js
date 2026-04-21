// Admin initialization
document.addEventListener('DOMContentLoaded', function() {
    // checkAdminAuth();
    loadAdminData();
    setupAdminEventListeners();
});

// Admin authentication
// function checkAdminAuth() {
//     const adminData = JSON.parse(localStorage.getItem('adminData'));
//     if (!adminData || !adminData.authenticated) {
//         window.location.href = 'login.html';
//     }
// }

// Load admin dashboard data
async function loadAdminData() {
    const data = await fetch('data.json').then(r => r.json());
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update stats
    document.getElementById('totalProducts').textContent = data.products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = `₹${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`;
    document.getElementById('totalCustomers').textContent = new Set(orders.map(o => o.customer.email)).size;
    
    displayAdminProducts(data.products);
    displayAdminOrders(orders);
}

// Display admin products table
function displayAdminProducts(products = []) {
    const tbody = document.getElementById('adminProductsTable');
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="admin-product-img"></td>
            <td>${product.name}</td>
            <td>₹${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td><span class="badge">${product.category}</span></td>
            <td>
                <button class="btn-small btn-warning" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Display admin orders table
function displayAdminOrders(orders = []) {
    const tbody = document.getElementById('adminOrdersTable');
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer.name}<br><small>${order.customer.phone}</small></td>
            <td>₹${order.total.toLocaleString()}</td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${order.status.toUpperCase()}
                </span>
            </td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <button class="btn-small btn-success" onclick="updateOrderStatus(${order.id}, 'shipped')">
                    Ship
                </button>
                <button class="btn-small btn-primary" onclick="viewOrderDetails(${order.id})">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

// Admin section navigation
function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

// Product CRUD operations
function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

document.getElementById('addProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };

    // Update data.json (in real app, this would be a POST to backend)
    const response = await fetch('data.json');
    const data = await response.json();
    data.products.push(newProduct);
    
    // Update local products array
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    displayAdminProducts(products);
    closeAddProductModal();
    showNotification('Product added successfully!', 'success');
});

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminData();
        showNotification('Product deleted successfully!', 'success');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Populate modal with product data for editing
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;
        
        // Change form to edit mode
        const form = document.getElementById('addProductForm');
        form.onsubmit = async function(e) {
            e.preventDefault();
            products = products.map(p => 
                p.id === productId ? { ...p, 
                    name: document.getElementById('productName').value,
                    price: parseInt(document.getElementById('productPrice').value),
                    stock: parseInt(document.getElementById('productStock').value),
                    category: document.getElementById('productCategory').value,
                    description: document.getElementById('productDescription').value,
                    image: document.getElementById('productImage').value
                } : p
            );
            localStorage.setItem('products', JSON.stringify(products));
            displayAdminProducts(products);
            closeAddProductModal();
            showNotification('Product updated successfully!', 'success');
        };
        
        openAddProductModal();
    }
}

// Order management
function updateOrderStatus(orderId, status) {
    orders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('orders', JSON.stringify(orders));
    displayAdminOrders(orders);
    showNotification(`Order status updated to ${status}!`, 'success');
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order #${order.id}\nCustomer: ${order.customer.name}\nTotal: ₹${order.total.toLocaleString()}\nStatus: ${order.status}`);
    }
}

// Admin event listeners
function setupAdminEventListeners() {
    // Modal close on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('addProductModal');
        if (event.target === modal) {
            closeAddProductModal();
        }
    }
}

// Admin notification (same as main script)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
