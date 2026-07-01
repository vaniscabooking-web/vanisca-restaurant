import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces — deep charcoal / near-black
        charcoal: {
          DEFAULT: "#161311",
          50: "#f6f5f3",
          800: "#221d18",
          900: "#171310",
          950: "#0d0b09",
        },
        // Brass / gold — the primary metallic accent
        gold: {
          DEFAULT: "#c8a45c",
          light: "#e6cd93",
          dark: "#9c7c3e",
        },
        brass: {
          DEFAULT: "#b08d57",
          light: "#caa972",
          dark: "#876a3c",
        },
        copper: {
          DEFAULT: "#b5764a",
          light: "#d39a6e",
          dark: "#8a5733",
        },
        // Mediterranean olive
        olive: {
          DEFAULT: "#7c845a",
          light: "#9aa276",
          dark: "#565c3c",
        },
        // Warm beige / sand + cream for light passages
        sand: {
          DEFAULT: "#d9caac",
          light: "#ece2cd",
          dark: "#b8a888",
        },
        cream: "#f4eee2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.32em",
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
        "ken-burns": {
          "0%": { transform: "scale(1) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.12) translate3d(1.5%,-1.5%,0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "ken-burns": "ken-burns 18s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #e6cd93 0%, #c8a45c 48%, #9c7c3e 100%)",
      },
      boxShadow: {
        luxe: "0 30px 60px -20px rgba(0,0,0,0.7)",
        "gold-glow": "0 0 40px -8px rgba(200,164,92,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
