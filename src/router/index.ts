import * as VueRouter from 'vue-router'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: "/",
        name: "home",
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
