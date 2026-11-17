// Open Quick View Modal function (Updated & Safe)
  window.openQuickView = function(bookId) {
    if (typeof booksData === 'undefined') return;

    // Try finding by ID (supporting both number and string comparison)
    let book = booksData.find(b => Number(b.id) === Number(bookId));

    // Fallback: If ID not found, default to the first book or the specific featured book
    if (!book) {
      book = booksData.find(b => b.title.toLowerCase().includes("quiet mind")) || booksData[0];
    }
    if (!book) return;

    const activeFormat = (typeof selectedFormats !== 'undefined' && selectedFormats[book.id]) ? selectedFormats[book.id] : 'Paperback';
    const displayPrice = activeFormat === 'E-book' ? +(book.price - 5).toFixed(2) : book.price;

    modalImg.src = book.img;
    modalBody.innerHTML = `
      <span style="font-family:var(--font-label); font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:var(--secondary-color); margin-bottom:0.4rem; display:block;">
        ${book.category} • ${book.year}
      </span>
      <h2 style="font-family:var(--font-heading); font-size:1.8rem; font-weight:700; color:var(--primary-color); margin-bottom:0.35rem;">
        ${book.title}
      </h2>
      <p style="font-family:var(--font-heading); font-style:italic; color:var(--secondary-color); margin-bottom:1rem; font-size:0.95rem;">
        "${book.subtitle}"
      </p>
      <p style="font-family:var(--font-body); font-size:0.92rem; line-height:1.7; color:var(--text-primary); margin-bottom:1rem; opacity:0.9;">
        ${book.desc}
      </p>
      <div style="display:flex; gap:1.2rem; font-family:var(--font-label); font-size:0.75rem; font-weight:600; color:var(--secondary-color); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:1rem;">
        <span>📖 ${book.pages}</span>
        <span>✨ Themes: ${book.themes}</span>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin: 1rem 0; padding-top:0.85rem; border-top:1px solid var(--border-subtle);">
        <span style="font-family:var(--font-label); font-size:0.78rem; font-weight:600;">FORMAT: ${activeFormat.toUpperCase()}</span>
        <span style="font-family:var(--font-heading); font-size:1.5rem; font-weight:700; color:var(--primary-color);">$${displayPrice.toFixed(2)}</span>
      </div>
      <button type="button" class="btn-add-cart" style="width:100%; padding:0.9rem;" onclick="addBookToCart(${book.id}); closeQuickView();">
        Add to Bag — $${displayPrice.toFixed(2)}
      </button>
    `;

    modalOverlay.classList.add('active');
  };


  document.addEventListener('DOMContentLoaded', () => {
  // Inject Full Story Modal dynamically
  const storyModalHTML = `
    <div class="story-modal-overlay" id="fullStoryModal">
      <div class="story-modal-box">
        <button type="button" class="story-modal-close" onclick="closeFullStoryModal()">&times;</button>
        <span style="font-family:var(--font-label); font-size:0.75srem; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:var(--secondary-color); display:block; margin-bottom:0.5rem;">THE AUTHOR'S JOURNEY</span>
        <h2 style="font-family:var(--font-heading); font-size:2.2rem; font-weight:700; color:var(--primary-color); margin-bottom:1.5rem;">Behind the Pages with Evelyn Hart</h2>
        
        <p style="font-family:var(--font-body); font-size:0.98rem; line-height:1.8; color:var(--text-primary); margin-bottom:1.25rem;">
          Every writer remembers the exact moment words stopped being just letters on a page and started becoming a sanctuary. For Evelyn Hart, that realization came in quiet rooms illuminated only by desk lamps, surrounded by stacks of worn-out journals.
        </p>
        <p style="font-family:var(--font-body); font-size:0.98rem; line-height:1.8; color:var(--text-primary); margin-bottom:1.25rem;">
          What began as personal reflections on mindfulness, inner peace, and navigating the chaotic speed of modern life gradually blossomed into published works. Each book in this collection is built upon the belief that slowing down is not a luxury, but a necessity for human growth.
        </p>
        <p style="font-family:var(--font-body); font-size:0.98rem; line-height:1.8; color:var(--text-primary); margin-bottom:1.5rem;">
          "Writing is my way of holding space for others," Evelyn shares. "If even one person finds clarity or comfort in these words, then the ink has served its true purpose."
        </p>
        
        <button type="button" class="btn-primary-cta" style="width:100%; padding:0.9rem;" onclick="closeFullStoryModal()">Close Story</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', storyModalHTML);
});

window.openFullStoryModal = function() {
  const modal = document.getElementById('fullStoryModal');
  if (modal) modal.classList.add('active');
};

window.closeFullStoryModal = function() {
  const modal = document.getElementById('fullStoryModal');
  if (modal) modal.classList.remove('active');
};

// Close on background click or ESC key
window.addEventListener('click', (e) => {
  const modal = document.getElementById('fullStoryModal');
  if (e.target === modal) closeFullStoryModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFullStoryModal();
});