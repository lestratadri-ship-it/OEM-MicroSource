/**
 * Catalog-style product information shown below the configurator.
 * Restrained B2B layout: heading + description, two-column specs / supply data,
 * and a subtle note reminding prospects that specs can be customised.
 *
 * Pure presentational component — no state, no interactivity.
 */
export default function ProductCatalogInfo({ category, onDiscuss }) {
  const { product } = category;

  return (
    <section className="border-t border-ink-100 pt-12 md:pt-16">
      <p className="eyebrow">Product information</p>

      <h2 className="mt-3 text-2xl font-semibold text-ink-900 md:text-3xl">
        {product.catalogName}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{category.tagline}</p>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-700">
        {product.summary}
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
        {/* Specifications */}
        <div>
          <p className="eyebrow">Specifications</p>
          <ul className="mt-4 space-y-2.5">
            {product.highlights.map((spec) => (
              <li
                key={spec}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700"
              >
                <span
                  aria-hidden="true"
                  className="mt-[8px] inline-block h-1 w-1 shrink-0 rounded-full bg-ink-900"
                />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supply — MOQ, Lead time, Compliance */}
        <div>
          <p className="eyebrow">Supply</p>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 shadow-card">
            <SupplyRow label="MOQ" value={product.moq} />
            <SupplyRow label="Lead time" value={product.leadTime} />
            <SupplyRow label="CE / RoHS status" value={product.compliance} />
          </dl>
          <p className="mt-3 text-xs text-ink-400">
            Designed for European markets
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-ink-100 bg-ink-50 p-5 shadow-card md:p-6">
        <p className="text-sm leading-relaxed text-ink-700">
          <span className="font-medium text-ink-900">
            Need custom specifications?
          </span>{" "}
          We handle firmware, packaging, and certification on request. Share
          your requirements and we will respond with a detailed plan.
        </p>
        {onDiscuss && (
          <button
            type="button"
            onClick={onDiscuss}
            className="btn-secondary mt-5"
          >
            Discuss your project
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  );
}

function SupplyRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 bg-white px-4 py-3">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="text-right text-sm text-ink-900 tabular-nums">{value}</dd>
    </div>
  );
}
