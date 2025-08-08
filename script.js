// script.js — builds gallery if needed and fixes 404s
(function () {
  const VERSION = 41;                                  // bump to bust cache
  const JSON_URL = `images/images.json?v=${VERSION}`;

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const getParam = (k) => new URLSearchParams(location.search).get(k);
  const baseName = (url) => (url || "").split("/").pop().split("?")[0];

  async function getList() {
    const res = await fetch(JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("images.json not found");
    return res.json();
  }

  // ---------- GALLERY ----------
  async function setupGallery() {
    // Try common containers. We won't change your CSS/layout.
    const grid =
      $("#gallery-grid") ||
      $(".gallery") ||
      $(".container") ||
      $("main") ||
      document.body;

    if (!grid) return;

    let list = [];
    try { list = await getList(); } catch (e) { console.error(e); return; }

    // If there are no <img> tags, build the grid from images.json
    const existingThumbs = $$("img", grid);
    if (existingThumbs.length === 0) {
      // minimal markup: image inside link; no titles/dates since you asked to hide them
      const frag = document.createDocumentFragment();
      list.forEach((item, i) => {
        const a = document.createElement("a");
        a.className = "thumb";
        a.href = `work.html?i=${i}&v=${VERSION}`;

        const img = document.createElement("img");
        img.loading = "lazy";
        img.alt = item.alt || `Painting ${i + 1}`;
        img.src = `images/${item.src}?v=${VERSION}`;

        a.appendChild(img);
        frag.appendChild(a);
      });
      grid.appendChild(frag);
      return;
    }

    // If thumbnails already exist, just fix their links.
    const indexByName = new Map(list.map((it, i) => [baseName(it.src), i]));
    existingThumbs.forEach(img => {
      const name = baseName(img.getAttribute("src"));
      const i = indexByName.get(name);
      if (i == null) return; // hero or anything not in images.json
      let a = img.closest("a");
      if (!a) {
        a = document.createElement("a");
        img.replaceWith(a);
        a.appendChild(img);
      }
      a.href = `work.html?i=${i}&v=${VERSION}`;
    });
  }

  // ---------- WORK (single image) ----------
  async function setupWork() {
    const mount = $(".work");
    if (!mount) return;

    let list = [];
    try { list = await getList(); } catch (e) { console.error(e); return; }

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

  setupGallery();
  setupWork();
})();
