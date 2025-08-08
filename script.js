// v43 — filename-based routing + tiny fallback; builds gallery + large view
(function () {
  const V = 43; // bump to bust caches
  const JSON_URL = `images/images.json?v=${V}`;

  const $ = (s, r = document) => r.querySelector(s);
  const qp = (k) => new URLSearchParams(location.search).get(k);

  async function loadList() {
    const res = await fetch(JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('images.json not found');
    return res.json();
  }

  // ---------- GALLERY ----------
  async function initGallery() {
    const grid = $('#gallery-grid');
    if (!grid) return; // page without a grid

    let list = [];
    try { list = await loadList(); } catch (e) { console.error(e); return; }

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    list.forEach(it => {
      const a = document.createElement('a');
      a.className = 'card';
      a.href = `work.html?src=${encodeURIComponent(it.src)}&v=${V}`;

      const img = document.createElement('img');
      img.alt = it.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = `images/${it.src}?v=${V}`;

      a.appendChild(img);
      frag.appendChild(a);
    });

    grid.appendChild(frag);
  }

  // ---------- SINGLE WORK ----------
  async function initWork() {
    const mount = $('.work');
    if (!mount) return; // not on work page

    const src = qp('src');
    if (!src) { mount.textContent = 'Artwork not found.'; return; }

    const url = `images/${src}?v=${V}`;
    mount.innerHTML = `
      <figure class="work-figure">
        <img class="work-image" src="${url}" alt="" />
      </figure>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initWork();
  });
})();
