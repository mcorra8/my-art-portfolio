// script.js  (drop this in as-is)

(async function () {
  const VERSION = 36; // bump when you update images
  const JSON_URL = `images/images.json?v=${VERSION}`;

  // Utility to get query param
  function q(name) {
    const m = new URLSearchParams(window.location.search).get(name);
    return m === null ? null : m;
  }

  // Load image list once
  async function getImages() {
    const r = await fetch(JSON_URL, { cache: "no-store" });
    if (!r.ok) throw new Error("images.json not found");
    return r.json();
  }

  const images = await getImages().catch(e => {
    console.error(e);
    return [];
  });

  // ------- GALLERY PAGE -------
  const grid = document.querySelector("#gallery-grid");
  if (grid && images.length) {
    // Build cards but DO NOT change your CSS/classes/layout
    grid.innerHTML = images
      .map((img, i) => {
        const src = `images/${img.src}?v=${VERSION}`;
        const alt = img.alt || `Painting ${i + 1}`;
        // Link goes to one reusable page work.html with index param
        return `
          <a class="card" href="work.html?i=${i}&v=${VERSION}" aria-label="${alt}">
            <div class="thumb">
              <img loading="lazy" src="${src}" alt="${alt}">
            </div>
            <div class="meta">
              <span class="title">${alt}</span>
            </div>
          </a>`;
      })
      .join("");
  }

  // ------- SINGLE WORK PAGE -------
  const workWrap = document.querySelector(".work");
  if (workWrap && images.length) {
    const iRaw = q("i");
    let i = parseInt(iRaw, 10);
    if (Number.isNaN(i) || i < 0 || i >= images.length) i = 0;

    const img = images[i];
    const src = `images/${img.src}?v=${VERSION}`;
    const alt = img.alt || `Painting ${i + 1}`;

    workWrap.innerHTML = `
      <figure class="work-figure">
        <img class="work-image" src="${src}" alt="${alt}">
      </figure>
    `;

    // Optional: keyboard left/right
    function nav(delta) {
      let n = i + delta;
      if (n < 0) n = images.length - 1;
      if (n >= images.length) n = 0;
      window.location.href = \`work.html?i=\${n}&v=\${VERSION}\`;
    }
    window.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "ArrowRight") nav(1);
    });
  }
})();
