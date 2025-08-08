<!-- /script.js -->
<script>
// Build gallery from images.json and link each card to work.html?i=N
(async function () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  try {
    const res = await fetch('images/images.json?v=' + Date.now());
    const items = await res.json();

    grid.innerHTML = '';

    items.forEach((item, idx) => {
      const a = document.createElement('a');
      a.className = 'card';
      a.href = 'work.html?i=' + (idx + 1); // 1-based for humans

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = item.alt || ('Painting ' + (idx + 1));
      img.src = 'images/' + item.src; // src is like "painting-01.jpg"
      a.appendChild(img);

      grid.appendChild(a);
    });
  } catch (e) {
    console.error('Failed loading images.json', e);
    if (grid) grid.textContent = 'Unable to load images.';
  }
})();
</script>
