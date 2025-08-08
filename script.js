// Minimal gallery loader (no lightbox yet)
document.addEventListener('DOMContentLoaded', async () => {
  async function getItems() {
    const res = await fetch('/images/images.json?v=2', { cache: 'no-store' });
    return await res.json();
  }

  function render(selector, items) {
    const grid = document.querySelector(selector);
    if (!grid) return; // page might not have this grid
    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'card';
      const img = document.createElement('img');
      img.src = '/images/' + it.src;
      img.alt = it.alt || it.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      const meta = document.createElement('div');
      meta.className = 'meta';
      const left = document.createElement('div');
      left.textContent = it.title || 'Untitled';
      const right = document.createElement('div');
      right.textContent = it.year || '';
      meta.append(left, right);
      card.append(img, meta);
      grid.append(card);
    });
  }

  try {
    const items = await getItems();
    render('#gallery-grid', items);   // gallery.html
    render('#selected-grid', items);  // index.html (home)
  } catch (e) {
    console.error('Could not load images.json', e);
  }
});
