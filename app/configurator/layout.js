import { listAllProductImages } from "@/lib/categories";

export const metadata = {
  title: "Product configurator — MicroSource",
  description:
    "Configure a tablet, POS terminal, or accessory for private-label manufacturing. Get pricing and specifications.",
};

export default function ConfiguratorLayout({ children }) {
  const images = listAllProductImages();

  return (
    <>
      {/* Browser-level preload for every product / color variant.
          Next.js hoists <link> elements to <head> automatically. */}
      {images.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}

      <div className="container-x py-10 md:py-14">
        {/* Subtle OEM positioning — factual, no hype. */}
        <p className="eyebrow mb-8 md:mb-12">OEM / ODM solutions</p>
        {children}
      </div>
    </>
  );
}
