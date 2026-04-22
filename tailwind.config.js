/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0B0B0C",
          800: "#1A1A1D",
          700: "#2A2A2F",
          500: "#5B5B63",
          400: "#7A7A82",
          300: "#B8B8BF",
          200: "#E3E3E6",
          100: "#F2F2F4",
          50:  "#F8F8F9",
        },
        accent: {
          DEFAULT: "#0F172A",
          soft: "#111827",
        },
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      maxWidth: {
        container: "1200px",
      },
      // Premium shadow scale — low-opacity, layered, never heavy.
      boxShadow: {
        card:
          "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        "card-hover":
          "0 2px 4px rgba(16,24,40,0.04), 0 8px 20px -4px rgba(16,24,40,0.08)",
        elevated:
          "0 2px 8px -2px rgba(16,24,40,0.05), 0 8px 24px -6px rgba(16,24,40,0.06)",
        dialog:
          "0 24px 60px -12px rgba(16,24,40,0.18), 0 8px 20px -6px rgba(16,24,40,0.08)",
        // Very subtle press-down feel under a button.
        "button-press": "0 1px 2px rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};
