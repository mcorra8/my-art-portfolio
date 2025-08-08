 /* Gallery + single-work (reads images.json, no hard-coded names) */
(function () {
  const V = '33'; // bump to bust cache

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

  function setWithFallback(img, filename) {
    // exact name from JSON first, then common extension fallbacks
    const dot = filename.lastIndexOf('.');
    const base = dot > -1 ? filename.slice(0, dot) : filename;
    const tries = [filename, `${base}.jpg`, `${base}.jpeg`, `${base}.JPG`];
    let i = 0;
    const go = () => {
      if (i >= tries.length) return;
      img.src = `images/${tries[i]}?v=${V}`;
      img.onerror = () => { i += 1; go(); };
    };
    go();
  }

  function renderGrid(target, items) {
    if (!target) return;
    target.innerHTML = '';
    items.forEach((it, i) => {
      const a = document.createElement('a');
      a.className = 'card';
      a.href = `work.html?i=${i}&v=${V}`;
      const img = document.createElement('img');
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      setWithFallback(img, it.src);
      a.appendChild(img);
      target.appendChild(a);
    });
  }

  function renderWork(target, items) {
    if (!target) return;
    const idx = parseInt(new URLSearchParams(location.search).get('i') || '0', 10);
    const it = items[idx];
    target.innerHTML = '';
    if (!it) { target.textContent = 'Artwork not found.'; return; }
    const img = document.createElement('img');
    img.alt = it.alt || `Painting ${idx + 1}`;
    setWithFallback(img, it.src);
    target.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();
      renderGrid(document.querySelector('#selected-grid'), items.slice(0, 6)); // home preview
      renderGrid(document.querySelector('#gallery-grid'), items);              // gallery
      renderWork(document.querySelector('.work'), items);                      // large view
    } catch (e) {
      console.error(e);
    }
  });
})();
