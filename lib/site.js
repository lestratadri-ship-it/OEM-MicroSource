// Centralised site-wide configuration for MicroSource.
// Copy written for B2B conversion: clear, professional, direct.

export const site = {
  name: "MicroSource",
  tagline:
    "OEM/ODM manufacturing for tablets, POS equipment, and accessories.",
  description:
    "MicroSource manufactures private-label tablets, POS equipment, and accessories for European brands. Custom hardware, packaging, and CE/RoHS compliance are handled in-house.",
  email: "partners@microsource.eu",
  phone: "+34 900 000 000",
  year: new Date().getFullYear(),
};

export const nav = [
  { label: "Products", href: "#products" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "Configurator", href: "/configurator" },
  { label: "Contact", href: "#contact" },
];

export const categories = [
  {
    title: "Tablets",
    description:
      "Android business tablets with custom firmware, branding, and packaging.",
  },
  {
    title: "Gaming Monitors",
    description:
      "High-refresh-rate QHD displays with ergonomic stands and adaptive sync.",
  },
  {
    title: "Laptops",
    description:
      "14-inch business laptops with Intel or AMD options and custom lid branding.",
  },
  {
    title: "Webcams",
    description:
      "4K UHD webcams with wide-angle lens and dual stereo microphones.",
  },
  {
    title: "TVs",
    description:
      "55-inch 4K smart TVs with Android TV, hospitality mode, and custom boot logo.",
  },
];

export const capabilities = [
  {
    title: "Custom engineering",
    description:
      "Mechanical, firmware, and UI customisation to your specification.",
  },
  {
    title: "European compliance",
    description:
      "CE, RoHS, REACH, and WEEE handled in-house before shipment.",
  },
  {
    title: "Quality control",
    description:
      "In-line and pre-shipment inspections with documented AQL reports.",
  },
  {
    title: "MOQ flexibility",
    description:
      "Pilot runs from 300 units, scaling to container volumes.",
  },
];

export const process = [
  {
    step: "01",
    title: "Brief",
    description:
      "Share your product, volumes, and target markets. We reply within two business days.",
  },
  {
    step: "02",
    title: "Specify",
    description:
      "Engineers align hardware, firmware, and packaging with your requirements.",
  },
  {
    step: "03",
    title: "Sample",
    description:
      "A branded sample is delivered for validation before production.",
  },
  {
    step: "04",
    title: "Produce",
    description:
      "We manage manufacturing, QA, compliance, and delivery to your warehouse.",
  },
];
