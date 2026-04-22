// MVP configurator — 5 categories, each with one default product.
// ------------------------------------------------------------------
// To swap variants later: replace the SVGs in /public/products/ with
// real product photography and keep the same filenames (or update the
// paths in `images` below).
// ------------------------------------------------------------------

export const categories = [
  {
    slug: "tablets",
    name: "Tablets",
    tagline:
      "Android business tablets, ready to brand, certify, and ship in Europe.",
    product: {
      name: "MS-T10 Business Tablet",
      catalogName: "10.1″ Business Tablet",
      compliance: "CE, RoHS certified",
      summary:
        "A 10.1″ Android tablet built for private-label programmes — custom firmware, branding, and packaging handled by our team.",
      highlights: [
        "10.1″ IPS display, 1920 × 1200",
        "Android 14, MDM-ready",
        "Octa-core, 8 GB RAM / 128 GB storage",
        "Wi-Fi 6, optional 4G LTE",
        "7,500 mAh battery, USB-C fast charging",
        "Custom logo, packaging, and boot animation",
      ],
      moq: "Starting MOQ 300 units",
      leadTime: "Lead time ~45 days",
      images: {
        black: "/products/tablet-black.svg",
        white: "/products/tablet-white.svg",
        grey:  "/products/tablet-grey.svg",
        blue:  "/products/tablet-blue.svg",
      },
      aspectRatio: "3 / 4",
      maxWidth: "320px",
      zones: [
        {
          id: "back-center",
          name: "Back centre",
          outline: { top: "45%", left: "30%", width: "40%", height: "15%" },
        },
        {
          id: "back-lower",
          name: "Lower mark",
          outline: { top: "82%", left: "42%", width: "16%", height: "4%" },
        },
      ],
    },
  },
  {
    slug: "gaming-monitors",
    name: "Monitors",
    tagline:
      "High-refresh-rate gaming and productivity displays, ready for private-label.",
    product: {
      name: "MS-M27 Gaming Monitor",
      catalogName: "27″ Gaming Monitor",
      compliance: "CE, RoHS, Energy-label compliant",
      summary:
        "27-inch QHD monitor with a 165 Hz panel and adaptive sync. Ready for private-label branding and European certification.",
      highlights: [
        "27″ IPS panel, QHD 2560 × 1440",
        "165 Hz refresh rate, 1 ms response",
        "AMD FreeSync / NVIDIA G-Sync compatible",
        "HDMI 2.0, DisplayPort 1.4, USB-C PD",
        "VESA 100 × 100, tilt / swivel / height stand",
        "Custom logo on bezel and stand",
      ],
      moq: "Starting MOQ 200 units",
      leadTime: "Lead time ~60 days",
      images: {
        black: "/products/monitor-black.svg",
        white: "/products/monitor-white.svg",
        grey:  "/products/monitor-grey.svg",
        blue:  "/products/monitor-blue.svg",
      },
      aspectRatio: "21 / 19",
      maxWidth: "420px",
      zones: [
        {
          id: "bottom-bezel",
          name: "Bottom bezel",
          outline: { top: "62%", left: "40%", width: "20%", height: "4%" },
        },
        {
          id: "stand-base",
          name: "Stand base",
          outline: { top: "87%", left: "38%", width: "24%", height: "5%" },
        },
      ],
    },
  },
  {
    slug: "laptops",
    name: "Laptops",
    tagline:
      "Business laptops engineered to your specification and brand.",
    product: {
      name: "MS-L14 Business Laptop",
      catalogName: "14″ Business Laptop",
      compliance: "CE, RoHS, Energy-label compliant",
      summary:
        "14-inch business laptop with Intel or AMD options. Custom firmware, boot splash, and lid branding handled by our team.",
      highlights: [
        "14″ IPS display, Full HD or 2K",
        "Intel Core i5/i7 or AMD Ryzen 5/7",
        "16 GB RAM / 512 GB NVMe SSD",
        "Wi-Fi 6, Bluetooth 5.2, backlit keyboard",
        "HDMI 2.1, 2× USB-C PD, 2× USB-A, SD reader",
        "Custom lid logo and boot splash",
      ],
      moq: "Starting MOQ 100 units",
      leadTime: "Lead time ~75 days",
      images: {
        black: "/products/laptop-black.svg",
        white: "/products/laptop-white.svg",
        grey:  "/products/laptop-grey.svg",
        blue:  "/products/laptop-blue.svg",
      },
      aspectRatio: "22 / 15",
      maxWidth: "440px",
      zones: [
        {
          id: "screen-bezel",
          name: "Screen bezel",
          outline: { top: "72%", left: "42%", width: "16%", height: "3%" },
        },
        {
          id: "palm-rest",
          name: "Palm rest",
          outline: { top: "78%", left: "42%", width: "16%", height: "3%" },
        },
      ],
    },
  },
  {
    slug: "webcams",
    name: "Webcams",
    tagline:
      "Conference and streaming webcams for private-label distribution.",
    product: {
      name: "MS-W4K Webcam",
      catalogName: "4K UHD Webcam",
      compliance: "CE, RoHS, FCC certified",
      summary:
        "4K UHD webcam with wide-angle lens and dual stereo microphones. Plug-and-play USB-C, ready for private-label branding.",
      highlights: [
        "4K UHD sensor, 30 fps / 1080p 60 fps",
        "90° wide-angle lens with autofocus",
        "Dual stereo microphones, noise reduction",
        "USB-C plug-and-play, no driver required",
        "Universal monitor clip + tripod thread",
        "Custom logo on body and packaging",
      ],
      moq: "Starting MOQ 500 units",
      leadTime: "Lead time ~40 days",
      images: {
        black: "/products/webcam-black.svg",
        white: "/products/webcam-white.svg",
        grey:  "/products/webcam-grey.svg",
        blue:  "/products/webcam-blue.svg",
      },
      aspectRatio: "13 / 10",
      maxWidth: "300px",
      zones: [
        {
          id: "front-face",
          name: "Front face",
          outline: { top: "58%", left: "35%", width: "30%", height: "8%" },
        },
      ],
    },
  },
  {
    slug: "tvs",
    name: "TVs",
    tagline:
      "Smart TVs for hospitality and private-label distribution.",
    product: {
      name: "MS-TV55 Smart TV",
      catalogName: "55″ 4K Smart TV",
      compliance: "CE, RoHS, Energy-label compliant",
      summary:
        "55-inch 4K smart TV with Android TV and hospitality mode. Ready for private-label branding, custom boot logo, and remote.",
      highlights: [
        "55″ LED panel, 4K UHD 3840 × 2160",
        "60 Hz native refresh, HDR10",
        "Android TV 12 with custom launcher",
        "3× HDMI 2.1, 2× USB, Ethernet, Wi-Fi",
        "Hospitality mode with USB cloning",
        "Custom boot logo, packaging, and remote",
      ],
      moq: "Starting MOQ 100 units",
      leadTime: "Lead time ~90 days",
      images: {
        black: "/products/tv-black.svg",
        white: "/products/tv-white.svg",
        grey:  "/products/tv-grey.svg",
        blue:  "/products/tv-blue.svg",
      },
      aspectRatio: "26 / 17",
      maxWidth: "500px",
      zones: [
        {
          id: "bottom-bezel",
          name: "Bottom bezel",
          outline: { top: "73%", left: "42%", width: "16%", height: "3%" },
        },
        {
          id: "stand-base",
          name: "Stand base",
          outline: { top: "86%", left: "38%", width: "24%", height: "3%" },
        },
      ],
    },
  },
];

// Limited to 4 OEM-friendly colors. `key` maps to the image filename suffix.
export const productColors = [
  { key: "black", name: "Black", value: "#1A1A1D" },
  { key: "white", name: "White", value: "#F2F4F6" },
  { key: "grey",  name: "Grey",  value: "#C0C4CA" },
  { key: "blue",  name: "Blue",  value: "#1F3A60" },
];

// ---- Helpers -------------------------------------------------------

export const DEFAULT_CATEGORY_SLUG = categories[0].slug;

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function listCategorySlugs() {
  return categories.map((c) => c.slug);
}

/** All product images across every category and color, flattened. */
export function listAllProductImages() {
  return categories.flatMap((c) => Object.values(c.product.images));
}
