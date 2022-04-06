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
        name: "passwordLost",
        component: () => import("../components/login/Reset.vue"),
    }, {
        path: '/:pathMatch(.*)*',
        name: "pageNotFound",
        component: () => import("../views/NotFoundView.vue"),
    }],
});

export default router;
