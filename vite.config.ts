import {defineConfig} from "vite";
import {fileURLToPath, URL} from "url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import basicSsl from '@vitejs/plugin-basic-ssl'
import vueDevTools from 'vite-plugin-vue-devtools'
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols

export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes('kikcms-'),
                }
            }
        }),
        vueJsx(),
        basicSsl(),
        vueDevTools(),
        istanbul({
            include: 'src/**/*',
            exclude: ['node_modules', 'test/', 'cypress/'],
            extension: ['.js', '.ts', '.vue'],
            requireEnv: false,
            cypress: true,
        })
    ],
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
            host: 'kikcms.test'
        }
    },
});
