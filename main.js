// main.js
// Handles DOM UI for store

function renderUserArea() {
  const area = document.getElementById("user-area");
  area.innerHTML = window.store.isLoggedIn()
    ? `Logged in as <b>${window.store.currentUser.username}</b> <button id="logout-btn">Logout</button>`
    : `Not logged in`;
  if(window.store.isLoggedIn()) {
    document.getElementById("logout-btn").onclick = function() {
      window.store.logout();
      rerender();
    };
  }
}

function renderLoginArea() {
  const area = document.getElementById("login-area");
  if(window.store.isLoggedIn()) {
    area.innerHTML = "";
    return;
  }
  area.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <input name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <small>Demo users: alice/123, bob/456, carol/789</small>
    <span id="login-msg" style="color:red;"></span>
  `;
  area.querySelector("#login-form").onsubmit = function(e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    if(window.store.login(username, password)) {
      rerender();
    } else {
      document.getElementById("login-msg").innerText = "Login failed.";
    }
  };
}

function renderProductsArea() {
  const area = document.getElementById("products-area");
  area.innerHTML = `<h2>Products</h2>` +
    window.products.map(product => `
      <div class="product">
        <img src="${product.img}" alt="${product.name}">
        <span><b>${product.name}</b><br>$${product.price}</span>
        <button 
          ${window.store.isLoggedIn() ? "" : "disabled"}
          onclick="addToCart(${product.id})"
        >Add to Cart</button>
      </div>
    `).join("");
}

function addToCart(productId) {
  if(!window.store.isLoggedIn()) return;
  window.store.addToCart(productId);
  rerender();
}

function renderCartArea() {
  const area = document.getElementById("cart-area");
  if(!window.store.isLoggedIn()) {
    area.innerHTML = `<b>Login to use cart!</b>`;
    return;
  }
  let cart = window.store.getCart();
  if(cart.length === 0) {
    area.innerHTML = `<b>Your cart is empty.</b>`;
    return;
  }
  area.innerHTML = `<h2>Your Cart</h2><ul>` +
    cart.map(item => {
      let prod = window.products.find(p => p.id === item.productId);
      if(!prod) return "";
      return `<li class="cart-item">
        <img src="${prod.img}" alt="${prod.name}">
        <span>${prod.name} ($${prod.price}) x ${item.qty}</span>
        <button onclick="removeFromCart(${prod.id})">Remove</button>
      </li>`;
    }).join("") +
    `</ul>
    <button onclick="clearCart()">Clear Cart</button>
    <span style="font-weight:bold;float:right;">Total: $${cart.reduce((sum, item) => {
      let prod = window.products.find(p => p.id === item.productId)
      return sum + (prod ? prod.price * item.qty : 0);
    }, 0)}</span>
    `;
}

function removeFromCart(productId) {
  window.store.removeFromCart(productId);
  rerender();
}

function clearCart() {
  window.store.clearCart();
  rerender();
}

window.rerender = function rerender() {
  renderUserArea();
  renderLoginArea();
  renderProductsArea();
  renderCartArea();
};

window.onload = rerender;