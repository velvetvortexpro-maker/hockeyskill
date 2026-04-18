import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// To enable PWA after npm install, uncomment the VitePWA import and plugin below.
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   manifest: {
    //     name: "Hockey Skills Tracker",
    //     short_name: "HockeySkills",
    //     description: "Träna smartare. Bli bättre på hockey.",
    //     theme_color: "#0a0a0f",
    //     background_color: "#0a0a0f",
    //     display: "standalone",
    //     start_url: "/",
    //     icons: [
    //       { src: "/icons.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
    //     ],
    //   },
    //   workbox: { globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"] },
    // }),
  ],
});
