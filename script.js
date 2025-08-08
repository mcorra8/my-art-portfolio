// Gallery + single work page with smart extension fallback
(function () {
  const V = '18'; // bump if you still see cached content

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
    // strip last dot + extension
    const p = name.lastIndexOf('.');
    return p > -1 ? name.slice(0, p) : name;
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
      img.alt = it.alt || `Painting ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      // set src with fallback for extension mismatches
      setSrcWithFallback(img, `/images/${filenameWithoutExt(it.src)}`);

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
    img.alt = it.alt || `Painting ${idx + 1}`;
    img.loading = 'eager';

    setSrcWithFallback(img, `/images/${filenameWithoutExt(it.src)}`);

    wrap.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const items = await loadList();
      renderGrid('#selected-grid', items); // home (if present)
      renderGrid('#gallery-grid', items);  // gallery
      renderWork(items);                   // single work page
    } catch (e) {
      console.error(e);
    }
  });
})();
