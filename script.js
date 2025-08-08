// Gallery + single work page renderer (cache-busted)
(function () {
  const V = '17'; // bump this if you still see caching

  async function loadList() {
    const res = await fetch(`/images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json failed to load');
    return res.json();
  }

  function renderGrid(selector, items) {
    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'card';

      const a = document.createElement('a');
      a.href = `/work.html?i=${i}&v=${V}`;

      const img = document.createElement('img');
      // add cache-buster to the image file itself
      img.src = `/images/${it.src}?v=${V}`;
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      // helpful: if an image fails, show which filename broke
      img.addEventListener('error', () => {
        console.error('Missing file:', it.src);
        img.style.opacity = '0.2';
        img.title = `Missing: ${it.src}`;
      });

      a.appendChild(img);
      card.appendChild(a);
      grid.appendChild(card);
    });
  }

  function renderWork(items) {
    const wrap = document.querySelector('.work');
    if (!wrap) return;

    const idx = parseInt(new URLSearchParams(location.search).get('i') || '0', 10);
    const it = items[idx];
    if (!it) return;

    const img = document.createElement('img');
    img.src = `/images/${it.src}?v=${V}`;
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.loading = 'eager';

    img.addEventListener('error', () => {
      console.error('Missing file (work page):', it.src);
    });

    wrap.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();
      renderGrid('#selected-grid', items); // home
      renderGrid('#gallery-grid', items);  // gallery
      renderWork(items);                   // work page
    } catch (e) {
      console.error(e);
    }
  });
})();
