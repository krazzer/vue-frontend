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
        component: () => import("../views/LoginView.vue"),
    }, {
        path: "/login/password-lost",
        name: "password-lost",
        component: () => import("../views/PasswordLostView.vue"),
    }],
});

export default router;
