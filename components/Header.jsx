import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tightest text-ink-900"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-500 transition hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/configurator" className="btn-primary hidden md:inline-flex">
          Configure a product
        </Link>

        <Link
          href="/configurator"
          className="btn-primary md:hidden !px-4 !py-2 text-xs"
        >
          Configure
        </Link>
      </div>
    </header>
  );
}
