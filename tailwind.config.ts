import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cheezious: {
          yellow: "#FFB800",
          yellowHover: "#E5A600",
          amber: "#F59E0B",
          bg: "#111317",
          card: "#1A1D24",
          cardHover: "#20242D",
          border: "#222631",
          borderLight: "#2D3342",
          red: "#E11D48",
          redDark: "#DC2626",
          textMuted: "#9CA3AF",
          textLight: "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 184, 0, 0.25)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
