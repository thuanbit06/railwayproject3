import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5159", // ✅ Đảm bảo là http, KHÔNG phải https
        changeOrigin: true,
        secure: false, // ✅ Đảm bảo có dòng này
      },
    },
  },
});
