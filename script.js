document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Products (This displays your sarees)
    displayProducts();

    // 2. Setup Login Form (Only if we are on the login page)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Products Data
const products = [
    {
        id: 1,
        name: "Exquisite Banarasi Silk",
        price: 15999,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80",
        category: "silk"
    },
    {
        id: 2,
        name: "Designer Chiffon Saree",
        price: 8499,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80",
        category: "chiffon"
    }
];

// Display Products function
function displayProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return; // Exit if not on a page with a product grid

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <button class="btn btn-primary">View Details</button>
            </div>
        </div>
    `).join('');
}

// Handle Login (Moves the auth logic here so it only runs when clicking 'Login')
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple admin check
    if (email === 'admin@moharani.com' && password === 'admin123') {
        localStorage.setItem('adminData', JSON.stringify({
            email: email,
            authenticated: true,
            loginTime: new Date().getTime()
        }));
        alert('Login Successful!');
        window.location.href = 'index.html'; 
    } else {
        alert('Invalid credentials!');
    }
}
