// Loads /images/images.json and renders thumbnails (no captions)
// Each thumb links to /work1.html, /work2.html, ... in JSON order.
document.addEventListener('DOMContentLoaded', async () => {
  const fetchJson = async () => {
    const res = await fetch('/images/images.json?v=12', { cache: 'no-store' });
    if (!res.ok) throw new Error(`images.json ${res.status}`);
    return res.json();
  };

  const renderGrid = (selector, items) => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    items.forEach((it, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      const a = document.createElement('a');
      a.href = `/work${i + 1}.html`;
      const img = document.createElement('img');
      img.src = `/images/${it.src}`;
      img.alt = it.alt || it.title || `Work ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      a.appendChild(img);
      card.appendChild(a);
      grid.appendChild(card);
    });
  };

  try {
    const items = await fetchJson();
    renderGrid('#selected-grid', items); // home
    renderGrid('#gallery-grid', items);  // gallery
  } catch (e) {
    console.error(e);
  }
});
