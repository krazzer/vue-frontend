import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('kikcms-')
      }
    }
  }), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: '/cms/'
});
