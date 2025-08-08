document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load image list from images.json with cache-busting
    const res = await fetch('/images/images.json?v=16', { cache: 'no-store' });
    const images = await res.json();

    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = ''; // Clear any existing content

    images.forEach(image => {
      const link = document.createElement('a');
      link.href = `/images/${image.src}`;
      link.target = '_blank';
      link.classList.add('gallery-item');

      const img = document.createElement('img');
      img.src = `/images/${image.src}`;
      img.alt = image.alt || '';

      link.appendChild(img);
      galleryGrid.appendChild(link);
    });

  } catch (err) {
    console.error('Error loading gallery:', err);
  }
});
