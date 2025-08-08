// script.js  (v44)

// Build gallery from /images/images.json
async function buildGallery() {
  try {
    const res = await fetch('images/images.json?v=44', { cache: 'no-store' });
    const items = await res.json();

    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    grid.innerHTML = '';
    items.forEach((it, idx) => {
      const a = document.createElement('a');
      a.className = 'card';
      a.href = `work.html?img=${encodeURIComponent(it.src)}&i=${idx+1}`;
      a.setAttribute('aria-label', it.alt || `Painting ${idx+1}`);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = it.alt || `Painting ${idx+1}`;
      img.src = `images/${it.src}`;

      a.appendChild(img);
      grid.appendChild(a);
    });
  } catch (e) {
    console.error('Gallery build failed', e);
  }
}

// On work.html, read ?img= and show big image
function renderWork() {
  const wrap = document.querySelector('.work');
  if (!wrap) return;

  const params = new URLSearchParams(location.search);
  const src = params.get('img');

  // fallback: if script was ever linking with a full path, strip directory
  const file = src ? src.split('/').pop() : null;

  if (!file) {
    wrap.innerHTML = '<p>Image not specified.</p>';
    return;
  }

  const fig = document.createElement('figure');
  fig.className = 'work-figure';

  const img = document.createElement('img');
  img.className = 'work-image';
  img.alt = file;
  img.src = `images/${file}`;

  fig.appendChild(img);
  wrap.innerHTML = '';
  wrap.appendChild(fig);
}

document.addEventListener('DOMContentLoaded', () => {
  buildGallery();
  renderWork();
});
