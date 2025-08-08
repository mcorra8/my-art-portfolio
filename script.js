// Simple, robust gallery + work pages (relative paths, cache-busting)
(function () {
  const V = '25'; // bump if caches get sticky

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json failed to load');
    return res.json();
  }

  // Build a grid from images.json
  function renderGrid(el, items) {
    el.innerHTML = '';
    items.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'card';

      const a = document.createElement('a');
      a.href = `work.html?i=${i}&v=${V}`;

      const img = document.createElement('img');
      img.src = `images/${it.src}?v=${V}`;
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.style.opacity = '0.2';
        img.title = `Missing: images/${it.src}`;
      };

      a.appendChild(img);
      card.appendChild(a);
      el.appendChild(card);
    });
  }

  // Build the single work view
  function renderWork(el, items) {
    const params = new URLSearchParams(location.search);
    const idx = parseInt(params.get('i') || '0', 10);
    const it = items[idx];
    if (!it) return;

    el.innerHTML = '';
    const img = document.createElement('img');
    img.src = `images/${it.src}?v=${V}`;
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.loading = 'eager';
    img.onerror = () => {
      img.style.opacity = '0.2';
      img.title = `Missing: images/${it.src}`;
    };
    el.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();

      const grid = document.querySelector('#gallery-grid');
      if (grid) renderGrid(grid, items);

      const work = document.querySelector('.work');
      if (work) renderWork(work, items);
    } catch (e) {
      console.error(e);
    }
  });
})();
