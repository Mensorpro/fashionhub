/* ═══════════════════════════════════════════
   MAISON — Curated Fashion
   Journey Interactions
   ═══════════════════════════════════════════ */

// ── STATE ──
const state = {
  cart: [],
  currentPiece: null,
  selectedSize: 'M',
  galleryPosition: 0,
  testimonialIndex: 0,
};

// ── ELEMENTS ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader').classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
  }, 1800);
});

// ── CUSTOM CURSOR ──
const cursor = $('.custom-cursor');
const follower = $('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

// Smooth follower
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
document.addEventListener('mouseover', (e) => {
  const interactive = e.target.closest('a, button, .gallery-card, input, select, textarea');
  if (interactive) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', (e) => {
  const interactive = e.target.closest('a, button, .gallery-card, input, select, textarea');
  if (interactive) document.body.classList.remove('cursor-hover');
});

// Hide custom cursor on touch devices
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  follower.style.display = 'none';
  document.body.style.cursor = 'auto';
  $$('button, a').forEach(el => el.style.cursor = 'pointer');
}

// ── NAVIGATION ──
const nav = $('#nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 80);
  lastScroll = scrollY;
});

// Mobile menu
const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

$$('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ── REVEAL ON SCROLL (Intersection Observer) ──
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the animations
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ── PARALLAX ──
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = $('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - scrollY / 700;
  }
});

// ── GALLERY (Horizontal Scroll) ──
const galleryTrack = $('#galleryTrack');
const progressBar = $('#galleryProgress');
let galleryDrag = false, galleryStartX = 0, galleryScrollStart = 0;

function getMaxScroll() {
  return galleryTrack.scrollWidth - galleryTrack.parentElement.clientWidth;
}

function updateGallery() {
  const max = getMaxScroll();
  const clamped = Math.max(0, Math.min(state.galleryPosition, max));
  state.galleryPosition = clamped;
  galleryTrack.style.transform = `translateX(-${clamped}px)`;
  
  const progress = max > 0 ? (clamped / max) * 100 : 0;
  progressBar.style.width = `${Math.max(10, progress)}%`;
}

$('#galleryLeft').addEventListener('click', () => {
  const cardWidth = galleryTrack.querySelector('.gallery-card').offsetWidth + 32;
  state.galleryPosition -= cardWidth;
  updateGallery();
});

$('#galleryRight').addEventListener('click', () => {
  const cardWidth = galleryTrack.querySelector('.gallery-card').offsetWidth + 32;
  state.galleryPosition += cardWidth;
  updateGallery();
});

// Drag to scroll
galleryTrack.addEventListener('mousedown', (e) => {
  galleryDrag = true;
  galleryStartX = e.clientX;
  galleryScrollStart = state.galleryPosition;
  galleryTrack.classList.add('grabbing');
});

document.addEventListener('mousemove', (e) => {
  if (!galleryDrag) return;
  const diff = galleryStartX - e.clientX;
  state.galleryPosition = galleryScrollStart + diff;
  updateGallery();
});

document.addEventListener('mouseup', () => {
  galleryDrag = false;
  galleryTrack.classList.remove('grabbing');
});

// Touch support for gallery
galleryTrack.addEventListener('touchstart', (e) => {
  galleryDrag = true;
  galleryStartX = e.touches[0].clientX;
  galleryScrollStart = state.galleryPosition;
});

galleryTrack.addEventListener('touchmove', (e) => {
  if (!galleryDrag) return;
  const diff = galleryStartX - e.touches[0].clientX;
  state.galleryPosition = galleryScrollStart + diff;
  updateGallery();
});

galleryTrack.addEventListener('touchend', () => { galleryDrag = false; });

// ── PIECE MODAL ──
const modal = $('#pieceModal');

const pieceColors = {
  1: 'dark', 2: 'warm', 3: 'cool',
  4: 'earth', 5: 'light', 6: 'dark'
};

const pieceNumerals = {
  1: 'I', 2: 'II', 3: 'III',
  4: 'IV', 5: 'V', 6: 'VI'
};

const pieceImages = {
  1: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=900&fit=crop&q=80',
  2: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&q=80',
  3: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=900&fit=crop&q=80',
  4: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=900&fit=crop&q=80',
  5: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop&q=80',
  6: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=900&fit=crop&q=80',
};

