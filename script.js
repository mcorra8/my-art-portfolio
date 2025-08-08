/* Gallery + single-work (reads images.json, shows which file is used) */
(function () {
  const V = '34'; // bump to bust cache

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

  function setWithFallback(img, filename, onResolved) {
    const dot = filename.lastIndexOf('.');
    const base = dot > -1 ? filename.slice(0, dot) : filename;
    const tries = [filename, `${base}.jpg`, `${base}.jpeg`, `${base}.JPG`];
    let i = 0;
    const tryNext = () => {
      if (i >= tries.length) return;
      const attempt = `images/${tries[i]}?v=${V}`;
      img.src = attempt;
      img.onerror = () => { i += 1; tryNext(); };
      img.onload = () => onResolved && onResolved(attempt);
    };
    tryNext();
  }

  function renderGrid(target, items) {
    if (!target) return;
    target.innerHTML = '';
    items.forEach((it, i) => {
      const a = document.createElement('a');
      a.className = 'card';
      a.href = `work.html?i=${i}&v=${V}`; // 0-based index

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

    const params = new URLSearchParams(location.search);
    const idx = parseInt(params.get('i') || '0', 10); // 0-based
    const it = items[idx];

    target.innerHTML = '';
    if (!it) { target.textContent = 'Artwork not found.'; return; }

    // Debug label so we can SEE the filename being used
    const label = document.createElement('div');
    label.style.cssText = 'margin:8px 0 16px;color:#777;font:14px/1.4 system-ui';
    label.textContent = `Loading: images/${it.src}`;

    const img = document.createElement('img');
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.style.maxWidth = '1100px';
    img.style.width = '100%';
    img.style.display = 'block';
    img.style.margin = '0 auto';

    // When fallback resolves, update the label to the actual URL loaded
    setWithFallback(img, it.src, (resolvedUrl) => { label.textContent = `Loaded: ${resolvedUrl}`; });

    target.appendChild(label);
    target.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();

      const homeGrid = document.querySelector('#selected-grid');
      if (homeGrid) renderGrid(homeGrid, items.slice(0, 6));

      const galleryGrid = document.querySelector('#gallery-grid') || document.querySelector('#galleryGrid');
      if (galleryGrid) renderGrid(galleryGrid, items);

      const workWrap = document.querySelector('.work');
      if (workWrap) renderWork(workWrap, items);
    } catch (e) {
      console.error(e);
    }
  });
})();
