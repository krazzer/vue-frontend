import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import type {Component} from "vue";
import {Mocker} from "@/classes/mocker";
import {defineCustomElement} from "vue";
import DataTable from "@/components/datatable/DataTable.vue";
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {Translator} from "@/classes/translator";

class Wrapper {
    getApp(Component: Component) {
        const vuetify = createVuetify({ssr: true, components, directives});

        const app = Vue.createApp(Component).use(vuetify);

        app.config.globalProperties.$assets = 'src/assets/';
        app.config.globalProperties.$translator = new Translator();

        if (import.meta.env.DEV) {
            new Mocker().mock();
        }

        app.use(VueAxios, axios);

        customElements.define('kikcms-datatable', defineCustomElement(DataTable));

        return app;
    }
}

export default new Wrapper();