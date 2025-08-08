// v42 — filename-based routing (no more index mismatches)

const VERSION = 42;
const JSON_URL = `images/images.json?v=${VERSION}`;

const $ = (s, r = document) => r.querySelector(s);

async function loadList() {
  const res = await fetch(JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("images.json not found");
  return res.json();
}

function q(k) { return new URLSearchParams(location.search).get(k); }

// Build gallery thumbnails
async function initGallery() {
  const grid = $("#grid");
  if (!grid) return;

  let list = [];
  try { list = await loadList(); } catch (e) { console.error(e); return; }

  const frag = document.createDocumentFragment();
  list.forEach(item => {
    const a = document.createElement("a");
    a.className = "thumb";
    a.href = `work.html?src=${encodeURIComponent(item.src)}&v=${VERSION}`;

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = item.alt || "";
    img.src = `images/${item.src}?v=${VERSION}`;

    a.appendChild(img);
    frag.appendChild(a);
  });
  grid.appendChild(frag);
}

// Build single image page
async function initWork() {
  const mount = $(".work");
  if (!mount) return;

  const src = q("src"); // expected like painting-01.jpg
  if (!src) {
    mount.innerHTML = `<p>Missing image.</p>`;
    return;
  }
  const url = `images/${src}?v=${VERSION}`;

  // show image
  mount.innerHTML = `
    <figure class="work-figure">
      <img class="work-image" src="${url}" alt="" />
    </figure>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initWork();
});
