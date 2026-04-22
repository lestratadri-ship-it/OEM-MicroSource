"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight quote-request modal.
 * No dialog library — fixed-positioned overlay with backdrop, ESC-to-close,
 * and body-scroll lock while open.
 *
 * The current configuration (category, product, color, logo placement) is
 * passed in as `configuration` and attached to every submission.
 *
 * On submit: `console.log` the payload (simulated send) and show a success
 * state. No backend.
 */
export default function QuoteDialog({ open, onClose, configuration }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [error, setError] = useState("");

  // Reset on every open.
  useEffect(() => {
    if (open) {
      setStatus("idle");
      setError("");
    }
  }, [open]);

  // ESC closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      // Simulate a network round-trip.
      await new Promise((r) => setTimeout(r, 400));

      // Simulated send — log the structured payload we'd POST to a backend.
      // eslint-disable-next-line no-console
      console.log("[MicroSource quote request]", {
        form: formData,
        configuration,
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setError("Could not send your request. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-900/40 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-dialog md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Pricing request</p>
            <h2
              id="quote-title"
              className="mt-2 text-xl font-semibold text-ink-900"
            >
              Get pricing for this version
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-1.5 rounded-md p-1.5 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {status === "success" ? (
          <SuccessView onClose={onClose} />
        ) : (
          <QuoteForm
            onSubmit={handleSubmit}
            status={status}
            error={error}
            configuration={configuration}
          />
        )}
      </div>
    </div>
  );
}

function QuoteForm({ onSubmit, status, error, configuration }) {
  return (
    <>
      {/* Configuration snapshot — user sees what's being attached */}
      <div className="mt-5 rounded-md border border-ink-100 bg-ink-50 px-4 py-3">
        <p className="text-xs text-ink-500">Your configuration</p>
        <p className="mt-1 text-sm text-ink-900">
          {formatSummary(configuration)}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Field
          name="company"
          label="Company"
          required
          autoComplete="organization"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Your name" required autoComplete="name" />
          <Field
            name="email"
            label="Work email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <Select
          name="quantity"
          label="Estimated quantity"
          required
          options={[
            { value: "", label: "Select…" },
            { value: "100-500", label: "100 – 500 units" },
            { value: "500-1000", label: "500 – 1,000 units" },
            { value: "1000-5000", label: "1,000 – 5,000 units" },
            { value: "5000+", label: "5,000+ units" },
          ]}
        />
        <Textarea name="message" label="Message (optional)" rows={3} />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Request pricing"}
          </button>
          <p className="text-xs text-ink-400">
            Reply within two business days.
          </p>
        </div>
      </form>
    </>
  );
}

function SuccessView({ onClose }) {
  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center gap-2">
        <CheckIcon className="h-4 w-4 text-emerald-600" />
        <p className="text-base font-medium text-ink-900">Request received</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Your request and configuration are logged. Expect pricing, timeline,
        and sample details within two business days.
      </p>
      <button type="button" onClick={onClose} className="btn-primary mt-6">
        Close
      </button>
    </div>
  );
}

function formatSummary(cfg) {
  if (!cfg) return "";
  const parts = [
    cfg.product.catalogName || cfg.product.name,
    cfg.color.name,
  ];
  if (cfg.logo) {
    parts.push(`logo — ${cfg.logo.filename}`);
  } else {
    parts.push("no logo");
  }
  return parts.join(" · ");
}

/* ---------- form field helpers ---------- */

function Field({ label, name, type = "text", required, autoComplete }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink-700">
        {label}
        {required && <span className="ml-1 text-ink-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 block w-full rounded-md border border-ink-200 bg-white px-3 py-2
                   text-sm text-ink-900 placeholder:text-ink-400 transition-shadow"
      />
    </div>
  );
}

function Select({ name, label, options, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink-700">
        {label}
        {required && <span className="ml-1 text-ink-400">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 block w-full rounded-md border border-ink-200 bg-white px-3 py-2
                   text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ name, label, rows }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-ink-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder="Timeline, target markets, customisation needs…"
        className="mt-2 block w-full resize-y rounded-md border border-ink-200 bg-white px-3 py-2
                   text-sm text-ink-900 placeholder:text-ink-400
                   focus:border-ink-900 focus:outline-none"
      />
    </div>
  );
}

/* ---------- inline icons ---------- */

function XIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2l8 8M10 2l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
