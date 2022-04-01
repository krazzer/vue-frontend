import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

const app = createApp(App);

app.use(router);
app.use(plugin, defaultConfig);

app.mount("#app");
