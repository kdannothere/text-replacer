import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { bedframe } from "@bedframe/core"
import chrome from "./src/manifest/chrome"

// https://vite.dev/config/
export default defineConfig({
  plugins: [bedframe([chrome]), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
