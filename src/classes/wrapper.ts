import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {plugin, defaultConfig} from '@formkit/vue'
import '@formkit/themes/genesis'
import type {Component} from "vue";
import {Mocker} from "@/classes/mocker";
import {defineCustomElement} from "vue";
import DataTable from "@/components/datatable/DataTable.vue";

class Wrapper
{
    getApp(Component: Component){
        const app = Vue.createApp(Component);

        app.config.globalProperties.$assets = 'src/assets/';

        if (import.meta.env.DEV) {
            new Mocker().mock();
        }

        app.use(VueAxios, axios);
        app.use(plugin, defaultConfig);

        customElements.define('kikcms-datatable', defineCustomElement(DataTable));

        return app;
    }
}

export default new Wrapper();