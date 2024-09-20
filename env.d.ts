// noinspection JSUnusedGlobalSymbols, JSFileReferences
/// <reference types="vite/client" />
import MockAdapter from "axios-mock-adapter";
import type {Translator} from "@/classes/translator";
import type {DarkModeSetting} from "@/classes/DarkModeSetting";
import type {AppUtil} from "@/classes/AppUtil";

declare module 'vue/dist/vue.esm-bundler'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $mocker: MockAdapter,
        $assets: string,
        $translator: Translator,
        $appUtil: AppUtil,
        $darkMode: DarkModeSetting,
    }
}

export {}