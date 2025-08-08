// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (burger) burger.addEventListener('click', () => menu.classList.toggle('open'));
});

// Minimal lightbox
const Lightbox = (() => {
  let items = [], index = 0;
  const root = document.createElement('div');
  root.className = 'lightbox';
  const img = document.createElement('img');
  const cap = document.createElement('div'); cap.className = 'caption';
  const prev = document.createElement('button'); prev.className = 'prev'; prev.textContent = '‹';
  const next = document.createElement('button'); next.className = 'next'; next.textContent = '›';
  const close = document.createElement('button'); close.className = 'close'; close.textContent = '✕';
  root.append(img, cap, prev, next, close);
  document.body.appendChild(root);
  close.onclick = () => root.classList.remove('open');
  prev.onclick = () => show(index - 1);
  next.onclick = () => show(index + 1);
  document.addEventListener('keydown', e => {
    if (!root.classList.contains('open')) return;
    if (e.key === 'Escape') root.classList.remove('open');
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  function open(arr, i){ items = arr; show(i); root.classList.add('open'); }
  function show(i){
    index = (i + items.length) % items.length;
    const it = items[index];
    img.src = '/images/' + it.src;
    img.alt = it.alt || it.title || '';
    cap.textContent = [it.title, it.year, it.medium, it.size].filter(Boolean).join(' · ');
  }
  return { open };
})();

// Build a grid from /images/images.json into the given selector
async function loadGallery(selector){
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch('/images/images.json', { cache: 'no-store' });
  const items = await res.json();
  items.forEach((item, idx) => {
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img');
    img.loading = 'lazy'; img.decoding = 'async';
    img.src = '/images/' + item.src; img.alt = item.alt || item.title || '';
    img.addEventListener('click', () => Lightbox.open(items, idx));
    const meta = document.createElement('div'); meta.className = 'meta';
    const l = document.createElement('div'); l.textContent = item.title || 'Untitled';
    const r = document.createElement('div'); r.textContent = item.year || '';
    meta.append(l, r); card.append(img, meta); el.append(card);
  });
}
    
