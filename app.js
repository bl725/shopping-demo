const products = [
  { id: 1, name: "Wireless Headphones", desc: "Noise-cancelling demo product.", price: 2499, img: "https://picsum.photos/seed/headphones/600/400" },
  { id: 2, name: "Smart Watch", desc: "Fitness + notifications (demo).", price: 3999, img: "https://picsum.photos/seed/watch/600/400" },
  { id: 3, name: "Backpack", desc: "Water-resistant, laptop-friendly.", price: 1299, img: "https://picsum.photos/seed/bag/600/400" },
  { id: 4, name: "Coffee Mug", desc: "Ceramic mug for your coding sessions.", price: 299, img: "https://picsum.photos/seed/mug/600/400" },
  { id: 5, name: "Mechanical Keyboard", desc: "Clicky keys, great feel (demo).", price: 4999, img: "https://picsum.photos/seed/keyboard/600/400" },
  { id: 6, name: "Desk Lamp", desc: "Warm light for late-night work.", price: 899, img: "https://picsum.photos/seed/lamp/600/400" },
];

const els = {
  grid: document.getElementById("productGrid"),
  cartCount: document.getElementById("cartCount"),
  cartTotal: document.getElementById("cartTotal"),
  cartItems: document.getElementById("cartItems"),
  openCartBtn: document.getElementById("openCartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartDrawer: document.getElementById("cartDrawer"),
  backdrop: document.getElementById("backdrop"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem("demo_cart") || "{}"); }
  catch { return {}; }
}
function saveCart(cart) { localStorage.setItem("demo_cart", JSON.stringify(cart)); }
function cartCount(cart) { return Object.values(cart).reduce((a,b)=>a+b, 0); }
function cartTotal(cart) {
  return Object.entries(cart).reduce((sum,[id,qty]) => {
    const p = products.find(x => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function openCart() {
  els.cartDrawer.classList.add("open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  els.backdrop.hidden = false;
}
function closeCart() {
  els.cartDrawer.classList.remove("open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
  els.backdrop.hidden = true;
}

function renderProducts() {
  els.grid.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price-row">
        <div class="price">₹ ${p.price}</div>
      </div>
      <button class="btn" data-add="${p.id}">Add to Cart</button>
    </div>
  `).join("");

  els.grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-add"));
      const cart = loadCart();
      cart[id] = (cart[id] || 0) + 1;
      saveCart(cart);
      renderCart();
      openCart();
    });
  });
}

function renderCart() {
  const cart = loadCart();
  const entries = Object.entries(cart);

  els.cartCount.textContent = String(cartCount(cart));
  els.cartTotal.textContent = String(cartTotal(cart));

  if (entries.length === 0) {
    els.cartItems.innerHTML = `<p style="color:#aab6d6">Cart is empty.</p>`;
    return;
  }

  els.cartItems.innerHTML = entries.map(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    if (!p) return "";
    return `
      <div class="cart-item">
        <div>
          <strong>${p.name}</strong>
          <small>₹ ${p.price} each</small>
        </div>
        <div class="qty">
          <button data-dec="${p.id}">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}">+</button>
        </div>
      </div>
    `;
  }).join("");

  els.cartItems.querySelectorAll("[data-inc]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-inc"));
      const cart = loadCart();
      cart[id] = (cart[id] || 0) + 1;
      saveCart(cart);
      renderCart();
    });
  });

  els.cartItems.querySelectorAll("[data-dec]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-dec"));
      const cart = loadCart();
      cart[id] = Math.max(0, (cart[id] || 0) - 1);
      if (cart[id] === 0) delete cart[id];
      saveCart(cart);
      renderCart();
    });
  });
}

els.openCartBtn.addEventListener("click", openCart);
els.closeCartBtn.addEventListener("click", closeCart);
els.backdrop.addEventListener("click", closeCart);

els.clearCartBtn.addEventListener("click", () => {
  saveCart({});
  renderCart();
});

els.checkoutBtn.addEventListener("click", () => {
  const cart = loadCart();
  if (cartCount(cart) === 0) {
    alert("Cart is empty 🙂");
    return;
  }
  alert("✅ Fake checkout successful! (Demo only)");
  saveCart({});
  renderCart();
  closeCart();
});

renderProducts();
renderCart();
