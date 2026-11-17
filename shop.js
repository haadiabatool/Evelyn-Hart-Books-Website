import booksData from './books-data.js'

document.addEventListener('DOMContentLoaded', () => {
  const booksGrid = document.getElementById('booksGrid');
  const searchInput = document.getElementById('bookSearchInput');
  const catCheckboxes = document.querySelectorAll('.cat-checkbox');
  const priceRange = document.getElementById('priceRange');
  const priceVal = document.getElementById('priceVal');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const viewAllWrapper = document.getElementById('viewAllWrapper');
  const toastMsg = document.getElementById('toastMsg');

  let selectedCategories = ['All'];
  let currentSearch = '';
  let maxPrice = 25;
  let showAllBooks = false;

  // Track selected format per book ID ('Paperback' or 'E-book')
  const selectedFormats = {};
  booksData.forEach(b => selectedFormats[b.id] = b.format || 'Paperback');

  // Helper: Toast Notification
  function showToast(text) {
    if (!toastMsg) return;
    toastMsg.textContent = text;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), 2600);
  }

  // Helper: Wishlist & Cart LocalStorage
  function getWishlist() {
    return JSON.parse(localStorage.getItem('book_wishlist')) || [];
  }

  function getCart() {
    return JSON.parse(localStorage.getItem('book_cart')) || [];
  }

  function syncNavbarBadges() {
    const wCount = document.getElementById('wishlistCount');
    const cCount = document.getElementById('cartCount');
    if (wCount) wCount.textContent = getWishlist().length;
    if (cCount) cCount.textContent = getCart().length;
  }

  // Calculate price based on Paperback vs E-book
  function getBookPrice(book, format) {
    return format === 'E-book' ? +(book.price - 5).toFixed(2) : book.price;
  }

  // Render Book Cards
  function renderBooks() {
    const wishlist = getWishlist();

    const filteredBooks = booksData.filter(book => {
      const activeFormat = selectedFormats[book.id];
      const displayPrice = getBookPrice(book, activeFormat);

      const matchesCategory = selectedCategories.includes('All') || 
        selectedCategories.some(cat => book.category.toLowerCase() === cat.toLowerCase());
      
      const q = currentSearch.toLowerCase();
      const matchesSearch = !q ||
        book.title.toLowerCase().includes(q) ||
        book.desc.toLowerCase().includes(q) ||
        book.themes.toLowerCase().includes(q) ||
        book.subtitle.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q);

      const matchesPrice = displayPrice <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    });

    const booksToDisplay = (showAllBooks || currentSearch !== '' || !selectedCategories.includes('All'))
      ? filteredBooks 
      : filteredBooks.slice(0, 6);

    if (viewAllWrapper) {
      if (filteredBooks.length <= 6 || showAllBooks || currentSearch !== '' || !selectedCategories.includes('All')) {
        viewAllWrapper.style.display = 'none';
      } else {
        viewAllWrapper.style.display = 'block';
      }
    }

    if (filteredBooks.length === 0) {
      booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem; background: #fff; border-radius: 10px; border: 1px solid var(--border-subtle);">
          <h3 style="margin-bottom: 0.5rem;">No matching books found</h3>
          <p style="opacity: 0.8;">Try searching another keyword, checking filters, or adjusting price.</p>
        </div>
      `;
      if (viewAllWrapper) viewAllWrapper.style.display = 'none';
      return;
    }

    booksGrid.innerHTML = booksToDisplay.map(book => {
      const isWishlisted = wishlist.some(item => item.id === book.id);
      const activeFormat = selectedFormats[book.id];
      const displayPrice = getBookPrice(book, activeFormat);
      const isFirstCard = book.id === 1;

      return `
        <article class="book-card" ${isFirstCard ? 'id="firstCollectionCard"' : ''}>
          <div class="book-cover-wrapper">
            <span class="book-year-badge">${book.year}</span>

            <!-- Top-Right Heart Button -->
            <button 
              type="button" 
              class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" 
              onclick="toggleWishlist(${book.id})" 
              aria-label="Add to Wishlist"
              title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
            >
              <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <div class="book-cover-frame" ${isFirstCard ? 'id="targetBookCover"' : ''}>
              <img src="${book.img}" alt="${book.title}">
            </div>
          </div>

          <div class="book-card-body">
            <span class="book-category-label">${book.category}</span>
            <h3 class="book-card-title">${book.title}</h3>
            <p class="book-card-desc">${book.desc}</p>

            <!-- Format Switcher & Price -->
            <div class="book-format-row">
              <div class="format-pills">
                <button 
                  type="button" 
                  class="format-pill ${activeFormat === 'Paperback' ? 'active' : ''}" 
                  onclick="switchFormat(${book.id}, 'Paperback')"
                >Paperback</button>
                <button 
                  type="button" 
                  class="format-pill ${activeFormat === 'E-book' ? 'active' : ''}" 
                  onclick="switchFormat(${book.id}, 'E-book')"
                >E-book</button>
              </div>
              <span class="book-price">$${displayPrice.toFixed(2)}</span>
            </div>

            <!-- Add to Cart & Quick View Modal Trigger -->
            <div class="book-card-actions">
              <button type="button" class="btn-add-cart" onclick="addBookToCart(${book.id})">Add to Cart</button>
              <button type="button" class="btn-quick-view" onclick="openBookModal(${book.id})">Quick View</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Switch Paperback / E-book format on card
  window.switchFormat = function(bookId, format) {
    selectedFormats[bookId] = format;
    renderBooks();
  };

  // Helper: Get Wishlist as array of numbers
  function getWishlist() {
    const raw = JSON.parse(localStorage.getItem('book_wishlist')) || [];
    return raw.map(id => Number(id));
  }

  // Helper: Get Cart
  function getCart() {
    return JSON.parse(localStorage.getItem('book_cart')) || [];
  }

  function syncNavbarBadges() {
    const wCount = document.getElementById('wishlistCount');
    const cCount = document.getElementById('cartCount');
    if (wCount) wCount.textContent = getWishlist().length;
    if (cCount) cCount.textContent = getCart().length;
  }

  // Toggle Wishlist Function (Robust & Clean)
  window.toggleWishlist = function(bookId) {
    let wishlist = getWishlist();
    const idNum = Number(bookId);

    if (wishlist.includes(idNum)) {
      wishlist = wishlist.filter(id => id !== idNum);
      if (typeof showToast === 'function') showToast('Removed from your wishlist.');
    } else {
      wishlist.push(idNum);
      if (typeof showToast === 'function') showToast('❤️ Saved to your wishlist!');
    }

    localStorage.setItem('book_wishlist', JSON.stringify(wishlist));

    // Update Navbar Badge Count immediately
    syncNavbarBadges();

    // Re-render shop cards if on main page to update heart fill color
    if (typeof renderBooks === 'function') {
      renderBooks();
    }
  };

  // Add to Cart
  window.addBookToCart = function(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;
    const format = selectedFormats[bookId] || 'Paperback';
    const finalPrice = getBookPrice(book, format);

    const cart = getCart();
    cart.push({
      id: book.id,
      name: `${book.title} (${format})`,
      price: finalPrice,
      format: format,
      img: book.img
    });

    localStorage.setItem('book_cart', JSON.stringify(cart));
    syncNavbarBadges();
    showToast(`🛍️ "${book.title}" (${format}) added to bag!`);
  };

  // Quick View Modal Open Function
  window.openBookModal = function(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const activeFormat = selectedFormats[bookId] || 'Paperback';
    const displayPrice = getBookPrice(book, activeFormat);

    const modalImg = document.getElementById('modalBookImg');
    const modalBody = document.getElementById('modalBookBody');
    const modalOverlay = document.getElementById('bookDetailsModal');

    if (modalImg) {
      modalImg.src = book.img;
    }

    if (modalBody) {
      modalBody.innerHTML = `
        <span class="section-eyebrow" style="margin-bottom:0.4rem; display:block;">${book.category} • ${book.year}</span>
        <h2 style="font-size:1.8rem; margin-bottom:0.35rem; color:var(--primary-color);">${book.title}</h2>
        <p style="font-family:var(--font-heading); font-style:italic; color:var(--secondary-color); margin-bottom:1rem;">"${book.subtitle}"</p>
        <p style="font-size:0.95rem; line-height:1.7; margin-bottom:1rem; color:var(--text-primary);">${book.desc}</p>
        <div class="modal-meta-tags" style="display:flex; gap:1.2rem; font-size:0.8rem; color:var(--secondary-color); font-weight:600;">
          <span>📖 ${book.pages}</span>
          <span>✨ Themes: ${book.themes}</span>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin: 1.25rem 0; padding-top:1rem; border-top:1px solid var(--border-subtle);">
          <span style="font-family:var(--font-label); font-size:0.8rem; font-weight:600;">FORMAT: ${activeFormat.toUpperCase()}</span>
          <span style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; color:var(--primary-color);">$${displayPrice.toFixed(2)}</span>
        </div>
        <button class="btn-add-cart" style="width:100%; padding:0.95rem;" onclick="addBookToCart(${book.id}); closeBookModal();">
          Add to Bag — $${displayPrice.toFixed(2)}
        </button>
      `;
    }

    if (modalOverlay) {
      modalOverlay.classList.add('open');
    }
  };

  // Quick View Modal Close Function
  window.closeBookModal = function() {
    const modalOverlay = document.getElementById('bookDetailsModal');
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
    }
  };

  // Sidebar Checkboxes Event Handler
  catCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.value === 'All') {
        if (cb.checked) {
          catCheckboxes.forEach(other => { if(other.value !== 'All') other.checked = false; });
          selectedCategories = ['All'];
        }
      } else {
        const allBox = document.querySelector('.cat-checkbox[value="All"]');
        if (allBox) allBox.checked = false;
        
        selectedCategories = Array.from(catCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);

        if (selectedCategories.length === 0) {
          if (allBox) allBox.checked = true;
          selectedCategories = ['All'];
        }
      }
      showAllBooks = true;
      renderBooks();
    });
  });

  // Price Range Slider Event
  if (priceRange) {
    priceRange.value = maxPrice;
    if (priceVal) priceVal.textContent = maxPrice.toFixed(2);

    priceRange.addEventListener('input', (e) => {
      maxPrice = parseFloat(e.target.value);
      if (priceVal) priceVal.textContent = maxPrice.toFixed(2);
      renderBooks();
    });
  }

  // Live Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderBooks();
    });
  }

  // View All Button Event
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      showAllBooks = true;
      renderBooks();
    });
  }

  // Initial Render
  renderBooks();
  syncNavbarBadges();

  
});


  
  