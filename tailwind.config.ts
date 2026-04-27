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
        primary: "#003DA5",
        accent: "#E05B00",
        surface: "#F8F9FB",
        ink: "#1A1A2E",
        success: "#1F8F4E",
        muted: "#8A8FA3",
      },
      boxShadow: {
        card: "0 18px 50px -30px rgba(0, 61, 165, 0.35)",
      },
      maxWidth: {
        content: "82rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
