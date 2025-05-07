import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import basicSsl from '@vitejs/plugin-basic-ssl'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols

export default defineConfig({
    plugins: [vue({
        template: {
            compilerOptions: {
                isCustomElement: (tag) => tag.includes('kikcms-') || (process.env.VITEST ? tag.includes('v-') : false)
            }
        }
    }), vueJsx(), basicSsl(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        outDir: process.env.BUILD_OUTDIR || 'dist'
    },
    base: '/cms',
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
    server: {
        // @ts-ignore
        https: true,
        cors: {
            credentials: true
        },
        hmr: {
            protocol: 'wss',
            host: 'localhost'
        }
    },
});
