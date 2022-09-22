import * as Vue from 'vue'
import App from "./App.vue";
import axios, {} from 'axios'
import router from "./router";
import DataTable from "@/components/datatable/DataTable.ce.vue";
import {plugin, defaultConfig} from '@formkit/vue'
import VueAxios from 'vue-axios'
import {defineCustomElement} from 'vue'
import {Mocker} from "@/classes/mocker";
import '@formkit/themes/genesis'

const app = Vue.createApp(App);

app.config.globalProperties.$assets = 'src/assets/';

if (import.meta.env.DEV) {
    new Mocker().mock();
}

app.use(router, VueAxios, axios);
app.use(plugin, defaultConfig);

customElements.define('kikcms-datatable', defineCustomElement(DataTable));

app.mount("#app");