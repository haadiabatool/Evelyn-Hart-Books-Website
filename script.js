// Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Helper function to sync Wishlist & Bag counts from localStorage later
    function updateNavbarCounters() {
      const wishlist = JSON.parse(localStorage.getItem('book_wishlist')) || [];
      const bag = JSON.parse(localStorage.getItem('book_cart')) || [];

      document.getElementById('wishlistCount').textContent = wishlist.length;
      document.getElementById('cartCount').textContent = bag.length;
    }

    document.addEventListener('DOMContentLoaded', updateNavbarCounters);


    window.handleContactSubmit = function(e) {
  e.preventDefault();
  
  // Clear form inputs
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactMessage').value = '';

  // Trigger toast notification
  if (typeof showToast === 'function') {
    showToast('✉️ Thank you! Your message has been sent to Evelyn.');
  }
};