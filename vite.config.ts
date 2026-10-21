import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src/popup", import.meta.url)) } },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "assets/popup",
    emptyOutDir: true,
    copyPublicDir: false,
    lib: { entry: "src/popup/main.tsx", name: "LarpbloxPopup", formats: ["iife"], fileName: () => "popup.js", cssFileName: "popup" },
  },
});
