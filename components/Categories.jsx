import { categories } from "@/lib/site";

export default function Categories() {
  return (
    <section id="products" className="container-x py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="eyebrow">Products</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          Five product categories.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-500 md:text-lg">
          Focused scope by design. Direct supplier relationships, predictable
          lead times, and consistent quality control across every programme.
        </p>
      </div>

      <div className="mt-14 grid gap-px bg-ink-100 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((item) => (
          <article
            key={item.title}
            className="bg-white p-6 transition-shadow duration-300 hover:shadow-card md:p-8"
          >
            <h3 className="text-lg font-semibold text-ink-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
