import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pt-24 pb-28 md:pt-36 md:pb-40">
        <div className="max-w-3xl">
          <p className="eyebrow">OEM / ODM manufacturing</p>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-ink-900 md:text-6xl lg:text-7xl">
            Private-label hardware, built to your specification.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl">
            Tablets, POS equipment, and accessories manufactured for European
            brands. Custom engineering, packaging, and CE/RoHS compliance
            handled in-house.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/configurator" className="btn-primary">
              Configure a product
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#capabilities" className="btn-secondary">
              View capabilities
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal divider line */}
      <div className="container-x">
        <div className="hairline" />
      </div>
    </section>
  );
}
