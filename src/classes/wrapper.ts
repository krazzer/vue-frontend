import {createApp} from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import type {Component} from "vue";
import {Mocker} from "@/classes/mocker";
import {defineCustomElement, reactive} from "vue";
import DataTable from "@/components/datatable/DataTable.vue";
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {Translator} from "@/classes/translator";
import {DarkModeSetting} from "@/classes/DarkModeSetting";
import {appUtil} from "@/classes/AppUtil";
import Validator from "@/classes/validator";
import {aliases, mdi} from 'vuetify/iconsets/mdi'

declare const window: any;

class Wrapper {
    getApp(Component: Component) {
        const vuetifyIcons = {defaultSet: 'mdi', aliases, sets: {mdi}};
        const vuetify      = createVuetify({ssr: true, icons: vuetifyIcons});

        const app = createApp(Component).use(vuetify);

        app.config.globalProperties.$assets     = 'src/assets/';
        app.config.globalProperties.$translator = new Translator;
        app.config.globalProperties.$validator  = new Validator(app.config.globalProperties.$translator);
        app.config.globalProperties.$appUtil    = appUtil;
        app.config.globalProperties.$darkMode   = reactive(new DarkModeSetting);

        if (import.meta.env.DEV && !window.Cypress) {
            // initialize the mocker and make it available for console manipulation, e.g. to change the delay with
            // mocker.mocker.delayResponse = 1000
            (window as any).mocker = new Mocker().mock();
        }

        app.use(VueAxios, <any>axios);

        customElements.define('kikcms-datatable', defineCustomElement(DataTable));

        return app;
    }
}

export default new Wrapper();