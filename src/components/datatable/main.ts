import * as Vue from 'vue'
import App from "./DataTable.ce.vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import {defineCustomElement} from "vue";
import {Mocker} from "@/classes/mocker";

const app = Vue.createApp(App);

app.config.globalProperties.$assets = 'src/assets/';

if (import.meta.env.DEV) {
    new Mocker().mock();
}

app.use(VueAxios, axios);
app.use(plugin, defaultConfig);

customElements.define('kikcms-datatable', defineCustomElement(App));