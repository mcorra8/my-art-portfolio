// Render gallery thumbs and support a single dynamic work page.
const loadJson = async () => {
  const res = await fetch('/images/images.json?v=13', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load images.json');
  return res.json();
};

const renderGrid = (selector, items) => {
  const grid = document.querySelector(selector);
  if (!grid) return;
  items.forEach((it, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    const a = document.createElement('a');
    a.href = `/work.html?i=${i}`;
    const img = document.createElement('img');
    img.src = `/images/${it.src}`;
    img.alt = it.alt || `Work ${i+1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    a.appendChild(img);
    card.appendChild(a);
    grid.appendChild(card);
  });
};

const renderWorkPage = (items) => {
  const work = document.querySelector('.work');
  if (!work) return;
  const idx = parseInt(new URLSearchParams(location.search).get('i') || '0', 10);
  const item = items[idx];
  if (!item) return;
  const img = document.createElement('img');
  img.src = `/images/${item.src}`;
  img.alt = item.alt || `Work ${idx+1}`;
  img.loading = 'eager';
  work.appendChild(img);
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const items = await loadJson();
    renderGrid('#selected-grid', items); // home
    renderGrid('#gallery-grid', items);  // gallery
    renderWorkPage(items);               // work page
  } catch (e) {
    console.error(e);
  }
});
