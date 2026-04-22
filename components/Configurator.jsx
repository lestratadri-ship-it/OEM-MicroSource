"use client";

import { useRef, useState } from "react";
import {
  categories,
  productColors,
  getCategoryBySlug,
} from "@/lib/categories";
import ProductPreview from "./ProductPreview";
import ProductCatalogInfo from "./ProductCatalogInfo";
import QuoteDialog from "./QuoteDialog";
import {
  renderConfiguredImage,
  buildConfigurationSpec,
  downloadDataUrl,
  downloadJson,
  filenameTimestamp,
} from "@/lib/export";

const ACCEPTED_MIME = ["image/png", "image/jpeg"];
const ACCEPT_ATTR = "image/png,image/jpeg";
const MAX_LOGO_SIZE_MB = 5;

/**
 * User flow:
 *   1. Click a category pill → default product appears instantly.
 *   2. Pick a color swatch → SVG body transitions smoothly (~200 ms).
 *   3. Upload a PNG or JPG → logo is read as a data URL (no re-encoding,
 *      quality preserved) and overlaid on the product.
 *
 * Everything lives in React state. No network, no backend.
 */
export default function Configurator() {
  const [categorySlug, setCategorySlug] = useState(categories[0].slug);
  const [colorKey, setColorKey] = useState(productColors[0].key);
  const [zoneId, setZoneId] = useState(categories[0].product.zones[0].id);

  // logo: null | { src, name, size, width, height, type }
  const [logo, setLogo] = useState(null);
  const [logoError, setLogoError] = useState("");
  // logoBox: null (use default fit) | { x, y, width, height } normalised in zone
  const [logoBox, setLogoBox] = useState(null);

  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const fileRef = useRef(null);

  const category = getCategoryBySlug(categorySlug) ?? categories[0];
  const activeColor =
    productColors.find((c) => c.key === colorKey) ?? productColors[0];
  const zones = category.product.zones;
  const activeZone = zones.find((z) => z.id === zoneId) ?? zones[0];

  // Switch category and reset zone to that product's first allowed area.
  // Also clear logoBox so the logo re-fits the new zone cleanly.
  const handleCategoryChange = (slug) => {
    setCategorySlug(slug);
    const nextCategory = getCategoryBySlug(slug);
    if (nextCategory) setZoneId(nextCategory.product.zones[0].id);
    setLogoBox(null);
  };

  // Switch the active branding zone. Reset logoBox so the logo auto-fits
  // the new zone instead of inheriting stale coordinates.
  const handleZoneChange = (nextZoneId) => {
    setZoneId(nextZoneId);
    setLogoBox(null);
  };

  const openFilePicker = () => {
    setLogoError("");
    fileRef.current?.click();
  };

  const clearLogo = () => {
    setLogo(null);
    setLogoBox(null);
    setLogoError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoError("");

    // 1. Strict MIME check (the `accept` attribute is a hint, not a guarantee).
    if (!ACCEPTED_MIME.includes(file.type)) {
      setLogoError("Please upload a PNG or JPG file.");
      return;
    }

    // 2. Size guard.
    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setLogoError(`File is too large. Maximum ${MAX_LOGO_SIZE_MB} MB.`);
      return;
    }

    // 3. Read as data URL — preserves the original bytes, no re-encoding.
    const reader = new FileReader();
    reader.onload = () => {
      // Probe natural dimensions so we can show accurate feedback and
      // avoid CSS-upscaling the preview beyond its native size.
      const probe = new Image();
      probe.onload = () => {
        setLogo({
          src: reader.result,
          name: file.name,
          size: file.size,
          type: file.type,
          width: probe.naturalWidth,
          height: probe.naturalHeight,
        });
        setLogoBox(null); // fresh upload → use default fit
      };
      probe.onerror = () => {
        setLogoError("That image couldn't be loaded. Please try another file.");
      };
      probe.src = reader.result;
    };
    reader.onerror = () => {
      setLogoError("Could not read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  /* ---------- Export handlers ---------- */

  const baseFilename = () =>
    `microsource-${category.slug}-${colorKey}-${filenameTimestamp()}`;

  const handleExportImage = async () => {
    if (isExportingImage) return;
    setIsExportingImage(true);
    setExportError("");
    try {
      const dataUrl = await renderConfiguredImage({
        productImageSrc: category.product.images[colorKey],
        aspectRatio: category.product.aspectRatio,
        logoSrc: logo?.src ?? null,
        zone: activeZone,
        logoBox,
        logoNaturalSize: logo
          ? { width: logo.width, height: logo.height }
          : null,
      });
      downloadDataUrl(dataUrl, `${baseFilename()}.png`);
    } catch (err) {
      console.error(err);
      setExportError("Could not generate image. Please try again.");
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportSpec = () => {
    try {
      const spec = buildConfigurationSpec({
        category,
        color: activeColor,
        zone: activeZone,
        logo,
        logoBox,
      });
      downloadJson(spec, `${baseFilename()}.json`);
      setExportError("");
    } catch (err) {
      console.error(err);
      setExportError("Could not build specifications. Please try again.");
    }
  };

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      {/* ---------- Left: product preview ---------- */}
      <div
        className="relative flex min-h-[460px] items-center justify-center overflow-hidden
                   rounded-2xl border border-sky-100 p-8 shadow-card md:p-12 lg:min-h-[560px]
                   bg-gradient-to-br from-sky-50 via-white to-sky-100"
      >
        <div key={category.slug} className="animate-fade-up w-full">
          <ProductPreview
            category={category}
            activeColorKey={colorKey}
            activeZoneId={activeZone.id}
            logo={logo?.src ?? null}
            logoBox={logoBox}
            onLogoBoxChange={setLogoBox}
          />
        </div>
      </div>

      {/* ---------- Right: customisation panel ---------- */}
      <aside className="space-y-10">
        {/* Category */}
        <section>
          <p className="eyebrow mb-3">Category</p>
          <div
            role="tablist"
            aria-label="Product category"
            className="flex rounded-full border border-ink-100 bg-ink-50 p-1"
          >
            {categories.map((c) => {
              const isActive = c.slug === categorySlug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(c.slug)}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition duration-200
                    ${
                      isActive
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Product title */}
        <section>
          <p className="eyebrow">Product</p>
          <div key={category.slug} className="animate-fade-up">
            <h2 className="mt-2 text-xl font-semibold text-ink-900">
              {category.product.name}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">
              {category.tagline}
            </p>
            <p className="mt-3 text-xs text-ink-400">Private label available</p>
          </div>
        </section>

        {/* Color — 4 OEM variants */}
        <section>
          <p className="eyebrow mb-3">Color</p>
          <div className="flex flex-wrap gap-3">
            {productColors.map((c) => {
              const isActive = c.key === colorKey;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColorKey(c.key)}
                  aria-label={c.name}
                  aria-pressed={isActive}
                  className={`relative h-9 w-9 rounded-full border transition duration-150 active:scale-95
                    ${
                      isActive
                        ? "border-white ring-2 ring-ink-900 ring-offset-2"
                        : "border-ink-200 hover:border-ink-400"
                    }`}
                  style={{ backgroundColor: c.value }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink-500">{activeColor.name}</p>
        </section>

        {/* Logo upload */}
        <section>
          <p className="eyebrow mb-3">Logo</p>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={handleFile}
          />

          {logo ? (
            <div className="animate-fade-in rounded-xl border border-ink-100 bg-white p-3 shadow-card">
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-ink-50 p-1.5">
                  <img
                    src={logo.src}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>

                {/* Metadata */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <p className="truncate text-sm font-medium text-ink-900">
                      {logo.name}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-500">
                    {formatBytes(logo.size)} · {logo.width} × {logo.height} px
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 border-t border-ink-100 pt-3 text-sm">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="text-ink-900 hover:underline"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={clearLogo}
                  className="text-ink-500 hover:text-ink-900"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="btn-secondary w-full justify-center"
            >
              <UploadIcon className="h-4 w-4" />
              Upload logo
            </button>
          )}

          {/* Placement — only shown when the active product has multiple
              allowed zones. Mirrors the manufacturing constraint: the logo
              can only be placed inside a predefined area. */}
          {zones.length > 1 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-ink-700">
                Placement
              </p>
              <div
                role="tablist"
                aria-label="Logo placement zone"
                className="flex rounded-full border border-ink-100 bg-ink-50 p-1"
              >
                {zones.map((z) => {
                  const isActive = z.id === activeZone.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleZoneChange(z.id)}
                      className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition duration-200
                        ${
                          isActive
                            ? "bg-white text-ink-900 shadow-sm"
                            : "text-ink-500 hover:text-ink-900"
                        }`}
                    >
                      {z.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {logoError ? (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {logoError}
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-400">
              PNG or JPG, max {MAX_LOGO_SIZE_MB} MB. Drag to reposition, drag a
              corner to resize. Logos stay inside the allowed branding{" "}
              {zones.length > 1 ? "zones" : "zone"}.
            </p>
          )}
        </section>

        {/* Pricing — primary conversion action */}
        <section>
          <p className="eyebrow mb-3">Pricing</p>
          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="btn-primary w-full justify-center"
          >
            Get pricing for this version
            <span aria-hidden="true">→</span>
          </button>
          <p className="mt-3 text-xs text-ink-400">
            Configuration attached. Reply within two business days.
          </p>
        </section>

        {/* Save configuration — client-side PNG + JSON */}
        <section>
          <p className="eyebrow mb-3">Save your configuration</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExportImage}
              disabled={isExportingImage}
              className="btn-secondary w-full justify-center disabled:opacity-60"
            >
              {isExportingImage ? "Generating…" : "Save as image"}
            </button>
            <button
              type="button"
              onClick={handleExportSpec}
              className="btn-secondary w-full justify-center"
            >
              Save specifications
            </button>
          </div>
          {exportError ? (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {exportError}
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-400">
              PNG render of the product, plus a JSON file with product,
              colour, and logo placement.
            </p>
          )}
        </section>
      </aside>
    </div>

    {/* ---------- Catalog information (below the configurator) ---------- */}
    <div key={category.slug} className="animate-fade-up mt-14 md:mt-20">
      <ProductCatalogInfo
        category={category}
        onDiscuss={() => setIsQuoteOpen(true)}
      />
    </div>

    {/* ---------- Quote request dialog ---------- */}
    <QuoteDialog
      open={isQuoteOpen}
      onClose={() => setIsQuoteOpen(false)}
      configuration={buildConfigurationSpec({
        category,
        color: activeColor,
        zone: activeZone,
        logo,
        logoBox,
      })}
    />
    </>
  );
}

/* ---------- Helpers ---------- */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 10V2M8 2L4.5 5.5M8 2l3.5 3.5M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
