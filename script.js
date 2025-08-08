// Robust loader with .jpg/.jpeg/.JPG fallback + cache bust
(function () {
  const V = '26';

  async function loadList() {
    const res = await fetch(`images/images.json?v=${V}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json failed');
    return res.json();
  }

  function baseNoExt(name) {
    const p = name.lastIndexOf('.');
    return p > -1 ? name.slice(0, p) : name;
  }

  function setWithFallback(img, src) {
    const base = baseNoExt(src);
    const tries = [
      `${src}`,                      // whatever images.json says
      `${base}.jpg`,
      `${base}.jpeg`,
      `${base}.JPG`
    ];
    let i = 0;
    const tryNext = () => {
      if (i >= tries.length) return;
      img.src = `images/${tries[i]}?v=${V}`;
      img.onerror = () => { i += 1; tryNext(); };
    };
    tryNext();
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
      img.loading = 'lazy'; img.decoding = 'async';
      setWithFallback(img, it.src);

      a.appendChild(img);
      card.appendChild(a);
      el.appendChild(card);
    });
  }

  function renderWork(el, items) {
    const idx = parseInt(new URLSearchParams(location.search).get('i') || '0', 10);
    const it = items[idx]; if (!it) return;
    el.innerHTML = '';
    const img = document.createElement('img');
    img.alt = it.alt || `Painting ${idx + 1}`;
    setWithFallback(img, it.src);
    el.appendChild(img);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const items = await loadList();
    const grid = document.querySelector('#gallery-grid');
    if (grid) renderGrid(grid, items);
    const work = document.querySelector('.work');
    if (work) renderWork(work, items);
  });
})();
