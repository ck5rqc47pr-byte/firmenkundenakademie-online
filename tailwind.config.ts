import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "oklch(0.32 0.08 250)",
        accent: "oklch(0.78 0.05 75)",
        "accent-ink": "oklch(0.22 0.03 75)",
        bg: "oklch(0.985 0.003 240)",
        "bg-2": "oklch(0.965 0.005 240)",
        ink: "oklch(0.18 0.02 250)",
        "ink-2": "oklch(0.38 0.02 250)",
        "ink-3": "oklch(0.56 0.02 250)",
        line: "oklch(0.90 0.01 240)",
        "line-2": "oklch(0.82 0.015 240)",
        "primary-ink": "oklch(0.98 0.003 240)",
      },
      fontFamily: {
        serif: ["Source Serif 4", "Iowan Old Style", "Georgia", "serif"],
        sans: ["Inter Tight", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        content: "82rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
