// store.js
// Store logic: auth, cart, localStorage

const STORE_KEY = "simpleshop_userdata";

// Everything under window.store to avoid polluting global
window.store = {
  currentUser: null,  // { username }
  // --- Auth ---
  login(username, password) {
    const found = window.demoUsers.find(u => u.username === username && u.password === password);
    if(found) {
      this.currentUser = { username };
      this.syncUser();
      return true;
    } else {
      return false;
    }
  },
  logout() {
    this.currentUser = null;
    this.syncUser();
  },
  isLoggedIn() {
    return !!this.currentUser;
  },
  syncUser() {
    localStorage.setItem(STORE_KEY + "_currentUser", JSON.stringify(this.currentUser || {}));
  },
  restoreUser() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY + "_currentUser"));
      if (data && data.username) {
        this.currentUser = { username: data.username };
      }
    } catch(e) {}
  },
  // --- Cart ---
  getCart() {
    if(!this.isLoggedIn()) return [];
    const key = STORE_KEY + "_cart_" + this.currentUser.username;
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch(e) { return []; }
  },
  addToCart(productId) {
    if(!this.isLoggedIn()) return false;
    let cart = this.getCart();
    const idx = cart.findIndex(item => item.productId === productId);
    if(idx >= 0) {
      cart[idx].qty++;
    } else {
      cart.push({ productId, qty: 1 });
    }
    this._saveCart(cart);
    return true;
  },
  removeFromCart(productId) {
    if(!this.isLoggedIn()) return false;
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    this._saveCart(cart);
    return true;
  },
  clearCart() {
    if(!this.isLoggedIn()) return false;
    this._saveCart([]);
    return true;
  },
  _saveCart(cartArr) {
    if(!this.isLoggedIn()) return false;
    const key = STORE_KEY + "_cart_" + this.currentUser.username;
    localStorage.setItem(key, JSON.stringify(cartArr));
  }
};

window.store.restoreUser();
