// Client-side export — image composition + JSON specification.
// Everything runs in the browser. No backend, no external services.
// ------------------------------------------------------------------

const STAGE_BG = "#F0F9FF"; // sky-50 — matches the preview's blue-tinted stage
const MAX_DIMENSION = 1600; // exported image's largest side

/* ==================================================================
   IMAGE EXPORT
   ================================================================== */

/**
 * Composites the active product variant and the user's logo onto a canvas,
 * then returns a PNG data URL. Mirrors the preview exactly:
 *   • solid ink-50 background
 *   • product image with object-contain fit
 *   • logo constrained to the active zone rectangle
 *   • zone outlines are NOT drawn (they're configuration chrome, not product)
 */
export async function renderConfiguredImage({
  productImageSrc,
  aspectRatio,
  logoSrc,
  zone,        // { id, name, outline: { top, left, width, height } }
  logoBox,     // { x, y, width, height } 0..1 inside zone, or null → default fit
  logoNaturalSize, // { width, height } of the uploaded logo
}) {
  const { width: W, height: H } = computeCanvasSize(aspectRatio);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = STAGE_BG;
  ctx.fillRect(0, 0, W, H);

  // Product image (object-contain)
  const productImg = await loadImage(productImageSrc);
  const productBox = fitContain(
    productImg.naturalWidth || W,
    productImg.naturalHeight || H,
    W,
    H
  );
  ctx.drawImage(
    productImg,
    productBox.dx,
    productBox.dy,
    productBox.dw,
    productBox.dh
  );

  // Logo overlay
  if (logoSrc) {
    const logoImg = await loadImage(logoSrc);
    const effective =
      logoBox ??
      computeDefaultLogoBox({
        logoWidth: logoNaturalSize?.width ?? logoImg.naturalWidth,
        logoHeight: logoNaturalSize?.height ?? logoImg.naturalHeight,
        zoneOutline: zone.outline,
        aspectRatio,
      });

    // Zone coordinates are authored as % of the container (= the canvas).
    const zonePx = {
      x: (parseFloat(zone.outline.left) / 100) * W,
      y: (parseFloat(zone.outline.top) / 100) * H,
      width: (parseFloat(zone.outline.width) / 100) * W,
      height: (parseFloat(zone.outline.height) / 100) * H,
    };
    const logoPx = {
      x: zonePx.x + effective.x * zonePx.width,
      y: zonePx.y + effective.y * zonePx.height,
      width: effective.width * zonePx.width,
      height: effective.height * zonePx.height,
    };
    ctx.drawImage(
      logoImg,
      logoPx.x,
      logoPx.y,
      logoPx.width,
      logoPx.height
    );
  }

  return canvas.toDataURL("image/png");
}

/* ==================================================================
   DATA / SPECIFICATION EXPORT
   ================================================================== */

/**
 * Builds the JSON-serialisable snapshot of the current configuration.
 * Shape:
 *   { timestamp, category, product, color, logo }
 */
export function buildConfigurationSpec({
  category,
  color,
  zone,
  logo,         // null | { src, name, size, type, width, height }
  logoBox,      // null | { x, y, width, height }
}) {
  const { product } = category;

  let logoData = null;
  if (logo) {
    const effective =
      logoBox ??
      computeDefaultLogoBox({
        logoWidth: logo.width,
        logoHeight: logo.height,
        zoneOutline: zone.outline,
        aspectRatio: product.aspectRatio,
      });
    const rounded = roundBox(effective);

    logoData = {
      filename: logo.name,
      mimeType: logo.type,
      fileSizeBytes: logo.size,
      naturalSize: { width: logo.width, height: logo.height },
      zone: { id: zone.id, name: zone.name },
      // Both normalised within the zone (0..1).
      position: { x: rounded.x, y: rounded.y },
      size: { width: rounded.width, height: rounded.height },
    };
  }

  return {
    timestamp: new Date().toISOString(),
    category: { slug: category.slug, name: category.name },
    product: {
      name: product.name,
      catalogName: product.catalogName,
      moq: product.moq,
      leadTime: product.leadTime,
      compliance: product.compliance,
    },
    color: { key: color.key, name: color.name, value: color.value },
    logo: logoData,
  };
}

/* ==================================================================
   DOWNLOAD HELPERS
   ================================================================== */

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Compact filename timestamp: YYYYMMDD-HHmm. */
export function filenameTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

/* ==================================================================
   INTERNAL HELPERS
   ================================================================== */

function computeCanvasSize(aspectRatio) {
  const [w, h] = aspectRatio.split("/").map((s) => parseFloat(s.trim()));
  const ratio = w / h;
  if (ratio >= 1) {
    return { width: MAX_DIMENSION, height: Math.round(MAX_DIMENSION / ratio) };
  }
  return { width: Math.round(MAX_DIMENSION * ratio), height: MAX_DIMENSION };
}

function fitContain(iw, ih, boxW, boxH) {
  const imgRatio = iw / ih;
  const boxRatio = boxW / boxH;
  let dw, dh;
  if (imgRatio > boxRatio) {
    dw = boxW;
    dh = boxW / imgRatio;
  } else {
    dh = boxH;
    dw = boxH * imgRatio;
  }
  return { dx: (boxW - dw) / 2, dy: (boxH - dh) / 2, dw, dh };
}

function computeDefaultLogoBox({
  logoWidth,
  logoHeight,
  zoneOutline,
  aspectRatio,
}) {
  const [aspW, aspH] = aspectRatio.split("/").map((s) => parseFloat(s.trim()));
  const containerAspect = aspW / aspH;
  const zwPct = parseFloat(zoneOutline.width) / 100;
  const zhPct = parseFloat(zoneOutline.height) / 100;
  const zoneAspect = (zwPct / zhPct) * containerAspect;
  const logoAspect = logoWidth / logoHeight;

  let w, h;
  if (logoAspect > zoneAspect) {
    w = 1;
    h = zoneAspect / logoAspect;
  } else {
    h = 1;
    w = logoAspect / zoneAspect;
  }
  return { x: (1 - w) / 2, y: (1 - h) / 2, width: w, height: h };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function roundBox(b) {
  const r = (v) => Math.round(v * 10000) / 10000;
  return { x: r(b.x), y: r(b.y), width: r(b.width), height: r(b.height) };
}
