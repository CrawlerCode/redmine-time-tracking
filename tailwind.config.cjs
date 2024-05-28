/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          disabled: "var(--color-primary-disabled)",
          focus: "var(--color-primary-focus)",
        },
        background: {
          DEFAULT: "var(--color-background)",
          hover: "var(--color-background-hover)",
          inner: "var(--color-background-inner)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          disabled: "var(--color-text-disabled)",
        },
        field: {
          DEFAULT: "var(--color-field-bg)",
          inner: "var(--color-field-inner)",
          border: "var(--color-field-border)",
          placeholder: "var(--color-field-placeholder)",
        },
        dark: {
          50: "#C9C9C9",
          100: "#B8B8B8",
          200: "#828282",
          300: "#696969",
          400: "#424242",
          500: "#3B3B3B",
          600: "#2E2E2E",
          700: "#242424",
          800: "#1F1F1F",
          900: "#141414",
        },
        blue: {
          DEFAULT: "#1d4ed8",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate"), require("tailwindcss-shadow-fill"), require("tailwindcss-text-fill")],
};
