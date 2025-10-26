// State Management (Using in-memory storage)
let currentUser = null;
let users = [];
let cart = [];
let reviews = [
  {
    product: 'Cocoa Beans',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Excellent quality cocoa beans! The flavor is rich and authentic. Perfect for my homemade chocolates.',
    date: '2025-10-15'
  },
  {
    product: 'Cocoa Powder',
    name: 'Rahul Kumar',
    rating: 5,
    comment: 'Best cocoa powder I have used. Great for baking and hot chocolate. Highly recommend!',
    date: '2025-10-18'
  },
  {
    product: 'Cocoa Beans',
    name: 'Anjali Reddy',
    rating: 4,
    comment: 'Good quality beans, fresh and well-packaged. Will order again.',
    date: '2025-10-20'
  }
];

// Products Data
const products = {
  beans: {
    name: 'Cocoa Beans',
    price: 450, // Average of 400-500
    priceRange: '₹400-500',
    icon: '☕'
  },
  powder: {
    name: 'Cocoa Powder',
    price: 650,
    priceRange: '₹650',
    icon: '🍫'
  }
};

// Navigation
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) {
      link.classList.add('active');
    }
  });
  
  // Update hash without scrolling
  window.history.pushState(null, '', `#${page}`);
}

// Navigation click handlers
document.addEventListener('DOMContentLoaded', () => {
  // Handle navigation clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        navigateTo(page);
      }
    });
  });
  
  // Handle footer links
  document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.dataset.page;
      if (page) {
        e.preventDefault();
        navigateTo(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
  
  // Handle initial hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    navigateTo(hash);
  } else {
    navigateTo('home');
  }
  
  // Update cart display
  updateCartDisplay();
  displayReviews();
  
  // Star rating interaction
  setupStarRating();
});

// Cart Functions
function addToCart(productType) {
  const product = products[productType];
  const qtyInput = document.getElementById(`${productType}Qty`);
  const quantity = parseInt(qtyInput.value) || 1;
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.type === productType);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      type: productType,
      name: product.name,
      price: product.price,
      quantity: quantity,
      icon: product.icon
    });
  }
  
  updateCartDisplay();
  
  // Show notification
  alert(`${product.name} (${quantity} kg) added to cart!`);
  
  // Reset quantity
  qtyInput.value = 1;
}

function updateCartQuantity(productType, change) {
  const item = cart.find(item => item.type === productType);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productType);
    } else {
      updateCartDisplay();
    }
  }
}

function removeFromCart(productType) {
  cart = cart.filter(item => item.type !== productType);
  updateCartDisplay();
}

function updateCartDisplay() {
  // Update cart badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartBadge').textContent = totalItems;
  
  // Update cart page
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start shopping!</p>';
    cartSummary.style.display = 'none';
  } else {
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      cartHTML += `
        <div class="cart-item">
          <div class="cart-item-image">${item.icon}</div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p class="cart-item-price">₹${item.price} per kg</p>
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="updateCartQuantity('${item.type}', -1)">-</button>
              <span>${item.quantity} kg</span>
              <button class="qty-btn" onclick="updateCartQuantity('${item.type}', 1)">+</button>
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-total">₹${itemTotal}</div>
            <button class="remove-btn" onclick="removeFromCart('${item.type}')">Remove</button>
          </div>
        </div>
      `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    cartSummary.style.display = 'block';
    
    // Update summary
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${subtotal}`;
  }
}

function proceedToCheckout() {
  if (!currentUser) {
    alert('Please login or register to complete your purchase.');
    navigateTo('login');
  } else {
    alert(`Thank you for your order, ${currentUser.name}! Your order total is ${document.getElementById('total').textContent}. We will contact you shortly to confirm delivery details.`);
    cart = [];
    updateCartDisplay();
    navigateTo('home');
  }
}

// Auth Functions
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    updateAuthUI();
    alert(`Welcome back, ${user.name}!`);
    navigateTo('home');
  } else {
    alert('Invalid email or password. Please try again.');
  }
  
  return false;
}

function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    alert('User with this email already exists!');
    return false;
  }
  
  // Create new user
  const newUser = { name, email, password };
  users.push(newUser);
  currentUser = newUser;
  
  updateAuthUI();
  alert(`Welcome, ${name}! Your account has been created successfully.`);
  navigateTo('home');
  
  return false;
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginNavBtn');
  if (currentUser) {
    loginBtn.textContent = `👤 ${currentUser.name}`;
    loginBtn.onclick = (e) => {
      e.preventDefault();
      if (confirm('Do you want to logout?')) {
        currentUser = null;
        updateAuthUI();
        alert('You have been logged out.');
        navigateTo('home');
      }
    };
  } else {
    loginBtn.textContent = 'Login/Register';
    loginBtn.onclick = null;
  }
}

// Auth tab switching
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update tabs
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update forms
      document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
      document.getElementById(`${targetTab}Form`).classList.add('active');
    });
  });
});

// Reviews Functions
function setupStarRating() {
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('reviewRating');
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      ratingInput.value = rating;
      
      // Update star display
      stars.forEach((s, index) => {
        if (index < rating) {
          s.textContent = '★';
          s.classList.add('active');
        } else {
          s.textContent = '☆';
          s.classList.remove('active');
        }
      });
    });
    
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach((s, index) => {
        if (index < rating) {
          s.textContent = '★';
        } else {
          s.textContent = '☆';
        }
      });
    });
  });
  
  // Reset on mouse leave
  document.querySelector('.star-rating').addEventListener('mouseleave', () => {
    const currentRating = parseInt(ratingInput.value) || 0;
    stars.forEach((s, index) => {
      if (index < currentRating) {
        s.textContent = '★';
        s.classList.add('active');
      } else {
        s.textContent = '☆';
        s.classList.remove('active');
      }
    });
  });
}

function displayReviews() {
  const container = document.getElementById('reviewsContainer');
  
  if (reviews.length === 0) {
    container.innerHTML = '<p class="empty-cart-message">No reviews yet. Be the first to review!</p>';
    return;
  }
  
  let reviewsHTML = '';
  reviews.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    reviewsHTML += `
      <div class="review-card">
        <div class="review-header">
          <span class="review-name">${review.name}</span>
          <span class="review-rating">${stars}</span>
        </div>
        <div class="review-product">Product: ${review.product}</div>
        <p class="review-comment">${review.comment}</p>
        <div class="review-date">${review.date}</div>
      </div>
    `;
  });
  
  container.innerHTML = reviewsHTML;
}

// Review form submission
document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('reviewForm');
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = document.getElementById('reviewProduct').value;
    const name = document.getElementById('reviewName').value;
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;
    
    if (!product || !name || !rating || !comment) {
      alert('Please fill all fields and select a rating.');
      return;
    }
    
    // Add review
    const today = new Date().toISOString().split('T')[0];
    reviews.unshift({
      product,
      name,
      rating,
      comment,
      date: today
    });
    
    // Reset form
    reviewForm.reset();
    document.querySelectorAll('.star').forEach(s => {
      s.textContent = '☆';
      s.classList.remove('active');
    });
    document.getElementById('reviewRating').value = '';
    
    // Update display
    displayReviews();
    
    alert('Thank you for your review!');
  });
});

// Contact form
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Show success message
    document.getElementById('contactSuccess').style.display = 'block';
    contactForm.style.display = 'none';
    
    // Reset after 3 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = 'block';
      document.getElementById('contactSuccess').style.display = 'none';
    }, 3000);
  });
});