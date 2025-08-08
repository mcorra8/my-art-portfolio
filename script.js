// Minimal, explicit loader (exact filenames, relative paths)
(function () {
  const V = '28'; // bump to bust caches

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

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
        console.error('Missing thumbnail:', `images/${it.src}`);
        img.style.opacity = '0.25';
        img.title = `Missing: images/${it.src}`;
      };

      a.appendChild(img);
      card.appendChild(a);
      el.appendChild(card);
    });
  }

  function renderWork(el, items) {
    const idx = parseInt(new URLSearchParams(location.search).get('i') || '0', 10);
    const it = items[idx];
    if (!it) { el.textContent = 'Artwork not found.'; return; }

    el.innerHTML = '';
    const img = document.createElement('img');
    img.src = `images/${it.src}?v=${V}`;
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.loading = 'eager';
    img.onerror = () => {
      console.error('Missing large image:', `images/${it.src}`);
      el.innerHTML = `Image missing: images/${it.src}`;
    };
    el.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const items = await loadList();

    const homeGrid = document.querySelector('#selected-grid');
    if (homeGrid) renderGrid(homeGrid, items.slice(0, 6));

    const galleryGrid = document.querySelector('#gallery-grid');
    if (galleryGrid) renderGrid(galleryGrid, items);

    const work = document.querySelector('.work');
    if (work) renderWork(work, items);
  });
})();
