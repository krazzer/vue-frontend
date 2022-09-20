// noinspection JSUnusedGlobalSymbols, JSFileReferences
/// <reference types="vite/client" />
import MockAdapter from "axios-mock-adapter";

declare module 'vue/dist/vue.esm-bundler'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $mocker: MockAdapter,
        $assets: string,
    }
}

export {}