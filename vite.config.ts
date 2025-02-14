import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins: [vue({
        template: {
            compilerOptions: {
                isCustomElement: (tag) => tag.includes('kikcms-') || (process.env.VITEST ? tag.includes('v-') : false)
            }
        }
    }), vueJsx()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: process.env.BUILD_OUTDIR || 'dist'
    },
    base: '/cms/',
    // @ts-ignore
    test: {
        environment: 'jsdom',
        setupFiles: "vuetify.config.js",
        deps: {
            inline: ["vuetify"],
        },
        globals: true,
    },
    css: {
        preprocessorOptions: {
            scss: {additionalData: `@use "@/assets/media-query-sizes" as *; @use "@/assets/base" as *;`},
        },
    },
});
