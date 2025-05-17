import { createRouter, createWebHistory } from 'vue-router';

import PublicPage from "@/components/views/PublicPage.vue";

const routes = [
    {
        path: '/',
        name: 'public',
        component: PublicPage,
        meta: {},
    },
];

const router = createRouter({
    history: createWebHistory('/apps/voracious-appetite/'),
    routes
});

export default router;
