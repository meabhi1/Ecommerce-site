let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ADD TO CART
function addToCart(id, name, price) {
  price = Number(price); // ✅ FIX

  let existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// UPDATE CART COUNT
function updateCartCount() {
  let count = document.getElementById("cart-count");

  let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (count) count.innerText = totalItems;
}

// TOGGLE CART
function toggleCart() {
  let box = document.getElementById("cart-box");
  let overlay = document.getElementById("overlay");

  box.classList.toggle("active");
  overlay.classList.toggle("active");

  displayCart();
}

// DISPLAY CART
// DISPLAY CART
function displayCart() {
  let itemsDiv = document.getElementById("cart-items");
  let totalDiv = document.getElementById("total");

  if (!itemsDiv || !totalDiv) return;

  let total = 0;
  let html = "";

  cart.forEach((item, index) => {
    let price = Number(item.price) || 0;

    total += price * item.qty;

    html += `
      <div style="margin-bottom:10px;">
        <p>${item.name}</p>
        <p>₹${price} x ${item.qty}</p>

        <button onclick="changeQty(${index}, -1)">➖</button>
        <button onclick="changeQty(${index}, 1)">➕</button>
      </div>
    `;
  });

  itemsDiv.innerHTML = html;
  totalDiv.innerText = "Total: ₹" + total;
}

// CATEGORY NAV
function goToCategory(page) {
  window.location.href = page;
}

// SEARCH
function searchProduct() {
  let input = document.getElementById("searchInput")?.value.toLowerCase();

  if (!input) return;

  if (input.includes("cloth")) window.location.href = "clothes.html";
  else if (input.includes("electronic")) window.location.href = "Electronic.html";
  else if (input.includes("phone")) window.location.href = "Smartphone.html";
  else alert("Product not found");
}

// INIT
updateCartCount();

function payNow() {
  let total = 0;

  cart.forEach(item => total += item.price * item.qty);

  if (total === 0) {
    alert("Cart is empty!");
    return;
  }

  var options = {
    key: "rzp_test_SaGtF5Zk2h0FST",
    amount: total * 100,
    currency: "INR",
    name: "MyShop",
    description: "Purchase Payment",

    handler: function (response) {

      let userId = localStorage.getItem("userId");

      // send each item to backend
      cart.forEach(item => {
        fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: item.id,
            quantity: item.qty
          })
        });
      });

      // clear cart
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      window.location.href = "success.html";
    }
  };

  // ✅ Razorpay should be OUTSIDE handler
  var rzp = new Razorpay(options);
  rzp.open();
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1); // remove item
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function signup() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.text())
  .then(data => {
    alert("Signup successful!");
    window.location.href = "login.html";
  })
  .catch(err => console.log(err));
}

function addToWishlist(name, price) {
  wishlist.push({ name, price });
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert(name + " added to wishlist ❤️");
}

function login() {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(user => {
    if (user.id) {
      localStorage.setItem("loggedInUser", user.name);
      localStorage.setItem("userId", user.id);

      window.location.href = "index.html";
    } else {
      alert("Invalid credentials!");
    }
  });
}

function checkLogin() {
  let user = localStorage.getItem("loggedInUser");

  if (user) {
    let acc = document.querySelector(".accounts");
    if (acc) {
      acc.innerHTML = `
        <span>Hi, ${user}</span> 
        <button onclick="logout()">Logout</button>
      `;
    }
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  window.location.reload();
}

checkLogin();



function togglePassword() {
  let pass = document.getElementById("loginPassword");

  if (pass.type === "password") {
    pass.type = "text";
  } else {
    pass.type = "password";
  }
}


document.addEventListener("click", function (event) {
  let cartBox = document.getElementById("cart-box");
  let cartIcon = document.querySelector(".cart");

  if (!cartBox || !cartIcon) return;

  // if click is outside cart & cart icon
  if (!cartBox.contains(event.target) && !cartIcon.contains(event.target)) {
    cartBox.classList.remove("active");
  }
});

function closeCart() {
  document.getElementById("cart-box").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}
let startX = 0;

const cartBox = document.getElementById("cart-box");

if (cartBox) {
  cartBox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  cartBox.addEventListener("touchmove", (e) => {
    let moveX = e.touches[0].clientX;

    if (moveX - startX > 80) {
      closeCart();
    }
  });
}

function loadProducts() {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(products => {
      let container = document.getElementById("product-list");

      if (!container) return; // ✅ prevents crash

      let html = "";

      products.forEach(p => {
        html += `
          <div class="product">
            <img src="images/${p.image}" width="150"/>
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>

            <button onclick="addToCart(${p.id}, \`${p.name}\`, ${p.price})">
              Add to Cart
            </button>

            <button onclick="addToWishlist(\`${p.name}\`, ${p.price})">
              ❤️ Wishlist
            </button>
          </div>
        `;
      });

      container.innerHTML = html;
    });
}


if (document.getElementById("product-list")) {
  loadProducts();
}


function loadUserOrders() {
  let userId = localStorage.getItem("userId");

  fetch(`http://localhost:5000/api/orders/${userId}`)
    .then(res => res.json())
    .then(data => {
      let container = document.getElementById("orders-list");

      if (!container) return;

      if (data.length === 0) {
        container.innerHTML = "<p>No orders yet 😔</p>";
        return;
      }

      let html = "";

      data.forEach(order => {
        html += `
          <div style="border:1px solid #ccc; padding:10px; margin:10px;">
            <p><b>Order ID:</b> ${order.order_id}</p>
            <p><b>Product:</b> ${order.product_name}</p>
            <p><b>Quantity:</b> ${order.quantity}</p>
            <p><b>Total:</b> ₹${order.total}</p>
            <p><b>Date:</b> ${new Date(order.created_at).toLocaleString()}</p>
          </div>
        `;
      });

      container.innerHTML = html;
    });
}

if (window.location.pathname.includes("orders.html")) {
  loadUserOrders();
}


function loadAllOrders() {
  fetch("http://localhost:5000/api/admin/orders")
    .then(res => res.json())
    .then(data => {
      let container = document.getElementById("admin-orders");

      if (!container) return;

      let html = "";

      data.forEach(order => {
        html += `
          <div style="border:1px solid black; margin:10px; padding:10px;">
            <p><b>Order ID:</b> ${order.order_id}</p>
            <p><b>User:</b> ${order.user_name}</p>
            <p><b>Product:</b> ${order.product_name}</p>
            <p><b>Qty:</b> ${order.quantity}</p>
            <p><b>Total:</b> ₹${order.total}</p>
            <p><b>Date:</b> ${new Date(order.created_at).toLocaleString()}</p>
          </div>
        `;
      });

      container.innerHTML = html;
    });
}

if (window.location.pathname.includes("admin.html")) {
  loadAllOrders();
}

function protectAdmin() {
  let user = localStorage.getItem("loggedInUser");

  if (user !== "admin") {
    alert("Access denied!");
    window.location.href = "index.html";
  }
}

if (window.location.pathname.includes("admin.html")) {
  protectAdmin();
}




