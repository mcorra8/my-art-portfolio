// Gallery + single work page with exact filenames AND .jpg/.jpeg/.JPG fallback
(function () {
  const V = '29'; // bump this to force refresh any time

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

  // Given a src from images.json, try that exact file, then fallbacks
  function setWithFallback(img, srcFromJson) {
    // strip extension
    const dot = srcFromJson.lastIndexOf('.');
    const base = dot > -1 ? srcFromJson.slice(0, dot) : srcFromJson;

    const tries = [
      srcFromJson,          // whatever JSON says
      `${base}.jpg`,
      `${base}.jpeg`,
      `${base}.JPG`
    ];

    let i = 0;
    const go = () => {
      if (i >= tries.length) return;
      img.src = `images/${tries[i]}?v=${V}`;
      img.onerror = () => { i += 1; go(); };
    };
    go();
  }

  function renderGrid(el, items) {
    if (!el) return;
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
    if (!el) return;
    const params = new URLSearchParams(location.search);
    const idx = parseInt(params.get('i') || '0', 10);
    const it = items[idx];
    if (!it) { el.textContent = 'Artwork not found.'; return; }

    el.innerHTML = '';
    const img = document.createElement('img');
    img.alt = it.alt || `Painting ${idx + 1}`;
    setWithFallback(img, it.src); // same fallback logic for large image
    el.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const items = await loadList();

    // Home preview grid (first 6)
    renderGrid(document.querySelector('#selected-grid'), items.slice(0, 6));

    // Full gallery
    renderGrid(document.querySelector('#gallery-grid'), items);

    // Single work page
    renderWork(document.querySelector('.work'), items);
  });
})();
