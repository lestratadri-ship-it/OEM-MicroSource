import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-lg font-semibold tracking-tightest text-ink-900">
              {site.name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="eyebrow">Sitemap</p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-700 transition hover:text-ink-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li>{site.email}</li>
              <li>{site.phone}</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14 pt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-400">
            © {site.year} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            Designed and manufactured in Europe and Asia.
          </p>
        </div>
      </div>
    </footer>
  );
}
