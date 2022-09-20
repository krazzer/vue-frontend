import * as Vue from 'vue'
import App from "./App.vue";
import axios, {} from 'axios'
import VueAxios from 'vue-axios'
import router from "./router";
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import MockAdapter from "axios-mock-adapter";

const app = Vue.createApp(App);

app.config.globalProperties.assets = 'src/assets/';

if(import.meta.env.DEV) {
    app.config.globalProperties.$mocker = new MockAdapter(axios, {delayResponse: 50});
}

app.use(router, VueAxios, axios);
app.use(plugin, defaultConfig);

app.mount("#app");