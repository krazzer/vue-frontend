// noinspection JSUnusedGlobalSymbols, JSFileReferences
/// <reference types="vite/client" />
import MockAdapter from "axios-mock-adapter";
import type {Translator} from "@/classes/translator";

declare module 'vue/dist/vue.esm-bundler'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $mocker: MockAdapter,
        $assets: string,
        $translator: Translator,
    }
}

export {}