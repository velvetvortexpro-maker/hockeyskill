/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ice: {
          950: "#0a0a0f",
          900: "#12121c",
          800: "#1a1a2e",
          700: "#23233b",
          600: "#2e2e4d",
        },
        neon: {
          cyan: "#00f5ff",
          gold: "#ffd700",
          red: "#ff3860",
          green: "#2dd4bf",
        },
      },
      fontFamily: {
        display: ['"Oswald"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(0, 245, 255, 0.35)",
        gold: "0 0 30px rgba(255, 215, 0, 0.45)",
      },
      backgroundImage: {
        "card-grad":
          "linear-gradient(135deg, #0b1430 0%, #142046 45%, #1a2b63 70%, #2a3f8a 100%)",
        "gold-grad":
          "linear-gradient(135deg, #3a2b00 0%, #866600 45%, #ffd700 100%)",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 10px rgba(0,245,255,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0,245,255,0.7)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        shine: "shine 3s linear infinite",
      },
    },
  },
  plugins: [],
};
