import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette inspired by Vanisca's warm wood + copper interior
        charcoal: {
          DEFAULT: "#1a1714",
          50: "#f6f5f3",
          900: "#1a1714",
          950: "#100e0c",
        },
        gold: {
          DEFAULT: "#c8a45c",
          light: "#e3c889",
          dark: "#a07e3c",
        },
        copper: {
          DEFAULT: "#b5764a",
          light: "#d39a6e",
          dark: "#8a5733",
        },
        cream: "#f5efe4",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #e3c889 0%, #c8a45c 50%, #a07e3c 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
