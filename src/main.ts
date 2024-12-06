import Wrapper from "@/classes/wrapper";
import App from "./App.vue";
import router from "@/router";

const app = Wrapper.getApp(App);

app.use(router);
app.mount("#app");