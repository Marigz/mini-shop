let cart = [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cart.forEach(item => {
      updateCartItem(item.name);
    });
    updateSummary();
  }
}

function addProduct(productName, price) {
  const existingProduct = cart.find(item => item.name === productName);

  if (existingProduct) {
    existingProduct.count += 1;
  } else {
    cart.push({ name: productName, count: 1, price: price });
  }
  updateCartItem(productName);
  updateSummary();
  saveCart();
  showToast(`${productName} added to cart`, 'success');
}

function removeProduct(productName) {
  const productIndex = cart.findIndex(item => item.name === productName);

  if (productIndex !== -1) {
    if (cart[productIndex].count > 1) {
      cart[productIndex].count -= 1;
      updateCartItem(productName);
    } else {
      removeCartItem(productName);
      cart.splice(productIndex, 1);
      showToast(`${productName} removed from cart!`, 'error');
    }
  }
  updateSummary();
  saveCart();
}

function clearCart() {
  cart.forEach(item => removeCartItem(item.name));
  cart = [];
  updateSummary();
  saveCart();
  showToast('Cart cleared', 'error');
}

function updateCartItem(productName) {
  const cartList = document.getElementById('cart-list');
  const existingLi = document.querySelector(`li[data-name="${productName}"]`);
  const product = cart.find(item => item.name === productName);

  if (existingLi) {
    existingLi.querySelector('.product-info').textContent = `${product.name} - $${product.price} x ${product.count}`;
  } else {
    const li = document.createElement('li');
    li.setAttribute('data-name', productName);
    li.classList.add('fade-in');

    const productInfo = document.createElement('span');
    productInfo.className = 'product-info';
    productInfo.textContent = `${product.name} - $${product.price} x ${product.count}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '-';
    removeBtn.style.backgroundColor = '#f44336';
    removeBtn.onclick = () => removeProduct(productName);

    li.appendChild(productInfo);
    li.appendChild(removeBtn);
    cartList.appendChild(li);
  }
}

function removeCartItem(productName) {
  const li = document.querySelector(`li[data-name="${productName}"]`);
  if (li) {
    li.classList.add('fade-out');
    li.addEventListener('animationend', () => {
      li.remove();
    });
  }
}

function updateSummary() {
  const summary = document.getElementById('cart-summary');
  const total = cart.reduce((sum, item) => sum + (item.price * item.count), 0);
  summary.textContent = `Total: $${total}`;
}

// Load cart on page load
window.onload = () => {
  loadCart();
};
// new ver 6
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  if (type === 'success') {
    toast.style.backgroundColor = '#4caf50' // Green for success
  } else if (type === 'error') {
    toast.style.backgroundColor = '#f44336' // Red for error
  }

  toast.style.display = 'block';
  toast.style.opacity = '1'
  toast.style.transform = 'translate(0)';

  // Hide after 2 seconds
  setTimeout(() => {
    toast.style.transition = `opacity 0.5s, transform 0.5s`;
    toast.style.opacity = '0';
    toast.style.transform = `translateY(20px)`;
    setTimeout(() => {
      toast.style.display = 'none';
      toast.style.transition = "";
    }, 500);
  }, 2000);
}