import booksData from './books-data.js';

    let toastTimer;
    function showToast(text) {
      const toastMsg = document.getElementById('toastMsg');
      if (!toastMsg) return;
      toastMsg.textContent = text;
      toastMsg.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastMsg.classList.remove('show');
      }, 3000);
    }

    function updateCartBadge() {
      const cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      const badge = document.getElementById('navCartCount');
      if (badge) badge.textContent = cart.length;
    }

    function renderWishlist() {
      const container = document.getElementById('wishlistContainer');
      const emptyState = document.getElementById('emptyState');
      const metaBar = document.getElementById('metaBar');
      const countLabel = document.getElementById('savedCountLabel');

      const rawSaved = JSON.parse(localStorage.getItem('book_wishlist')) || [];
      const savedIds = rawSaved.map(id => Number(id));

      const allBooks = typeof booksData !== 'undefined' ? booksData : [];
      const wishlistBooks = allBooks.filter(book => savedIds.includes(Number(book.id)));

      countLabel.textContent = `${wishlistBooks.length} ${wishlistBooks.length === 1 ? 'Saved Book' : 'Saved Books'}`;

      if (wishlistBooks.length === 0) {
        container.innerHTML = '';
        metaBar.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      metaBar.style.display = 'flex';
      emptyState.style.display = 'none';

      container.innerHTML = wishlistBooks.map(book => `
        <article class="wishlist-item-card">
          <div class="item-img-box">
            <img src="${book.img}" alt="${book.title}">
          </div>
          <div class="item-details-box">
            <div>
              <div class="item-top-row">
                <span class="item-category">${book.category} &bull; ${book.year}</span>
                <span class="item-price">$${Number(book.price).toFixed(2)}</span>
              </div>
              <h2 class="item-title">${book.title}</h2>
              <p class="item-subtitle">"${book.subtitle}"</p>
              <p class="item-desc">${book.desc}</p>
              <div class="item-specs">
                <span>📖 ${book.pages}</span>
                <span>✨ Themes: ${book.themes}</span>
                <span>📚 Format: ${book.format || 'Paperback'}</span>
              </div>
            </div>

            <div class="item-actions">
              <button type="button" class="btn-move-bag" onclick="moveToCart(${book.id})">
                Add to Bag &mdash; $${Number(book.price).toFixed(2)}
              </button>
              <button type="button" class="btn-remove" onclick="removeFromWishlist(${book.id})">
                Remove
              </button>
            </div>
          </div>
        </article>
      `).join('');
    }

    window.removeFromWishlist = function(bookId) {
      let rawSaved = JSON.parse(localStorage.getItem('book_wishlist')) || [];
      let savedIds = rawSaved.map(id => Number(id)).filter(id => id !== Number(bookId));
      localStorage.setItem('book_wishlist', JSON.stringify(savedIds));
      renderWishlist();
      showToast('Removed from wishlist.');
    };

    window.clearWishlist = function() {
      localStorage.setItem('book_wishlist', JSON.stringify([]));
      renderWishlist();
      showToast('Wishlist cleared.');
    };

    window.moveToCart = function(bookId) {
      const book = booksData.find(b => Number(b.id) === Number(bookId));
      if (!book) return;

      const cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      cart.push({
        id: book.id,
        name: `${book.title} (${book.format || 'Paperback'})`,
        price: book.price,
        format: book.format || 'Paperback',
        img: book.img
      });
      localStorage.setItem('book_cart', JSON.stringify(cart));
      updateCartBadge();
      showToast(`🛍️ "${book.title}" added to your bag!`);
    };

    document.addEventListener('DOMContentLoaded', () => {
      updateCartBadge();
      renderWishlist();
    });