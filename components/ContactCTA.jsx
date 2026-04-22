import Link from "next/link";
import { site } from "@/lib/site";

export default function ContactCTA() {
  return (
    <section id="contact" className="border-t border-ink-100">
      <div className="container-x py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow">Next step</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Discuss your project.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-500 md:text-lg">
            Tell us about your product, volumes, and target markets. We reply
            within two business days with pricing, timeline, and a sample plan.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={`mailto:${site.email}`} className="btn-primary">
              Discuss your project
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/configurator" className="btn-secondary">
              Configure a product
            </Link>
          </div>

          <p className="mt-6 text-sm text-ink-500">
            Or email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink-900 hover:underline"
            >
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
