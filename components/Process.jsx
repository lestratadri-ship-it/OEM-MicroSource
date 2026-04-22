import { process } from "@/lib/site";

export default function Process() {
  return (
    <section id="process" className="container-x py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="eyebrow">Process</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          Brief to delivery in four steps.
        </h2>
      </div>

      <ol className="mt-14 grid gap-px bg-ink-100 md:grid-cols-4">
        {process.map((step) => (
          <li key={step.step} className="bg-white p-8 md:p-10">
            <span className="text-xs font-medium text-ink-400">{step.step}</span>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
