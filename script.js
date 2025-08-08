// Minimal, robust gallery + single-work loader (relative paths only)
(function () {
  const V = '27'; // change to force refresh

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

  const baseNoExt = (n) => (n.lastIndexOf('.') > -1 ? n.slice(0, n.lastIndexOf('.')) : n);

  function setWithFallback(img, src) {
    const base = baseNoExt(src);
    const tries = [src, `${base}.jpg`, `${base}.jpeg`, `${base}.JPG`];
    let i = 0;
    const go = () => {
      if (i >= tries.length) return;
      img.src = `images/${tries[i]}?v=${V}`;
      img.onerror = () => { i += 1; go(); };
    };
    go();
  }

  function renderGrid(el, items) {
    el.innerHTML = '';
    items.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'card';

      const a = document.createElement('a');
      a.href = `work.html?i=${i}&v=${V}`;

      const img = document.createElement('img');
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      setWithFallback(img, it.src);

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
    img.alt = it.alt || `Painting ${idx + 1}`;
    setWithFallback(img, it.src);
    el.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const items = await loadList();

    // home page mini grid — show first 6
    const selected = document.querySelector('#selected-grid');
    if (selected) renderGrid(selected, items.slice(0, 6));

    // full gallery
    const grid = document.querySelector('#gallery-grid');
    if (grid) renderGrid(grid, items);

    // single work
    const work = document.querySelector('.work');
    if (work) renderWork(work, items);
  });
})();
