import * as VueRouter from 'vue-router'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: "/",
        name: "home",
        component: () => import("../components/home/Index.vue"),
    }, {
        path: "/login",
        name: "login",
        component: () => import("../components/login/Index.vue"),
    }, {
        path: "/login/password-lost",
        name: "passwordLost",
        component: () => import("../components/login/Reset.vue"),
    }, {
        path: '/:module',
        name: "module",
        component: () => import("../components/home/Index.vue"),
    }],
});

export default router;
