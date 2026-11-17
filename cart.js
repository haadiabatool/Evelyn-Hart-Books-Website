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

    function updateNavBadges() {
      const wishlist = JSON.parse(localStorage.getItem('book_wishlist')) || [];
      const wBadge = document.getElementById('navWishlistCount');
      if (wBadge) wBadge.textContent = wishlist.length;
    }

    function renderCart() {
      const cartList = document.getElementById('cartItemsList');
      const summaryBox = document.getElementById('cartSummaryBox');
      const emptyState = document.getElementById('emptyCartState');
      const selectBar = document.getElementById('selectBarContainer');
      
      const subtotalEl = document.getElementById('summarySubtotal');
      const shippingEl = document.getElementById('summaryShipping');
      const totalEl = document.getElementById('summaryTotal');
      const selectAllCb = document.getElementById('selectAllCheckbox');

      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];

      cart = cart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        selected: item.selected !== undefined ? item.selected : true
      }));

      updateNavBadges();
      renderOrderHistory();

      if (cart.length === 0) {
        if (selectBar) selectBar.style.display = 'none';
        cartList.style.display = 'none';
        summaryBox.style.display = 'none';
        emptyState.style.display = 'block';
        return;
      }

      if (selectBar) selectBar.style.display = 'flex';
      cartList.style.display = 'flex';
      summaryBox.style.display = 'block';
      emptyState.style.display = 'none';

      const allSelected = cart.every(item => item.selected);
      if (selectAllCb) selectAllCb.checked = allSelected;

      let subtotal = 0;
      let selectedCount = 0;

      cartList.innerHTML = cart.map((item, index) => {
        if (item.selected) {
          subtotal += Number(item.price || 0) * (item.quantity || 1);
          selectedCount += (item.quantity || 1);
        }
        return `
          <div class="cart-item-card">
            <input type="checkbox" class="cart-item-checkbox" ${item.selected ? 'checked' : ''} onchange="toggleItemSelect(${index})">
            <img src="${item.img || 'assets/placeholder.jpeg'}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <span class="cart-item-format">${item.format || 'Paperback'} Edition</span>
              <h3 class="cart-item-title">${item.name}</h3>
              <div class="cart-item-price">$${Number(item.price || 0).toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
              <button type="button" class="btn-remove-item" onclick="removeItem(${index})">Remove</button>
              <div class="quantity-controls">
                <button type="button" class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                <span class="qty-display">${item.quantity || 1}</span>
                <button type="button" class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      const shipping = selectedCount > 0 ? 4.50 : 0.00;
      const total = subtotal + shipping;

      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      shippingEl.textContent = selectedCount > 0 ? `$${shipping.toFixed(2)}` : `$0.00`;
      totalEl.textContent = `$${total.toFixed(2)}`;
    }

    window.toggleItemSelect = function(index) {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      if (!cart[index]) return;

      cart[index].selected = cart[index].selected === undefined ? false : !cart[index].selected;
      localStorage.setItem('book_cart', JSON.stringify(cart));
      renderCart();
    };

    window.toggleSelectAll = function(masterCheckbox) {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      const isChecked = masterCheckbox.checked;

      cart = cart.map(item => ({
        ...item,
        selected: isChecked
      }));

      localStorage.setItem('book_cart', JSON.stringify(cart));
      renderCart();
    };

    window.updateQty = function(index, change) {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      if (!cart[index]) return;

      cart[index].quantity = (cart[index].quantity || 1) + change;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }

      localStorage.setItem('book_cart', JSON.stringify(cart));
      renderCart();
    };

    window.removeItem = function(index) {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      cart.splice(index, 1);
      localStorage.setItem('book_cart', JSON.stringify(cart));
      renderCart();
      showToast('Item removed from bag.');
    };

    window.handleCheckoutClick = function() {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      if (cart.every(item => !item.selected)) {
        showToast('⚠️ Please select at least one item to checkout.');
        return;
      }

      const currentUser = localStorage.getItem('book_user');
      if (!currentUser) {
        document.getElementById('authModal').classList.add('active');
      } else {
        processOrder(JSON.parse(currentUser));
      }
    };

    window.closeAuthModal = function() {
      document.getElementById('authModal').classList.remove('active');
    };

    window.handleAuthSubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('authName').value;
      const email = document.getElementById('authEmail').value;

      const userObj = { name, email };
      localStorage.setItem('book_user', JSON.stringify(userObj));
      closeAuthModal();
      processOrder(userObj);
    };

    function processOrder(user) {
      let cart = JSON.parse(localStorage.getItem('book_cart')) || [];
      const selectedItems = cart.filter(item => item.selected);
      const remainingItems = cart.filter(item => !item.selected);

      if (selectedItems.length === 0) return;

      let subtotal = selectedItems.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);
      let shipping = 4.50;
      let total = subtotal + shipping;

      const newOrder = {
        id: 'EH-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        user: user.name,
        email: user.email,
        items: selectedItems,
        total: total.toFixed(2)
      };

      let history = JSON.parse(localStorage.getItem('book_orders')) || [];
      history.unshift(newOrder);
      localStorage.setItem('book_orders', JSON.stringify(history));

      localStorage.setItem('book_cart', JSON.stringify(remainingItems));

      showToast(`🎉 Order #${newOrder.id} placed successfully!`);
      renderCart();
    }

    function renderOrderHistory() {
      const historySection = document.getElementById('orderHistorySection');
      const historyList = document.getElementById('historyListContainer');
      let history = JSON.parse(localStorage.getItem('book_orders')) || [];

      if (history.length === 0) {
        historySection.style.display = 'none';
        return;
      }

      historySection.style.display = 'block';
      historyList.innerHTML = history.map(order => {
        let orderItems = order.items || [];
        return `
          <div class="history-card">
            <div class="history-header">
              <span>Order ID: <strong>#${order.id || '000000'}</strong></span>
              <span>Date: ${order.date || 'Recent'}</span>
              <span>Customer: ${order.user || 'Guest'}</span>
            </div>
            <div class="history-items-row">
              ${orderItems.map(i => {
                let itemPrice = Number(i.price || 0);
                let itemQty = Number(i.quantity || 1);
                let itemTotal = itemPrice * itemQty;
                return `
                  <div class="history-item-badge">
                    <strong>${i.name || 'Book Title'}</strong> (${i.format || 'Paperback'}) &times; ${itemQty} &mdash; <strong>$${itemTotal.toFixed(2)}</strong>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="history-footer">
              <span style="color: var(--secondary-color); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em;">Status: Confirmed & Shipping Soon</span>
              <span style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary-color);">Total Paid: $${order.total || '0.00'}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderCart();
    });