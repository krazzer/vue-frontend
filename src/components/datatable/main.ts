import * as Vue from 'vue'
import App from "./DataTable.vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

const app = Vue.createApp(App);

app.config.globalProperties.assets = 'src/assets/';

app.use(VueAxios, axios);
app.use(plugin, defaultConfig);

app.mount(".datatable");