$$('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.gallery-card');
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = card.dataset.price;

    state.currentPiece = { id, name, price };

    $('#modalTitle').textContent = name;
    $('#modalPrice').textContent = `$${price}`;

    const modalImg = $('#modalImg');
    modalImg.src = pieceImages[id] || '';
    modalImg.alt = name;

    const modalContainer = $('#modalImage');
    modalContainer.className = `img-placeholder ${pieceColors[id] || ''}`;
    modalContainer.dataset.label = name;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

$('#modalClose').addEventListener('click', closeModal);
$('.modal-backdrop').addEventListener('click', closeModal);

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Size selection
$$('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedSize = btn.dataset.size;
  });
});

// ── ADD TO BAG ──
$('#addToBag').addEventListener('click', () => {
  if (!state.currentPiece) return;

  const item = {
    ...state.currentPiece,
    size: state.selectedSize,
    uid: Date.now()
  };

  state.cart.push(item);
  updateCart();
  closeModal();
  showToast(`${item.name} added to bag`);
});

// ── CART ──
function updateCart() {
  const count = state.cart.length;
  $('#cartCount').textContent = count;
  
  const cartItems = $('#cartItems');
  const cartFooter = $('#cartFooter');

  if (count === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your bag is empty</p>';
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';

  let total = 0;
  cartItems.innerHTML = state.cart.map(item => {
    total += parseInt(item.price);
    const colorClass = pieceColors[item.id] || '';
    return `
      <div class="cart-item" data-uid="${item.uid}">
        <div class="cart-item-color" style="background: ${getGradient(colorClass)}"></div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Size ${item.size} — $${item.price}</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.uid})">Remove</button>
      </div>
    `;
  }).join('');

  $('#cartTotal').textContent = `$${total}`;
}

function getGradient(colorClass) {
  const gradients = {
    dark: 'linear-gradient(145deg, #2a2520, #1a1714)',
    warm: 'linear-gradient(145deg, #d4b896, #c4a882)',
    cool: 'linear-gradient(145deg, #9aacb8, #7a8c98)',
    earth: 'linear-gradient(145deg, #b8856a, #a07558)',
    light: 'linear-gradient(145deg, #ece6de, #ddd7cf)',
  };
  return gradients[colorClass] || 'linear-gradient(145deg, #d4cdc4, #c4bdb4)';
}

window.removeFromCart = function(uid) {
  state.cart = state.cart.filter(i => i.uid !== uid);
  updateCart();
};

// Cart sidebar toggle
$('#cartBtn').addEventListener('click', () => {
  $('#cartSidebar').classList.add('open');
  $('#cartOverlay').classList.add('open');
});

$('#cartClose').addEventListener('click', closeCart);
$('#cartOverlay').addEventListener('click', closeCart);

function closeCart() {
  $('#cartSidebar').classList.remove('open');
  $('#cartOverlay').classList.remove('open');
}

$('#checkoutBtn').addEventListener('click', () => {
  closeCart();
  // Scroll to order form
  setTimeout(() => {
    document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
  }, 300);
});

// ── TESTIMONIALS ──
function showTestimonial(index) {
  const testimonials = $$('.testimonial');
  const dots = $$('.dot');

  testimonials.forEach(t => t.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  testimonials[index].classList.add('active');
  dots[index].classList.add('active');
  state.testimonialIndex = index;
}

$$('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    showTestimonial(parseInt(dot.dataset.index));
  });
});

// Auto-rotate testimonials
setInterval(() => {
  const next = (state.testimonialIndex + 1) % $$('.testimonial').length;
  showTestimonial(next);
}, 5000);

// ── ORDER FORM ──
$('#orderForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Include cart items in the order
  data.cartItems = state.cart.map(i => `${i.name} (${i.size})`).join(', ');

  console.log('Order submitted:', data);

  // Show success
  form.classList.add('success');
  form.innerHTML = `
    <div class="success-message">
      <h3>Thank You, ${data.name || 'Dear'}!</h3>
      <p>Your inquiry has been received. We'll be in touch within 24 hours to discuss your vision.</p>
    </div>
  `;

  showToast('Inquiry sent successfully!');

  // Clear cart
  state.cart = [];
  updateCart();
});

// ── TOAST ──
function showToast(msg) {
  const toast = $('#toast');
  $('#toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── SMOOTH ANCHOR LINKS ──
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open')) closeModal();
    if ($('#cartSidebar').classList.contains('open')) closeCart();
    if (mobileMenu.classList.contains('open')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  }
});

// ── RESIZE HANDLER ──
window.addEventListener('resize', () => {
  updateGallery();
});

// Init gallery progress
updateGallery();
