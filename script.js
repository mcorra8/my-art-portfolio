// script.js  — lightweight, non-destructive

(function () {
  const VERSION = 40;                                // bump to bust cache
  const JSON_URL = `images/images.json?v=${VERSION}`;

  // tiny helpers
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const getParam = (k) => new URLSearchParams(location.search).get(k);

  // normalize a filename: strip path and ?v= cache-busters
  const baseName = (url) => (url || "")
    .split("/").pop().split("?")[0];

  async function loadList() {
    const res = await fetch(JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("images.json not found");
    return res.json();
  }

  // ---- GALLERY: keep your existing markup, only fix the links ----
  async function enhanceGallery() {
    const grid = $("#gallery-grid") || $(".gallery") || document.body;
    if (!grid) return;

    let list = [];
    try { list = await loadList(); } catch (e) { console.error(e); return; }

    // map filename -> index in images.json
    const idxByName = new Map(
      list.map((item, i) => [baseName(item.src), i])
    );

    // Find all images shown as thumbnails on the page
    const thumbs = $$("img", grid);
    thumbs.forEach(img => {
      const name = baseName(img.getAttribute("src"));
      const i = idxByName.get(name);
      if (i == null) return; // ignore images not in images.json (hero, logos, etc.)

      // find or create an anchor wrapper and point it to work.html?i=#
      let a = img.closest("a");
      if (!a) {
        a = document.createElement("a");
        img.replaceWith(a);
        a.appendChild(img);
      }
      a.href = `work.html?i=${i}&v=${VERSION}`;
    });
  }

  // ---- WORK PAGE: render the one image by index ----
  async function renderWork() {
    const mount = document.querySelector(".work");
    if (!mount) return;

    let list = [];
    try { list = await loadList(); } catch (e) { console.error(e); return; }

    let i = parseInt(getParam("i") || "0", 10);
    if (Number.isNaN(i) || i < 0 || i >= list.length) i = 0;

    const item = list[i];
    const src = `images/${item.src}?v=${VERSION}`;
    const alt = item.alt || `Painting ${i + 1}`;

    mount.innerHTML = `
      <figure class="work-figure">
        <img class="work-image" src="${src}" alt="${alt}">
      </figure>
    `;
  }

  // run both; each only acts if its target exists
  enhanceGallery();
  renderWork();
})();
