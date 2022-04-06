import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: "/",
        name: "cms",
        component: () => import("../views/HomeView.vue"),
    }, {
        path: "/login",
        name: "login",
        component: () => import("../components/login/Index.vue"),
    }, {
        path: "/login/password-lost",
        name: "password-lost",
        component: () => import("../components/login/Reset.vue"),
    }],
});

export default router;
