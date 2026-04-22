import { capabilities } from "@/lib/site";

export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-ink-50">
      <div className="container-x py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              What we handle.
            </h2>
          </div>

          <div className="md:col-span-8">
            <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div key={item.title}>
                  <dt className="text-base font-medium text-ink-900">
                    {item.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-500">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
