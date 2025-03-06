import * as VueRouter from 'vue-router'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: "/",
        name: "home",
        component: () => import("../components/home/Home.vue"),
    }, {
        path: "/login",
        name: "login",
        component: () => import("../components/login/Index.vue"),
    }, {
        path: "/login/password-lost",
        name: "passwordLost",
        component: () => import("../components/login/Lost.vue"),
    }, {
        path: "/login/password-reset/:id/:key/:token",
        name: "passwordReset",
        component: () => import("../components/login/Reset.vue"),
    }, {
        path: '/:module',
        name: "module",
        component: () => import("../components/home/Home.vue"),
    }],
});

export default router;
