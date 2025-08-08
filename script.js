// Gallery + single work page with smart extension fallback + cache busting
(function () {
  const V = '20'; // bump this if you still see caching

  async function loadList() {
    const res = await fetch(`/images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json failed to load');
    return res.json();
  }

  // Try .jpeg, then .jpg, then .JPG automatically if the first 404s
  function setSrcWithFallback(img, basePathNoExt) {
    const attempts = [
      `${basePathNoExt}.jpeg`,
      `${basePathNoExt}.jpg`,
      `${basePathNoExt}.JPG`
    ];
    let i = 0;
    const tryNext = () => {
      if (i >= attempts.length) return;
      img.src = `${attempts[i]}?v=${V}`;
      img.onerror = () => {
        i += 1;
        if (i < attempts.length) tryNext();
      };
    };
    tryNext();
  }

  function filenameWithoutExt(name) {
    const p = name.lastIndexOf('.');
    return p > -1 ? name.slice(0, p) : name;
  }

  function renderGrid(selector, items) {
    const grid = document.querySelector(selector) || document.querySelector('.gallery-grid') || document.querySelector('#gallery-grid');
    if (!grid || (selector && !document.querySelector(selector))) return; // respect explicit selector if given
    grid.innerHTML = '';

    items.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'card';

      const a = document.createElement('a');
      a.href = `/work.html?i=${i}&v=${V}`;

      const img = document.createElement('img');
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      setSrcWithFallback(img, `/images/${filenameWithoutExt(it.src)}`);

      a.appendChild(img);
      card.appendChild(a);
      grid.appendChild(card);
    });
  }

  function renderWork(items) {
    const wrap = document.querySelector('.work');
    if (!wrap) return;

    const params = new URLSearchParams(location.search);
    const idx = parseInt(params.get('i') || '0', 10);
    const it = items[idx];
    if (!it) return;

    const img = document.createElement('img');
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.loading = 'eager';

    setSrcWithFallback(img, `/images/${filenameWithoutExt(it.src)}`);

    wrap.innerHTML = '';
    wrap.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();
      // Home page (optional featured grid)
      renderGrid('#selected-grid', items);
      // Gallery page
      renderGrid('#gallery-grid', items);
      // Single work page
      renderWork(items);
    } catch (e) {
      console.error(e);
    }
  });
})();
